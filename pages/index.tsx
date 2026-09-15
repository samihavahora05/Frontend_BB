import { HomePage } from "../src/pages/HomePage";
import { MainLayout } from "../src/layout/MainLayout";
import { SEO } from "../src/components/seo/SEO";

export default function IndexPage() {
  return (
    <>
      <SEO 
        title="BlueBoxx | Leading Digital Marketing & IT Training Institute in Vadodara"
        description="BlueBoxx is a leading digital marketing institute in Vadodara offering UI/UX, web development & marketing courses with practical training and career support."
        keywords="digital marketing institute vadodara, BlueBoxx DA, UI/UX design vadodara, web development vadodara, IT training institute vadodara, best computer classes vadodara"
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
