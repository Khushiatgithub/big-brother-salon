/* ==========================================================================
   BIG BROTHER HAIR & BEAUTY SALON - BOOKING ENGINE JAVASCRIPT
   ========================================================================== */

const SERVICES_CATALOG = {
  "hair-cut-style": { name: "Couture Haircut & Scalp Rejuvenation", category: "Hair", price: 999, duration: "45 mins" },
  "hair-fade-beard": { name: "Signature Fade Haircut + Beard Spa Sculpting", category: "Hair", price: 1299, duration: "40 mins" },
  "hair-balayage": { name: "French Balayage & Glossing Treatment", category: "Hair Color", price: 4999, duration: "150 mins" },
  "hair-global-color": { name: "Global Hair Color + Keratin Infusion", category: "Hair Color", price: 3499, duration: "90 mins" },
  "keratin-smoothing": { name: "Brazilian Keratin Smoothening Therapy", category: "Treatments", price: 4999, duration: "180 mins" },
  "hair-botox": { name: "Deep Botox Hair Reconstruct & Olaplex Spa", category: "Treatments", price: 3999, duration: "90 mins" },
  "hydra-facial": { name: "7-Step Clinical Luxury HydraFacial MD", category: "Facials", price: 2999, duration: "60 mins" },
  "gold-bridal-facial": { name: "24K Imperial Gold Radiance Facial", category: "Facials", price: 3499, duration: "75 mins" },
  "painless-waxing": { name: "Full Body Rica Brazilian Waxing Spa", category: "Waxing", price: 2499, duration: "90 mins" },
  "royal-bridal-makeup": { name: "Royal Mughal Bridal Makeover & Hair Styling", category: "Bridal", price: 14999, duration: "210 mins" },
  "party-glam-makeup": { name: "Red Carpet Party Glam & Hollywood Waves", category: "Bridal", price: 4999, duration: "90 mins" },
  "nail-extensions": { name: "Gel Nail Extensions & Chrome Ombré Art", category: "Nail Spa", price: 1999, duration: "75 mins" }
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingEngine();
});

