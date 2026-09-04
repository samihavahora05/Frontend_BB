export interface Company {
  id: string | number;
  name: string;
  industry: string;
  logoUrl?: string;
  location?: string;
  status?: "published" | "draft" | "archived";
  is_featured?: boolean;
}

export const INDUSTRIES = [
  "All Industries",
  "IT & Software Development",
  "Game Development Services",
  "SMEs & Startups",
  "Entertainment & Hospitality",
  "Transport & Logistics",
  "Food & Hospitality",
  "Business Consulting & Execution",
  "Infrastructure & Energy",
  "Manufacturing & Building",
  "Bespoke Packaging",
  "Cosmetics & FMCG",
  "Fashion & E-Commerce",
  "Chemicals & Agriculture",
  "Food & Restaurants",
  "3D Animation & VFX",
  "Visual Effects & Post Production",
  "Motion Picture & VFX",
  "Graphic Design & Printing",
  "FMCG & Food Processing",
  "Animation & Media",
  "Financial & Accounting",
  "Travel & Tourism",
  "Security & Protection",
  "Project Outsourcing",
  "Public Transport & Govt",
  "Education & Academics",
  "HR & Recruitment Firms"
];

// List matching STRICTLY the verified company logos in public/logo
export const partnerCompanies: Company[] = [
  { id: 1, name: "3D Studio", industry: "Game Development Services", logoUrl: "/logo/3D studio.png", location: "India", status: "published", is_featured: true },
  { id: 2, name: "Asha Tours & Travels", industry: "Travel & Tourism", logoUrl: "/logo/Asha_tours&travels.jpeg", location: "India", status: "published", is_featured: true },
  { id: 3, name: "Damyaa", industry: "SMEs & Startups", logoUrl: "/logo/Damyaa.png", location: "India", status: "published", is_featured: true },
  { id: 4, name: "Flammer Technologies", industry: "IT & Software Development", logoUrl: "/logo/Flammer-logo-horizontal.png", location: "India", status: "published", is_featured: true },
  { id: 5, name: "HS Structure", industry: "SMEs & Startups", logoUrl: "/logo/HS Structure.png", location: "India", status: "published", is_featured: true },
  { id: 6, name: "Jash Packaging Co", industry: "Bespoke Packaging", logoUrl: "/logo/Jashpackaging.jpeg", location: "India", status: "published", is_featured: true },
  { id: 7, name: "Bizpack", industry: "Business Consulting & Execution", logoUrl: "/logo/Logo-Bizpack-1024x451.png", location: "India", status: "published", is_featured: true },
  { id: 8, name: "SIAMP", industry: "Project Outsourcing", logoUrl: "/logo/SIAMP.png", location: "India", status: "published", is_featured: true },
  { id: 9, name: "Anacle", industry: "IT & Software Development", logoUrl: "/logo/anacle.webp", location: "India", status: "published", is_featured: true },
  { id: 10, name: "APS-Associates", industry: "HR & Recruitment Firms", logoUrl: "/logo/aps-associates.png", location: "India", status: "published", is_featured: true },
  { id: 11, name: "ATR", industry: "IT & Software Development", logoUrl: "/logo/atr-logo.png", location: "India", status: "published", is_featured: true },
  { id: 12, name: "Ayansh Security", industry: "Security & Protection", logoUrl: "/logo/ayanshse sicyuraty.webp", location: "India", status: "published", is_featured: true },
  { id: 13, name: "CSD Instruments", industry: "IT & Software Development", logoUrl: "/logo/csd.png", location: "India", status: "published", is_featured: true },
  { id: 14, name: "Destinee Visa", industry: "Business Consulting & Execution", logoUrl: "/logo/destinee visa.jpeg", location: "India", status: "published", is_featured: true },
  { id: 15, name: "Drapple Healthcare", industry: "HR & Recruitment Firms", logoUrl: "/logo/drapple healthcare.png", location: "India", status: "published", is_featured: true },
  { id: 16, name: "Egneen Manket", industry: "SMEs & Startups", logoUrl: "/logo/egneenmanket.png", location: "India", status: "published", is_featured: true },
  { id: 17, name: "EO Expents", industry: "SMEs & Startups", logoUrl: "/logo/eo expents.png", location: "India", status: "published", is_featured: true },
  { id: 18, name: "Fabindia", industry: "Fashion & E-Commerce", logoUrl: "/logo/fabindia.jpeg", location: "India", status: "published", is_featured: true },
  { id: 19, name: "Farsan", industry: "Food & Restaurants", logoUrl: "/logo/farsan.jpeg", location: "India", status: "published", is_featured: true },
  { id: 20, name: "Forstan Cafe", industry: "Food & Hospitality", logoUrl: "/logo/forstan cafe.jpg", location: "India", status: "published", is_featured: true },
  { id: 21, name: "Green Clean Solar", industry: "Infrastructure & Energy", logoUrl: "/logo/green clean solar.jpeg", location: "India", status: "published", is_featured: true },
  { id: 22, name: "Gujarat Living", industry: "SMEs & Startups", logoUrl: "/logo/gujrarat liaving.jpg", location: "India", status: "published", is_featured: true },
  { id: 23, name: "Hamdan Sports Complex", industry: "Entertainment & Hospitality", logoUrl: "/logo/hamdan sports complex.png", location: "India", status: "published", is_featured: true },
  { id: 24, name: "Hotel Girnar", industry: "Food & Hospitality", logoUrl: "/logo/hotel girnar_kathiyawadi.jpg", location: "India", status: "published", is_featured: true },
  { id: 25, name: "Indo German", industry: "Project Outsourcing", logoUrl: "/logo/indo german.png", location: "India", status: "published", is_featured: true },
  { id: 26, name: "Layal Al Watam", industry: "SMEs & Startups", logoUrl: "/logo/layal al watam.png", location: "India", status: "published", is_featured: true },
  { id: 27, name: "Little Millennium", industry: "Education & Academics", logoUrl: "/logo/little millanium.jpeg", location: "India", status: "published", is_featured: true },
  { id: 28, name: "Manavta Foundation", industry: "SMEs & Startups", logoUrl: "/logo/manavta foundation.webp", location: "India", status: "published", is_featured: true },
  { id: 29, name: "Manavta Hospital", industry: "HR & Recruitment Firms", logoUrl: "/logo/manavta hospital.png", location: "India", status: "published", is_featured: true },
  { id: 30, name: "Mark Cafe", industry: "Food & Hospitality", logoUrl: "/logo/mark cafe.jpg", location: "India", status: "published", is_featured: true },
  { id: 31, name: "Office24", industry: "Business Consulting & Execution", logoUrl: "/logo/office24.webp", location: "India", status: "published", is_featured: true },
  { id: 32, name: "Otto Valves & Rubers", industry: "Manufacturing & Building", logoUrl: "/logo/otto valves & rubers.png", location: "India", status: "published", is_featured: true },
  { id: 33, name: "Pandit Restaurant", industry: "Food & Hospitality", logoUrl: "/logo/pandit rasturant.jpg", location: "India", status: "published", is_featured: true },
  { id: 34, name: "Pranav Plastic", industry: "Manufacturing & Building", logoUrl: "/logo/pranav plastic pvt.jpg", location: "India", status: "published", is_featured: true },
  { id: 35, name: "Primax Engineers", industry: "Manufacturing & Building", logoUrl: "/logo/primax-engineers-private-limited-90x90.jpg", location: "India", status: "published", is_featured: true },
  { id: 36, name: "Qinoxy", industry: "IT & Software Development", logoUrl: "/logo/qinoxy.jpg", location: "India", status: "published", is_featured: true },
  { id: 37, name: "Rang Techno", industry: "IT & Software Development", logoUrl: "/logo/rang techno.png", location: "India", status: "published", is_featured: true },
  { id: 38, name: "Sabaz Tourism", industry: "Travel & Tourism", logoUrl: "/logo/sabaz tourism.jpeg", location: "India", status: "published", is_featured: true },
  { id: 39, name: "Shiv Agro", industry: "Chemicals & Agriculture", logoUrl: "/logo/shiv agro.webp", location: "India", status: "published", is_featured: true },
  { id: 40, name: "Srauav Dixit", industry: "Business Consulting & Execution", logoUrl: "/logo/srauav dixit advakate.png", location: "India", status: "published", is_featured: true },
  { id: 41, name: "Supriya Association", industry: "Financial & Accounting", logoUrl: "/logo/supriya-association.png", location: "India", status: "published", is_featured: true },
  { id: 42, name: "Swasstik Enterprise", industry: "SMEs & Startups", logoUrl: "/logo/swasstik enterpris.webp", location: "India", status: "published", is_featured: true },
  { id: 43, name: "Tensile Structure", industry: "Manufacturing & Building", logoUrl: "/logo/tensile staucchar.svg", location: "India", status: "published", is_featured: true }
];
