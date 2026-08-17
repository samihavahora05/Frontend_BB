import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReportsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/college/dashboard');
  }, [router]);
  return null;
}
