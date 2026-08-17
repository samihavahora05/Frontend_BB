import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectMentors() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/experts');
  }, [router]);

  return null;
}
