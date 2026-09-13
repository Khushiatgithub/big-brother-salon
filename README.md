# Big Brother Hair & Beauty Salon — Luxury Web Platform & Booking Engine

A luxury, production-grade web application and appointment booking engine built for **Big Brother Hair & Beauty Salon**, located in **Paharganj, New Delhi**.

---

## 🌟 Brand Aesthetics & Key Highlights

- **Visual Design**: Obsidian Black (`#0A0A0A`), Champagne & Imperial Gold (`#C8A44D`), and Warm Ivory typography.
- **Micro-Interactions**: Glassmorphic cards with frosted backdrop blur, glowing borders, smooth hero image motion, floating WhatsApp concierge widget.
- **Transformational Proof**: Interactive split-screen Before/After image comparison slider (touch and mouse enabled).
- **Responsive Perfection**: Fully optimized across mobile, tablet, and widescreen desktop displays.
- **Fast Performance**: Pure Vanilla JavaScript with zero client-side library bloat.

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Design System, Flexbox, CSS Grid), Vanilla JavaScript (ES6+).
- **Backend**: Node.js with Express.js REST API.
- **Persistence**: JSON-based document store with instant file I/O (`data/appointments.json`, `data/inquiries.json`, `data/subscribers.json`).
- **Typography**: Google Fonts (*Playfair Display* & *Outfit*).

---

## 📂 Project Architecture

```
Big Brother Hair & Beauty Salon/
├── css/
│   └── style.css           # Luxury design system, glassmorphism, responsive utilities
├── js/
│   ├── main.js             # Navbar, mobile drawer, counters, FAQ accordion, status indicator
│   ├── booking.js          # Reactive appointment booking flow, slot selection, modal & .ics download
│   ├── gallery.js          # Masonry filters, lightbox viewer, before/after slider engine
│   └── admin.js            # Operations dashboard, search/filter, status updater, CSV export
├── images/                 # Studio photography (interior, haircuts, balayage, bridal, grooming)
├── data/
│   ├── appointments.json   # Persisted booking submissions with unique BB-2026 IDs
│   ├── inquiries.json      # Client contact inquiries
│   └── subscribers.json    # VIP newsletter subscribers
├── index.html              # Home page with hero, quick book, stats, services, before/after, FAQ
├── about.html              # Heritage in Paharganj, master stylist profiles, 10-point hygiene charter
├── services.html           # Categorized price menu with transparent pricing in INR ₹
├── gallery.html            # Filterable masonry showcase & before/after transformations
├── booking.html            # Multi-step booking engine with real-time summary calculation
├── contact.html            # Paharganj location guide, embedded Google Maps, business hours
├── admin.html              # Studio management portal for staff & managers
├── server.js               # Express backend API & static server
├── package.json            # Node.js dependencies & scripts
└── README.md               # Documentation & operational guide
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v16+ recommended) and **npm** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```
The server will boot on `http://localhost:3000`.

---

## 🌐 Pages & URLs

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Home** | `http://localhost:3000/index.html` | Hero, quick-booking strip, stats, signature services, interactive before/after, reviews, FAQ |
| **About** | `http://localhost:3000/about.html` | Salon story in Paharganj, master stylists, luxury brand partners, 10-point hygiene charter |
| **Services** | `http://localhost:3000/services.html` | Complete price list categorized by Hair, Balayage, Keratin, Facials, Waxing, Bridal, Nails |
| **Gallery** | `http://localhost:3000/gallery.html` | Filterable portfolio, before/after slider, and fullscreen lightbox modal |
| **Book Appointment** | `http://localhost:3000/booking.html` | Step-by-step appointment scheduling, time slot chips, instant summary, calendar download |
| **Contact** | `http://localhost:3000/contact.html` | Embedded Google Map, Metro/Railway directions, business hours table, inquiry form |
| **Admin Operations** | `http://localhost:3000/admin.html` | View live bookings, change status, search clients, export to CSV |

---

## 🔌 Backend API Endpoints

- `GET /api/services` — Returns categorized service catalog with pricing and duration.
- `POST /api/appointments` — Books appointment, validates inputs, assigns unique `BB-2026-XXXX` ID, saves to `appointments.json`.
- `GET /api/appointments` — Returns list of all booked appointments.
- `PATCH /api/appointments/:id/status` — Updates status (`confirmed`, `completed`, `cancelled`).
- `DELETE /api/appointments/:id` — Removes appointment.
- `POST /api/contact` — Receives contact inquiries and saves to `inquiries.json`.
- `POST /api/newsletter` — Adds email to VIP club list.
- `GET /api/stats` — Provides summary operational metrics for admin dashboard.

---

## 📍 Studio Location & Contact

- **Studio**: Big Brother Hair & Beauty Salon
- **Address**: Main Bazaar Road (Near NDLS / Imperial Cinema), Paharganj, New Delhi - 110055
- **Metro**: 3 minutes from RK Ashram Marg (Blue Line)
- **Railway**: 5 minutes from New Delhi Railway Station (Paharganj side exit)
- **Phone**: +91 98765 43210
- **Hours**: Open 7 Days a week (10:00 AM – 9:00 PM)
