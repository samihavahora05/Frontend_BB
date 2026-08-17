import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SettingsIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/settings/general');
  }, [router]);
  return null;
}
