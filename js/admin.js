/* ==========================================================================
   BIG BROTHER HAIR & BEAUTY SALON - ADMIN DASHBOARD ENGINE
   ========================================================================== */

let appointmentsData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
  setupAdminListeners();
});

async function fetchDashboardData() {
  try {
    const [statsRes, apptsRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/appointments')
    ]);

    const statsData = await statsRes.json();
    const apptsData = await apptsRes.json();

    if (statsData.success) {
      renderStats(statsData.stats);
    }

    if (apptsData.success) {
      appointmentsData = apptsData.appointments || [];
      renderAppointmentsTable(appointmentsData);
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    showToast('Failed to load live appointment data', 'error');
  }
}

function renderStats(stats) {
  const elTotal = document.getElementById('statTotalBookings');
  const elToday = document.getElementById('statTodayBookings');
  const elRevenue = document.getElementById('statEstimatedRevenue');
  const elConfirmed = document.getElementById('statConfirmedCount');

  if (elTotal) elTotal.textContent = stats.totalBookings || 0;
  if (elToday) elToday.textContent = stats.todayBookings || 0;
  if (elRevenue) elRevenue.textContent = `₹${(stats.estimatedRevenue || 0).toLocaleString('en-IN')}`;
  if (elConfirmed) elConfirmed.textContent = stats.confirmedCount || 0;
}

function renderAppointmentsTable(list) {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">No appointments found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(item => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>
        <div><strong>${item.name}</strong></div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${item.phone}</div>
      </td>
      <td>${item.serviceName}</td>
      <td>₹${Number(item.servicePrice).toLocaleString('en-IN')}</td>
      <td>${item.date} <br><span style="font-size:0.8rem; color:var(--gold-light);">${item.timeSlot}</span></td>
      <td>${item.stylist}</td>
      <td>
        <span class="status-badge status-${item.status || 'confirmed'}">${item.status || 'confirmed'}</span>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-sm btn-glass" title="Mark as Completed" onclick="updateStatus('${item.id}', 'completed')">
            ✓
          </button>
          <button class="btn btn-sm btn-glass" title="Cancel Appointment" onclick="updateStatus('${item.id}', 'cancelled')" style="color:#E74C3C;">
            ✕
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function updateStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();
    if (data.success) {
      showToast(`Appointment ${id} marked as ${newStatus}`, 'success');
      fetchDashboardData();
    } else {
      showToast(data.message || 'Update failed', 'error');
    }
  } catch (err) {
    console.error('Update status error:', err);
    showToast('Failed to update status', 'error');
  }
}

function setupAdminListeners() {
  const searchInput = document.getElementById('adminSearch');
  const statusFilter = document.getElementById('adminStatusFilter');
  const exportBtn = document.getElementById('exportCsvBtn');

  const filterTable = () => {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const status = statusFilter ? statusFilter.value : 'all';

    const filtered = appointmentsData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(query) ||
                          item.phone.includes(query) ||
                          item.id.toLowerCase().includes(query) ||
                          item.serviceName.toLowerCase().includes(query);
      const matchStatus = status === 'all' || item.status === status;
      return matchSearch && matchStatus;
    });

    renderAppointmentsTable(filtered);
  };

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (statusFilter) statusFilter.addEventListener('change', filterTable);

  if (exportBtn) {
    exportBtn.addEventListener('click', exportToCsv);
  }
}

function exportToCsv() {
  if (!appointmentsData.length) {
    showToast('No data to export', 'error');
    return;
  }

  const headers = ['Booking ID', 'Created At', 'Name', 'Phone', 'Email', 'Service', 'Price (INR)', 'Stylist', 'Date', 'Time Slot', 'Status', 'Notes'];
  const rows = appointmentsData.map(a => [
    `"${a.id}"`,
    `"${a.createdAt || ''}"`,
    `"${a.name.replace(/"/g, '""')}"`,
    `"${a.phone}"`,
    `"${a.email || ''}"`,
    `"${a.serviceName.replace(/"/g, '""')}"`,
    a.servicePrice,
    `"${a.stylist.replace(/"/g, '""')}"`,
    `"${a.date}"`,
    `"${a.timeSlot}"`,
    `"${a.status}"`,
    `"${(a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BigBrother_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Appointments exported to CSV successfully!', 'success');
}

window.updateStatus = updateStatus;
