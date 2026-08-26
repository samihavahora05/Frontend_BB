import React from "react";
import { HeroSection } from "../sections/HeroSection";
import { ClientsSection } from "../sections/ClientsSection";
import { ServicesSection } from "../sections/ServicesSection";
import { WhyChooseSection } from "../sections/WhyChooseSection";
import { WhyChooseBlueboxxSection } from "../sections/WhyChooseBlueboxxSection";
import { EcosystemSection } from "../sections/EcosystemSection";
import { CoursesSection } from "../sections/CoursesSection";
import { InternshipsSection } from "../sections/InternshipsSection";
import { MentorsSection } from "../sections/MentorsSection";
import { WhoAreYouSection } from "../sections/WhoAreYouSection";
import { StudentsShowcaseSection } from "../sections/StudentsShowcaseSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { FAQSection } from "../sections/FAQSection";
import { CTASection } from "../sections/CTASection";

export const HomePage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      <HeroSection />
      <ClientsSection />
      <WhyChooseSection />
      <EcosystemSection />
      <CoursesSection />
      <InternshipsSection />
      <ServicesSection />
      <MentorsSection />
      <WhoAreYouSection />
      <WhyChooseBlueboxxSection />
      <StudentsShowcaseSection 
        title="OUR STUDENTS & ALUMNI"
        tag="Success & Placement Network"
        subtitle="Empowering thousands of students to learn, build projects, and secure top industry roles."
      />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};
