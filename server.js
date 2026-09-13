const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// File Paths
const DATA_DIR = path.join(__dirname, 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state cache for serverless environments (Vercel)
let inMemoryAppointments = null;
let inMemoryInquiries = null;
let inMemorySubscribers = null;

function readJSON(filePath, defaultVal = []) {
  try {
    if (filePath.includes('appointments.json') && inMemoryAppointments !== null) {
      return inMemoryAppointments;
    }
    if (filePath.includes('inquiries.json') && inMemoryInquiries !== null) {
      return inMemoryInquiries;
    }
    if (filePath.includes('subscribers.json') && inMemorySubscribers !== null) {
      return inMemorySubscribers;
    }

    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
      } catch (e) {
        // Read-only filesystem in serverless
      }
      return defaultVal;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    
    if (filePath.includes('appointments.json')) inMemoryAppointments = parsed;
    if (filePath.includes('inquiries.json')) inMemoryInquiries = parsed;
    if (filePath.includes('subscribers.json')) inMemorySubscribers = parsed;

    return parsed;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultVal;
  }
}

function writeJSON(filePath, data) {
  try {
    if (filePath.includes('appointments.json')) inMemoryAppointments = data;
    if (filePath.includes('inquiries.json')) inMemoryInquiries = data;
    if (filePath.includes('subscribers.json')) inMemorySubscribers = data;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    // In serverless, filesystem is read-only; in-memory cache preserves data during execution
    console.warn(`Filesystem write notice for ${filePath} (cached in memory):`, err.message);
    return true;
  }
}


// Service Catalog Data
const SERVICES = [
  {
    id: "hair-cut-style",
    category: "hair",
    name: "Couture Haircut & Scalp Rejuvenation",
    duration: "45 mins",
    price: 999,
    popular: true,
    description: "Personalized consultation, bespoke haircut, luxury hair wash with L'Oréal Mythic Oil, and signature blow-dry finish."
  },
  {
    id: "hair-fade-beard",
    category: "hair",
    name: "Signature Fade Haircut + Beard Spa Sculpting",
    duration: "40 mins",
    price: 1299,
    popular: true,
    description: "Precision clipper skin fade, beard shaping, hot towel eucalyptus steam treatment, and conditioning oil massage."
  },
  {
    id: "hair-balayage",
    category: "color",
    name: "French Balayage & Glossing Treatment",
    duration: "150 mins",
    price: 4999,
    popular: true,
    description: "Hand-painted sun-kissed dimension using ammonia-free L'Oréal INOA pigments followed by Dia Light glossing."
  },
  {
    id: "hair-global-color",
    category: "color",
    name: "Global Hair Color + Keratin Infusion",
    duration: "90 mins",
    price: 3499,
    popular: false,
    description: "Complete rich color coverage with nourishing micro-keratin infusion for luminous shine and deep protection."
  },
  {
    id: "keratin-smoothing",
    category: "treatments",
    name: "Brazilian Keratin Smoothening Therapy",
    duration: "180 mins",
    price: 4999,
    popular: true,
    description: "Formaldehyde-free intensive smoothing treatment that eliminates 95% frizz, leaving mirror-sheen silky hair for 4-6 months."
  },
  {
    id: "hair-botox",
    category: "treatments",
    name: "Deep Botox Hair Reconstruct & Olaplex Spa",
    duration: "90 mins",
    price: 3999,
    popular: false,
    description: "Advanced protein, collagen & Olaplex No. 1 & 2 reconstructive therapy for chemically damaged or dry brittle hair."
  },
  {
    id: "hydra-facial",
    category: "facials",
    name: "7-Step Clinical Luxury HydraFacial MD",
    duration: "60 mins",
    price: 2999,
    popular: true,
    description: "Deep vortex vacuum pore extraction, fruit acid peel, ultrasonic serum infusion, RF tightening, and 24K Gold LED mask."
  },
  {
    id: "gold-bridal-facial",
    category: "facials",
    name: "24K Imperial Gold Radiance Facial",
    duration: "75 mins",
    price: 3499,
    popular: false,
    description: "Luxury gold leaf massage, botanical brightening boosters, lymphatic drainage, and cryo-globe cooling therapy."
  },
  {
    id: "painless-waxing",
    category: "waxing",
    name: "Full Body Rica Brazilian Waxing Spa",
    duration: "90 mins",
    price: 2499,
    popular: true,
    description: "Imported Italian liposoluble colophony-free wax for sensitive skin, zero redness, followed by soothing chamomile serum."
  },
  {
    id: "royal-bridal-makeup",
    category: "bridal",
    name: "Royal Mughal Bridal Makeover & Hair Styling",
    duration: "210 mins",
    price: 14999,
    popular: true,
    description: "Ultra-HD airbrush makeup, MAC / Huda Beauty cosmetics, couture bridal hairstyle, drape styling, lashes, and lenses."
  },
  {
    id: "party-glam-makeup",
    category: "bridal",
    name: "Red Carpet Party Glam & Hollywood Waves",
    duration: "90 mins",
    price: 4999,
    popular: false,
    description: "Luminous dewy base, smokey/cut-crease eye artistry, mink lashes, and classic Hollywood wave or textured updo styling."
  },
  {
    id: "nail-extensions",
    category: "nails",
    name: "Gel Nail Extensions & Chrome Ombré Art",
    duration: "75 mins",
    price: 1999,
    popular: true,
    description: "Full set acrylic or hard gel extensions, cuticle care, chrome mirror or Swarovski stone embellishments."
  }
];