function initBookingEngine() {
  const form = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('bookingService');
  const stylistSelect = document.getElementById('bookingStylist');
  const dateInput = document.getElementById('bookingDate');
  const slotContainer = document.getElementById('timeSlotsContainer');

  if (!form) return;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  if (dateInput) {
    dateInput.min = today;
    // default to tomorrow if today is past 8pm
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Handle URL search params (e.g. ?service=keratin-smoothing)
  const urlParams = new URLSearchParams(window.location.search);
  const prefillService = urlParams.get('service');
  const prefillDate = urlParams.get('date');
  const prefillStylist = urlParams.get('stylist');

  if (prefillService && serviceSelect) {
    serviceSelect.value = prefillService;
  }
  if (prefillDate && dateInput) {
    dateInput.value = prefillDate;
  }
  if (prefillStylist && stylistSelect) {
    stylistSelect.value = prefillStylist;
  }

  // Populate slots
  renderTimeSlots();

  // Update Summary on input changes
  updateSummary();

  if (serviceSelect) serviceSelect.addEventListener('change', updateSummary);
  if (stylistSelect) stylistSelect.addEventListener('change', updateSummary);
  if (dateInput) dateInput.addEventListener('change', updateSummary);

  // Handle Form Submission
  form.addEventListener('submit', handleBookingSubmit);
}

/**
 * Render Time Slot Options
 */
function renderTimeSlots() {
  const container = document.getElementById('timeSlotsContainer');
  if (!container) return;

  const slots = [
    { time: "10:30 AM", period: "Morning" },
    { time: "11:30 AM", period: "Morning" },
    { time: "12:30 PM", period: "Morning" },
    { time: "01:30 PM", period: "Afternoon" },
    { time: "02:45 PM", period: "Afternoon" },
    { time: "04:00 PM", period: "Afternoon" },
    { time: "05:15 PM", period: "Evening" },
    { time: "06:30 PM", period: "Evening" },
    { time: "07:45 PM", period: "Evening" }
  ];

  container.innerHTML = '';
  slots.forEach((slot, idx) => {
    const chip = document.createElement('div');
    chip.className = `slot-chip ${idx === 1 ? 'selected' : ''}`;
    chip.setAttribute('data-slot', slot.time);
    chip.innerHTML = `<span>${slot.time}</span>`;
    
    chip.addEventListener('click', () => {
      document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      updateSummary();
    });

    container.appendChild(chip);
  });
}

/**
 * Reactive Summary Card Updater
 */
function updateSummary() {
  const serviceSelect = document.getElementById('bookingService');
  const stylistSelect = document.getElementById('bookingStylist');
  const dateInput = document.getElementById('bookingDate');
  const selectedSlotEl = document.querySelector('.slot-chip.selected');

  const summaryService = document.getElementById('summaryServiceName');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryStylist = document.getElementById('summaryStylist');
  const summaryDate = document.getElementById('summaryDate');
  const summarySlot = document.getElementById('summarySlot');
  const summaryPrice = document.getElementById('summaryPrice');

  const selectedServiceKey = serviceSelect ? serviceSelect.value : 'hair-cut-style';
  const serviceInfo = SERVICES_CATALOG[selectedServiceKey] || {
    name: "Couture Haircut & Scalp Rejuvenation",
    price: 999,
    duration: "45 mins"
  };

  if (summaryService) summaryService.textContent = serviceInfo.name;
  if (summaryDuration) summaryDuration.textContent = serviceInfo.duration;
  if (summaryStylist) summaryStylist.textContent = stylistSelect ? stylistSelect.options[stylistSelect.selectedIndex].text : 'Any Senior Stylist';
  
  if (summaryDate && dateInput && dateInput.value) {
    const d = new Date(dateInput.value);
    summaryDate.textContent = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (summarySlot && selectedSlotEl) {
    summarySlot.textContent = selectedSlotEl.getAttribute('data-slot') || '11:30 AM';
  }

  if (summaryPrice) {
    summaryPrice.textContent = `₹${serviceInfo.price.toLocaleString('en-IN')}`;
  }
}

/**
 * Form Submit Action
 */
async function handleBookingSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const emailInput = document.getElementById('clientEmail');
  const notesInput = document.getElementById('clientNotes');
  const serviceSelect = document.getElementById('bookingService');
  const stylistSelect = document.getElementById('bookingStylist');
  const dateInput = document.getElementById('bookingDate');
  const selectedSlotEl = document.querySelector('.slot-chip.selected');
  const submitBtn = document.getElementById('submitBookingBtn');

  if (!nameInput.value.trim()) {
    showToast('Please enter your full name', 'error');
    nameInput.focus();
    return;
  }

  if (!phoneInput.value.trim() || phoneInput.value.trim().length < 10) {
    showToast('Please enter a valid 10-digit phone number', 'error');
    phoneInput.focus();
    return;
  }

  const selectedSlot = selectedSlotEl ? selectedSlotEl.getAttribute('data-slot') : '11:30 AM';
  const serviceKey = serviceSelect.value;
  const serviceInfo = SERVICES_CATALOG[serviceKey] || { name: 'Signature Service', price: 999, duration: '45 mins' };

  const payload = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput ? emailInput.value.trim() : '',
    serviceId: serviceKey,
    serviceName: serviceInfo.name,
    servicePrice: serviceInfo.price,
    stylist: stylistSelect ? stylistSelect.options[stylistSelect.selectedIndex].text : 'Senior Stylist',
    date: dateInput.value,
    timeSlot: selectedSlot,
    notes: notesInput ? notesInput.value.trim() : ''
  };

  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
    </svg>
    <span>Confirming Appointment...</span>
  `;

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success && data.appointment) {
      showConfirmationModal(data.appointment);
    } else {
      // Fallback for standalone demo if server offline
      const mockId = `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      showConfirmationModal({ ...payload, id: mockId });
    }
  } catch (err) {
    console.warn('Network error, showing local confirmed modal:', err);
    const mockId = `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    showConfirmationModal({ ...payload, id: mockId });
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

/**
 * Show Luxury Confirmation Modal
 */
function showConfirmationModal(appointment) {
  const modal = document.getElementById('confirmationModal');
  if (!modal) return;

  document.getElementById('modalBookingId').textContent = appointment.id;
  document.getElementById('modalClientName').textContent = appointment.name;
  document.getElementById('modalServiceName').textContent = appointment.serviceName;
  document.getElementById('modalDateTime').textContent = `${appointment.date} at ${appointment.timeSlot}`;
  document.getElementById('modalStylist').textContent = appointment.stylist;
  document.getElementById('modalPrice').textContent = `₹${Number(appointment.servicePrice).toLocaleString('en-IN')}`;

  // WhatsApp share link
  const waBtn = document.getElementById('modalWhatsAppBtn');
  if (waBtn) {
    const msg = `Hi Big Brother Salon! I have just booked an appointment.%0A%0A*Reference ID:* ${appointment.id}%0A*Name:* ${appointment.name}%0A*Service:* ${appointment.serviceName}%0A*Date & Time:* ${appointment.date} at ${appointment.timeSlot}%0A*Stylist:* ${appointment.stylist}%0A%0APlease confirm my slot at Paharganj, New Delhi studio. Thank you!`;
    waBtn.href = `https://wa.me/919876543210?text=${msg}`;
  }

  // Calendar Event .ics download
  const calBtn = document.getElementById('modalCalendarBtn');
  if (calBtn) {
    calBtn.onclick = () => generateCalendarEvent(appointment);
  }

  modal.classList.add('active');

  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
      window.location.href = 'index.html';
    };
  }
}

/**
 * Generate iCalendar (.ics) file
 */
function generateCalendarEvent(appointment) {
  const dateParts = appointment.date.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  
  // Create simple ics string
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Big Brother Salon//Appointment Booking//EN',
    'BEGIN:VEVENT',
    `SUMMARY:Big Brother Salon: ${appointment.serviceName}`,
    `DESCRIPTION:Appointment ID: ${appointment.id}\\nStylist: ${appointment.stylist}\\nPhone: ${appointment.phone}`,
    `LOCATION:Big Brother Hair & Beauty Salon, Main Bazaar Road, Paharganj, New Delhi - 110055`,
    `DTSTART:${year}${month}${day}T110000Z`,
    `DTEND:${year}${month}${day}T123000Z`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BigBrotherSalon-Appointment-${appointment.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Calendar event downloaded!', 'success');
}
