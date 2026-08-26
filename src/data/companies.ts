export interface Company {
  id: string;
  name: string;
  industry: string;
  logoUrl?: string;
  location?: string;
}

export const INDUSTRIES = [
  "All Industries",
  "IT & Software Development",
  "Game development services",
  "Business growth services",
  "Project Outsourcing",
  "SMEs & Startups",
  "HR & Recruitment Firms",
  "Food & Hospitality",
  "Healthcare & Medical",
  "Manufacturing & Industrial",
  "Travel & Tourism"
];

// List containing ONLY verified existing logo files in /public/logo/
export const partnerCompanies: Company[] = [
  { id: "c1", name: "3D Studio", industry: "Game development services", logoUrl: "/logo/3D%20studio.png", location: "Mumbai, India" },
  { id: "c2", name: "Asha Tours & Travels", industry: "Travel & Tourism", logoUrl: "/logo/Asha_tours-travels.jpeg", location: "Gujarat, India" },
  { id: "c3", name: "Damyaa", industry: "SMEs & Startups", logoUrl: "/logo/Damyaa.png", location: "Vadodara, India" },
  { id: "c4", name: "Flammer Technologies", industry: "IT & Software Development", logoUrl: "/logo/Flammer-logo-horizontal.png", location: "Pune, India" },
  { id: "c5", name: "HS Structure", industry: "SMEs & Startups", logoUrl: "/logo/HS%20Structure.png", location: "Ahmedabad, India" },
  { id: "c6", name: "Jash Packaging Co", industry: "SMEs & Startups", logoUrl: "/logo/Jashpackaging.jpeg", location: "Vadodara, India" },
  { id: "c7", name: "Bizpack", industry: "Business growth services", logoUrl: "/logo/Logo-Bizpack-1024x451.png", location: "Mumbai, India" },
  { id: "c8", name: "SIAMP", industry: "Project Outsourcing", logoUrl: "/logo/SIAMP.png", location: "Global Remote" },
  { id: "c9", name: "Anacle", industry: "IT & Software Development", logoUrl: "/logo/anacle.webp", location: "Singapore / Remote" },
  { id: "c10", name: "APS-Associates", industry: "HR & Recruitment Firms", logoUrl: "/logo/aps-associates.png", location: "New Delhi, India" },
  { id: "c11", name: "ATR", industry: "IT & Software Development", logoUrl: "/logo/atr-logo.png", location: "Bangalore, India" },
  { id: "c12", name: "Ayansh Security", industry: "Security & Protection", logoUrl: "/logo/ayanshse%20sicyuraty.webp", location: "Gujarat, India" },
  { id: "c13", name: "CSD Instruments", industry: "IT & Software Development", logoUrl: "/logo/csd.png", location: "Vadodara, India" },
  { id: "c14", name: "Destinee Visa", industry: "Business consulting & execution", logoUrl: "/logo/destinee%20visa.jpeg", location: "Gujarat, India" },
  { id: "c15", name: "Drapple Healthcare", industry: "HR & Recruitment Firms", logoUrl: "/logo/drapple%20healthcare.png", location: "Mumbai, India" },
  { id: "c16", name: "Egneen Manket", industry: "SMEs & Startups", logoUrl: "/logo/egneenmanket.png", location: "Vadodara, India" },
  { id: "c17", name: "EO Expents", industry: "SMEs & Startups", logoUrl: "/logo/eo%20expents.png", location: "Ahmedabad, India" },
  { id: "c18", name: "Fabindia", industry: "Retail & E-Commerce", logoUrl: "/logo/fabindia.jpeg", location: "New Delhi, India" },
  { id: "c19", name: "Farsan", industry: "Food & Beverages", logoUrl: "/logo/farsan.jpeg", location: "Gujarat, India" },
  { id: "c20", name: "Forstan Cafe", industry: "Food & Hospitality", logoUrl: "/logo/forstan%20cafe.jpg", location: "Vadodara, India" },
  { id: "c21", name: "Green Clean Solar", industry: "Renewable Energy", logoUrl: "/logo/green%20clean%20solar.jpeg", location: "Ahmedabad, India" },
  { id: "c22", name: "Gujarat Living", industry: "Real Estate & Living", logoUrl: "/logo/gujrarat%20liaving.jpg", location: "Gujarat, India" },
  { id: "c23", name: "Hamdan Sports Complex", industry: "Project Outsourcing", logoUrl: "/logo/hamdan%20sports%20complex.png", location: "Dubai, UAE" },
  { id: "c24", name: "Hotel Girnar", industry: "Hospitality & Dining", logoUrl: "/logo/hotel%20girnar_kathiyawadi.jpg", location: "Junagadh, India" },
  { id: "c25", name: "Indo German", industry: "Project Outsourcing", logoUrl: "/logo/indo%20german.png", location: "Vadodara, India" },
  { id: "c26", name: "Layal Al Watam", industry: "International Services", logoUrl: "/logo/layal%20al%20watam.png", location: "Middle East" },
  { id: "c27", name: "Little Millennium", industry: "Education & Learning", logoUrl: "/logo/little%20millanium.jpeg", location: "India Wide" },
  { id: "c28", name: "Manavta Foundation", industry: "NGO & Non-Profit", logoUrl: "/logo/manavta%20foundation.webp", location: "Gujarat, India" },
  { id: "c29", name: "Manavta Hospital", industry: "Healthcare & Medical", logoUrl: "/logo/manavta%20hospital.png", location: "Vadodara, India" },
  { id: "c30", name: "Mark Cafe", industry: "Food & Beverages", logoUrl: "/logo/mark%20cafe.jpg", location: "Vadodara, India" },
  { id: "c31", name: "Office24", industry: "Co-Working & Workspaces", logoUrl: "/logo/office24.webp", location: "Mumbai, India" },
  { id: "c32", name: "Otto Valves & Rubers", industry: "Manufacturing & Industrial", logoUrl: "/logo/otto-valves-rubers.png", location: "Gujarat, India" },
  { id: "c33", name: "Pandit Restaurant", industry: "Food & Hospitality", logoUrl: "/logo/pandit%20rasturant.jpg", location: "Vadodara, India" },
  { id: "c34", name: "Pranav Plastic", industry: "Manufacturing", logoUrl: "/logo/pranav%20plastic%20pvt.jpg", location: "Gujarat, India" },
  { id: "c35", name: "Primax Engineers", industry: "Engineering Services", logoUrl: "/logo/primax-engineers-private-limited-90x90.jpg", location: "Vadodara, India" },
  { id: "c36", name: "Qinoxy", industry: "IT & Software Development", logoUrl: "/logo/qinoxy.jpg", location: "Bangalore, India" },
  { id: "c37", name: "Rang Techno", industry: "IT & Software Development", logoUrl: "/logo/rang%20techno.png", location: "Vadodara, India" },
  { id: "c38", name: "Sabaz Tourism", industry: "Travel & Hospitality", logoUrl: "/logo/sabaz%20tourism.jpeg", location: "Gujarat, India" },
  { id: "c39", name: "Shiv Agro", industry: "Chemicals & Agriculture", logoUrl: "/logo/shiv%20agro.webp", location: "Vadodara, India" },
  { id: "c40", name: "Srauav Dixit Advocate", industry: "Legal & Professional Services", logoUrl: "/logo/srauav%20dixit%20advakate.png", location: "Gujarat, India" },
  { id: "c41", name: "Supriya Association", industry: "Consulting & Services", logoUrl: "/logo/supriya-association.png", location: "Mumbai, India" },
  { id: "c42", name: "Swasstik Enterprise", industry: "Trading & Logistics", logoUrl: "/logo/swasstik%20enterpris.webp", location: "Vadodara, India" },
  { id: "c43", name: "Tensile Structure", industry: "Architecture & Construction", logoUrl: "/logo/tensile%20staucchar.svg", location: "Gujarat, India" }
];

