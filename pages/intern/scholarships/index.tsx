import React from 'react';
import Head from 'next/head';
import { InternDashboardLayout } from '../../../src/layout/InternDashboardLayout';
import { MyScholarshipsView } from '../../../src/components/MyScholarshipsView';

export default function InternScholarshipsPage() {
  return (
    <InternDashboardLayout>
      <Head>
        <title>My Scholarships - Blueboxx Intern Portal</title>
      </Head>
      <MyScholarshipsView userRole="intern" />
    </InternDashboardLayout>
  );
}
