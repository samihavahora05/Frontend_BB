import { HomePage } from "../src/pages/HomePage";
import { MainLayout } from "../src/layout/MainLayout";
import { SEO } from "../src/components/seo/SEO";

export default function IndexPage() {
  return (
    <>
      <SEO 
        title="Blueboxx DA | Top EdTech Platform & IT Training Institute"
        description="Blueboxx DA provides industry-leading online courses, full stack development training, AI internships, and 100% placement assistance for tech careers."
        keywords="Online Courses, Internship Platform, Job Portal, Placement Assistance, AI Courses, Full Stack Development, Web Development, Python Course, Laravel Course, React Course, Campus Placements, Career Development, Skill Development, Online Learning Platform"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Blueboxx DA",
          "url": "https://blueboxx.in",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://blueboxx.in/courses?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <MainLayout>
      <HomePage />
    </MainLayout>
    </>
  );
}