// --- API ENDPOINTS ---

// Get services catalog
app.get('/api/services', (req, res) => {
  res.json({ success: true, services: SERVICES });
});

// Book appointment
app.post('/api/appointments', (req, res) => {
  try {
    const { name, phone, email, serviceId, serviceName, servicePrice, stylist, date, timeSlot, notes } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a valid client full name.' });
    }
    if (!phone || phone.trim().length < 9) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number.' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Please select a preferred appointment date.' });
    }
    if (!timeSlot) {
      return res.status(400).json({ success: false, message: 'Please choose a preferred time slot.' });
    }

    // Generate unique reference ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const id = `BB-2026-${randomCode}`;

    const newAppointment = {
      id,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      serviceId: serviceId || 'custom-service',
      serviceName: serviceName || 'Signature Salon Service',
      servicePrice: Number(servicePrice) || 999,
      stylist: stylist || 'Any Senior Master Stylist',
      date,
      timeSlot,
      notes: (notes || '').trim(),
      status: 'confirmed'
    };

    const appointments = readJSON(APPOINTMENTS_FILE);
    appointments.unshift(newAppointment);
    writeJSON(APPOINTMENTS_FILE, appointments);

    console.log(`[APPOINTMENT CREATED] ${id} - ${newAppointment.name} (${newAppointment.serviceName}) on ${newAppointment.date} at ${newAppointment.timeSlot}`);

    res.status(201).json({
      success: true,
      message: 'Your appointment has been successfully scheduled! We look forward to welcoming you at Big Brother Salon.',
      appointment: newAppointment
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ success: false, message: 'Server error processing your appointment. Please call us directly.' });
  }
});

// Get all appointments (Admin)
app.get('/api/appointments', (req, res) => {
  const appointments = readJSON(APPOINTMENTS_FILE);
  res.json({ success: true, count: appointments.length, appointments });
});

// Update appointment status
app.patch('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['confirmed', 'completed', 'cancelled', 'pending'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status provided.' });
  }

  const appointments = readJSON(APPOINTMENTS_FILE);
  const target = appointments.find(a => a.id === id);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  target.status = status;
  target.updatedAt = new Date().toISOString();
  writeJSON(APPOINTMENTS_FILE, appointments);

  res.json({ success: true, message: `Appointment ${id} status updated to ${status}.`, appointment: target });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  let appointments = readJSON(APPOINTMENTS_FILE);
  const initialLen = appointments.length;
  appointments = appointments.filter(a => a.id !== id);

  if (appointments.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  writeJSON(APPOINTMENTS_FILE, appointments);
  res.json({ success: true, message: `Appointment ${id} removed.` });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone, and message are required.' });
    }

    const inquiries = readJSON(INQUIRIES_FILE);
    const newInquiry = {
      id: `INQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      email: (email || '').trim(),
      phone: phone.trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim()
    };

    inquiries.unshift(newInquiry);
    writeJSON(INQUIRIES_FILE, inquiries);

    res.json({
      success: true,
      message: 'Thank you for reaching out! Our salon manager in Paharganj will get back to you shortly.'
    });
  } catch (err) {
    console.error('Error in contact:', err);
    res.status(500).json({ success: false, message: 'Could not send message. Please call us directly.' });
  }
});

// VIP Club / Newsletter
app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const subscribers = readJSON(SUBSCRIBERS_FILE, []);
    if (!subscribers.some(s => s.email === email.toLowerCase().trim())) {
      subscribers.push({
        email: email.toLowerCase().trim(),
        subscribedAt: new Date().toISOString()
      });
      writeJSON(SUBSCRIBERS_FILE, subscribers);
    }

    res.json({
      success: true,
      message: 'Welcome to the Big Brother VIP Club! You will receive exclusive 20% off privileges on your next visit.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again.' });
  }
});

// Salon Stats API for Admin
app.get('/api/stats', (req, res) => {
  const appointments = readJSON(APPOINTMENTS_FILE);
  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (Number(a.servicePrice) || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = appointments.filter(a => a.date === todayStr);

  res.json({
    success: true,
    stats: {
      totalBookings: appointments.length,
      todayBookings: todayBookings.length,
      estimatedRevenue: totalRevenue,
      confirmedCount: appointments.filter(a => a.status === 'confirmed').length,
      completedCount: appointments.filter(a => a.status === 'completed').length,
      cancelledCount: appointments.filter(a => a.status === 'cancelled').length
    }
  });
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', salon: 'Big Brother Hair & Beauty Salon, Paharganj, New Delhi', uptime: process.uptime() });
});

// HTML Page Routes for direct navigation & Vercel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'gallery.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'booking.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start Server if run directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  BIG BROTHER HAIR & BEAUTY SALON SERVER STARTED    `);
    console.log(`  Location: Paharganj, New Delhi                   `);
    console.log(`  Local URL: http://localhost:${PORT}              `);
    console.log(`====================================================`);
  });
}

module.exports = app;

