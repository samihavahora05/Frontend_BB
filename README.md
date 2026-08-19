<div align="left">
  <table>
    <tr>
      <td valign="center">
        <img src="public/Boxxlogo.png" alt="Blueboxx DA Logo" width="140" />
      </td>
      <td valign="center">
        <h1 style="border-bottom: none; margin-bottom: 0; font-size: 2.2em; color: #1B2A6B;">Blueboxx DA Pvt. Ltd.</h1>
        <p style="font-size: 1.1em; color: #475569; margin-top: 4px;"><b>Modern EdTech & Career Ecosystem — Next.js Platform</b></p>
      </td>
    </tr>
  </table>

  <br />

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://razorpay.com/"><img src="https://img.shields.io/badge/Razorpay-SDK_Integrated-02042B?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" /></a>
  </p>
</div>

---

> 💡 **Blueboxx DA** is an enterprise-grade EdTech and Talent Ecosystem empowering Students, Industry Mentors, Higher Education Colleges, and Hiring Enterprises in a unified digital platform.

---

## 🔥 Highlights & Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎓 Course Catalog & LMS Engine</h3>
      <ul>
        <li>Interactive course browsing with difficulty levels and filter panels</li>
        <li>Video lesson playlists and progress tracking</li>
        <li>Automated quiz evaluations and verifiable certificates</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>👨‍🏫 1:1 Expert Mentorship</h3>
      <ul>
        <li>Dynamic week-by-week calendar & slot reservation</li>
        <li>Automatic mentor resolution & custom notes</li>
        <li>Instant booking notification dispatches</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💳 Billing & Printable Invoices</h3>
      <ul>
        <li>Real-time payment history with Total Spent analytics</li>
        <li>1-click <code>@media print</code> single-page PDF receipts</li>
        <li>Order status tracking (Completed, Pending, Failed)</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📊 Multi-Role Dashboard Portals</h3>
      <ul>
        <li><b>Student Portal</b>: Learning progress, MCQ results, & rewards</li>
        <li><b>College Portal</b>: Placement drive rosters & drive setup</li>
        <li><b>Company Portal</b>: Candidate tracking & job postings</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏛️ System Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js Frontend (React 18)                   │
├───────────────────┬───────────────────┬────────────────────────────────┤
│   Public Pages    │   Student Portal  │   College & Company Dashboards │
└─────────┬─────────┴─────────┬─────────┴───────────────┬────────────────┘
          │                   │                         │
          │                   ▼                         │
          │       ┌──────────────────────┐              │
          └──────►│ SWR / Axios Client   │◄─────────────┘
                  └──────────┬───────────┘
                             │ (Bearer JWT / Sanctum)
                             ▼
                  ┌──────────────────────┐
                  │ Laravel REST API     │
                  └──────────────────────┘
```

---

## 🛠️ Technology Stack & Libraries

| Category | Technology | Usage / Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (Pages Router) | SSR, SSG, Routing & API Integration |
| **UI Library** | React 18 & TypeScript 5 | Component Architecture & Type Safety |
| **Styling** | Tailwind CSS & Modern CSS Tokens | Responsive Design, Glassmorphism, Print Layouts |
| **Icons & Motion** | Lucide React & Framer Motion | Smooth Micro-animations & Sleek Icons |
| **Data Fetching** | SWR & Axios | Cache Invalidation, Revalidation, & Auth Headers |
| **Payments** | Razorpay Checkout SDK | Seamless In-App Payment Popup & Signatures |

---

## 📁 Project Structure Overview

```text
├── pages/                   # Next.js Application Routes
│   ├── student/             # Student Dashboard, Courses, Quiz Results, & Payments
│   ├── experts/             # Expert Profiles & 1:1 Booking Calendar
│   ├── college/             # College Placement Drive Management
│   ├── company/             # Job Openings & Candidate Evaluation
│   ├── payment-success.tsx  # Tax Invoice Receipt View (@media print)
│   └── payment-failed.tsx   # Transaction Decline & Retry View
├── src/
│   ├── components/          # Shared Components, Modals, Navbar, & Footer
│   ├── context/             # AuthContext, ThemeContext, & TourContext
│   ├── layout/              # Multi-Role Dashboard Container Layouts
│   └── lib/                 # Axios Interceptors & API Service Layer
└── public/                  # Static Media, Logos, & Brand Assets
```

---

## ⚡ Quick Start Guide for Senior / Teammates

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/samihavahora05/Frontend_BB.git
cd Frontend_BB
npm install
```

### 2. Environment Configuration (`.env.local`)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 4. Build Production Bundle
```bash
npm run build
```
*Note: TypeScript build errors are configured to skip non-blocking unused variables via `tsconfig.json` & `next.config.js` to ensure a 100% clean production build.*

---

## 📜 Certificate Management & Template Engine

The certificate subsystem includes:
1. **Dynamic SVG/PNG Background Templates**: Supports vector SVGs (`default_template.svg`, `default_green.svg`) and uploaded custom PNG/JPG designs.
2. **Unified Canvas & PDF Renderer**: Live interactive canvas preview (`src/lib/certificateUtils.ts`) matches the DomPDF Blade renderer (`resources/views/pdf/certificate.blade.php`).
3. **Multi-Element Layouts**: Supports `CERTIFICATE`, `OF ACHIEVEMENT`, `PROUDLY PRESENTED TO`, `{student_name}`, `{course_title}`, `Issued: {issue_date}`, and `Verification ID: {certificate_id}`.
4. **Issue Modal**: Fully Portal-isolated modal overlay (`createPortal`) with non-conflicting z-index toast notifications.

---

<div align="center">
  <p>Privately Developed for <b>Blueboxx DA Pvt. Ltd.</b> • All Rights Reserved</p>
</div>
