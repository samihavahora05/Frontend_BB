import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DeprecatedCRMRoute() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified leads page
    router.replace('/admin/crm/leads');
  }, [router]);

  return null;
}
