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

// List matching STRICTLY the 41 companies configured in the Admin Companies management panel
export const partnerCompanies: Company[] = [
  { id: 9, name: "Sawariya Solution", industry: "Game Development Services", logoUrl: "/logo/sawariya.png", location: "India", status: "published", is_featured: true },
  { id: 6, name: "Jash Packaging Co", industry: "SMEs & Startups", logoUrl: "/logo/Jashpackaging.jpeg", location: "India", status: "published", is_featured: true },
  { id: 10, name: "AATAPI Wonderland", industry: "Entertainment & Hospitality", logoUrl: "/logo/aatapi.png", location: "India", status: "published", is_featured: true },
  { id: 11, name: "Speedline Taxis", industry: "Transport & Logistics", logoUrl: "/logo/speedline.png", location: "India", status: "published", is_featured: true },
  { id: 12, name: "Pandits Cafe And Restaurant", industry: "Food & Hospitality", logoUrl: "/logo/pandit%20rasturant.jpg", location: "India", status: "published", is_featured: true },
  { id: 13, name: "Aldar International", industry: "Business Consulting & Execution", logoUrl: "/logo/aldar.png", location: "India", status: "published", is_featured: true },
  { id: 14, name: "Essar Group", industry: "Infrastructure & Energy", logoUrl: "/logo/essar.png", location: "India", status: "published", is_featured: true },
  { id: 15, name: "Nexrise Aac Blocks", industry: "Manufacturing & Building", logoUrl: "/logo/nexrise.png", location: "India", status: "published", is_featured: true },
  { id: 16, name: "Packman", industry: "Bespoke Packaging", logoUrl: "/logo/packman.png", location: "India", status: "published", is_featured: true },
  { id: 17, name: "ADF Aroma De France", industry: "Cosmetics & FMCG", logoUrl: "/logo/adf.png", location: "India", status: "published", is_featured: true },
  { id: 18, name: "Cizzara", industry: "Fashion & E-Commerce", logoUrl: "/logo/cizzara.png", location: "India", status: "published", is_featured: true },
  { id: 19, name: "Shiv Agro Chemical Industries", industry: "Chemicals & Agriculture", logoUrl: "/logo/shiv%20agro.webp", location: "India", status: "published", is_featured: true },
  { id: 20, name: "Pizza Bell", industry: "Food & Restaurants", logoUrl: "/logo/pizzabell.png", location: "India", status: "published", is_featured: true },
  { id: 21, name: "Anibrain", industry: "3D Animation & VFX", logoUrl: "/logo/anibrain.png", location: "India", status: "published", is_featured: true },
  { id: 22, name: "VFXWAALA", industry: "Visual Effects & Post Production", logoUrl: "/logo/vfxwaala.png", location: "India", status: "published", is_featured: true },
  { id: 23, name: "Weta Digital", industry: "Motion Picture & VFX", logoUrl: "/logo/weta.png", location: "India", status: "published", is_featured: true },
  { id: 24, name: "Vistaprint", industry: "Graphic Design & Printing", logoUrl: "/logo/vistaprint.png", location: "India", status: "published", is_featured: true },
  { id: 25, name: "National Foods", industry: "FMCG & Food Processing", logoUrl: "/logo/nationalfoods.png", location: "India", status: "published", is_featured: true },
  { id: 26, name: "Method Studios", industry: "Animation & Media", logoUrl: "/logo/method.png", location: "India", status: "published", is_featured: true },
  { id: 1, name: "3D Studio", industry: "Game Development Services", logoUrl: "/logo/3D%20studio.png", location: "India", status: "published", is_featured: true },
  { id: 3, name: "Damyaa", industry: "SMEs & Startups", logoUrl: "/logo/Damyaa.png", location: "India", status: "published", is_featured: true },
  { id: 27, name: "APS-Associates", industry: "Financial & Accounting", logoUrl: "/logo/aps-associates.png", location: "India", status: "published", is_featured: true },
  { id: 2, name: "Asha Tours & Travels", industry: "Travel & Tourism", logoUrl: "/logo/Asha_tours&travels.jpeg", location: "India", status: "published", is_featured: true },
  { id: 28, name: "Ayansh Security", industry: "Security & Protection", logoUrl: "/logo/ayanshse%20sicyuraty.webp", location: "India", status: "published", is_featured: true },
  { id: 29, name: "NHSRCL Logo", industry: "Project Outsourcing", logoUrl: "/logo/nhsrcl.png", location: "India", status: "published", is_featured: true },
  { id: 7, name: "Bizpack", industry: "Business Consulting & Execution", logoUrl: "/logo/Logo-Bizpack-1024x451.png", location: "India", status: "published", is_featured: true },
  { id: 30, name: "Associated Power Solution Pvt. Ltd", industry: "IT & Software Development", logoUrl: "/logo/associatedpower.png", location: "India", status: "published", is_featured: true },
  { id: 31, name: "3insys", industry: "IT & Software Development", logoUrl: "/logo/3insys.png", location: "India", status: "published", is_featured: true },
  { id: 32, name: "Indian Western Railway", industry: "Public Transport & Govt", logoUrl: "/logo/railway.png", location: "India", status: "published", is_featured: true },
  { id: 33, name: "Global Discovery School", industry: "Education & Academics", logoUrl: "/logo/globaldiscovery.png", location: "India", status: "published", is_featured: true },
  { id: 4, name: "Flammer Technologies", industry: "IT & Software Development", logoUrl: "/logo/Flammer-logo-horizontal.png", location: "India", status: "published", is_featured: true },
  { id: 5, name: "HS Structure", industry: "SMEs & Startups", logoUrl: "/logo/HS%20Structure.png", location: "India", status: "published", is_featured: true },
  { id: 8, name: "SIAMP", industry: "Project Outsourcing", logoUrl: "/logo/SIAMP.png", location: "India", status: "published", is_featured: true },
  { id: 34, name: "Anacle", industry: "IT & Software Development", logoUrl: "/logo/anacle.webp", location: "India", status: "published", is_featured: true },
  { id: 35, name: "ATR", industry: "IT & Software Development", logoUrl: "/logo/atr-logo.png", location: "India", status: "published", is_featured: true },
  { id: 36, name: "CSD Instruments", industry: "IT & Software Development", logoUrl: "/logo/csd.png", location: "India", status: "published", is_featured: true },
  { id: 37, name: "Destinee Visa", industry: "Business Consulting & Execution", logoUrl: "/logo/destinee%20visa.jpeg", location: "India", status: "published", is_featured: true },
  { id: 38, name: "Drapple Healthcare", industry: "HR & Recruitment Firms", logoUrl: "/logo/drapple%20healthcare.png", location: "India", status: "published", is_featured: true },
  { id: 39, name: "Fabindia", industry: "SMEs & Startups", logoUrl: "/logo/fabindia.jpeg", location: "India", status: "published", is_featured: true },
  { id: 40, name: "Farsan", industry: "SMEs & Startups", logoUrl: "/logo/farsan.jpeg", location: "India", status: "published", is_featured: true },
  { id: 41, name: "Green Clean Solar", industry: "SMEs & Startups", logoUrl: "/logo/green%20clean%20solar.jpeg", location: "India", status: "published", is_featured: true }
];

