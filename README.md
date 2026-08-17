# 🚀 Blueboxx DA - Frontend Platform

A state-of-the-art, high-performance Web Application built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. **Blueboxx DA** provides an all-in-one edtech and career ecosystem offering interactive learning courses, 1:1 mentorship booking with industry experts, virtual live classes, job & internship application tracking, college placement drives, and real-time dashboard analytics.

---

## ✨ Key Features

- 🎓 **Course Catalog & LMS Engine**: Interactive course browsing, video lessons, quiz module evaluations, downloadable resources, and auto-generated certificates.
- 👨‍🏫 **1:1 Expert Mentorship Booking**: Dynamic calendar date selector, time slot booking, and Razorpay payment checkout integration.
- 💳 **Billing & Payment Management**: Real-time order tracking, total spent calculation, and instant 1-page printable tax invoices (`@media print` optimized).
- 📊 **Multi-Role Dashboard Portals**:
  - **Student Portal**: Dashboard analytics, registered virtual classes, MCQ quiz results, application status tracking, referral rewards, and support ticketing.
  - **College & Placement Portal**: Manage campus placement drives, company invitations, student rosters, and drive status.
  - **Company & Employer Portal**: Post job/internship openings, evaluate applicants, schedule interview rounds, and manage offers.
  - **Admin Control Center**: Content management (CMS), user role approvals, log monitoring, and platform settings.
- 🔔 **Real-Time Notifications & Modals**: Interactive notification bell dropdowns, preloader animations, custom glassmorphism overlays, and onboarding tour guides.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router) & [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS tokens & [Tailwind CSS](https://tailwindcss.com/)
- **State Management & Data Fetching**: [SWR](https://swr.vercel.app/) & React Context API
- **Icons & UI Utilities**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **HTTP Client**: Axios (configured with token interceptors and automatic fallback)
- **Payment Gateway**: [Razorpay Checkout SDK Integration](https://razorpay.com/)

---

## 📁 Directory Structure

```text
├── pages/                   # Next.js Pages & Route Handlers
│   ├── student/             # Student Dashboard, Courses, Virtual Classes, Payments
│   ├── experts/             # Expert Profiles & 1:1 Booking Calendar
│   ├── college/             # College Placement & Student Management
│   ├── company/             # Employer Portal & Job Openings
│   ├── payment-success.tsx  # Printable Tax Invoice & Confirmation View
│   └── payment-failed.tsx   # Transaction Failure & Retry View
├── src/
│   ├── components/          # Reusable UI Components, Modals, Filters, & Notifications
│   ├── context/             # Global Auth, Theme, & Tour Providers
│   ├── layout/              # Multi-Role Dashboard & Page Layout Containers
│   └── lib/                 # Axios Client & API Helper Utilities
└── public/                  # Media Assets, Logos, and Testimonial Photos
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/samihavahora05/Frontend_BB.git
cd Frontend_BB
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
Privately developed for **Blueboxx DA Pvt. Ltd.** All rights reserved.
