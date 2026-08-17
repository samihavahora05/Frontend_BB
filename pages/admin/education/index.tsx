import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EducationIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/education/enrollments');
  }, [router]);
  return null;
}
