import { HomePage } from "../src/pages/HomePage";
import { MainLayout } from "../src/layout/MainLayout";
import { SEO } from "../src/components/seo/SEO";

export default function IndexPage() {
  return (
    <>
      <SEO 
        title="BlueBoxx | Leading IT Services & Digital Solutions Company Vadodara"
        description="BlueBoxx is a premier IT services, software development, and digital solutions company in Vadodara delivering enterprise web, AI, and digital transformation solutions."
        keywords="IT company Vadodara, software development company, digital solutions provider, web development company Vadodara, enterprise IT services, Blueboxx DA"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "BlueBoxx",
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
