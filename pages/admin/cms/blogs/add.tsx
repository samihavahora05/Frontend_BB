import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminBlogAddPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/admin/cms/blog-editor/new");
  }, [router]);

  return null;
}
