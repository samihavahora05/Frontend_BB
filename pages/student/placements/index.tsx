import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Placements() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/student/applications');
  }, [router]);
  return null;
}
