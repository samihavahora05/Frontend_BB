import React from 'react';
import Head from 'next/head';
import { StudentDashboardLayout } from '../../../src/layout/StudentDashboardLayout';
import { MyScholarshipsView } from '../../../src/components/MyScholarshipsView';

export default function StudentScholarshipsPage() {
  return (
    <StudentDashboardLayout>
      <Head>
        <title>My Scholarships - Blueboxx Student Portal</title>
      </Head>
      <MyScholarshipsView userRole="student" />
    </StudentDashboardLayout>
  );
}
