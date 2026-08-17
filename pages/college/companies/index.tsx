import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CompaniesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/college/dashboard');
  }, [router]);
  return null;
}
