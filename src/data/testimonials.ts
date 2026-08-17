export interface LocalTestimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  rating: number;
  review: string;
  image_url: string;
  type: 'internship' | 'job';
}

export const localTestimonials: LocalTestimonial[] = [
  // Internship Testimonials
  {
    id: 1,
    name: "Aastha Soni",
    designation: "Graphic Design Intern",
    company: "Blueboxx",
    rating: 5,
    review: "The internship at Blueboxx DA gave me real-world design experience. I worked on actual client projects which built my portfolio immensely.",
    image_url: "/testimonials photos/Aastha Soni.png",
    type: "internship"
  },
  {
    id: 2,
    name: "Akshay Raval",
    designation: "Web Development Intern",
    company: "Tech Solutions",
    rating: 5,
    review: "The live project experience I gained here helped me secure a top-tier frontend role. The mentors were incredibly supportive.",
    image_url: "/testimonials photos/Akshay Raval.png",
    type: "internship"
  },
  {
    id: 3,
    name: "Bhuvela Krish",
    designation: "Digital Marketing Intern",
    company: "Growth Media",
    rating: 5,
    review: "Blueboxx DA provided me with real industry exposure. I gained valuable hands-on experience in digital marketing campaigns.",
    image_url: "/testimonials photos/Bhuvela Krish.png",
    type: "internship"
  },
  {
    id: 4,
    name: "Dhuri Suhani",
    designation: "Frontend Developer Intern",
    company: "Startup Inc",
    rating: 5,
    review: "Working with actual clients during my training gave me the exact portfolio I needed. Best internship experience ever.",
    image_url: "/testimonials photos/Dhuri Suhani.png",
    type: "internship"
  },
  {
    id: 5,
    name: "Dipoti Mahir",
    designation: "Software Engineering Intern",
    company: "Blueboxx",
    rating: 5,
    review: "Blueboxx's internship track is incredible. I learned more in 3 months here than a whole year in college.",
    image_url: "/testimonials photos/Dipoti Mahir.png",
    type: "internship"
  },
  {
    id: 6,
    name: "Disha Padhiyar",
    designation: "Data Science Intern",
    company: "AI Labs",
    rating: 5,
    review: "From practical assignments to real client feedback, this internship bridged the gap between learning and doing.",
    image_url: "/testimonials photos/Disha Padhiyar.png",
    type: "internship"
  },
  {
    id: 7,
    name: "Harsh Padhiyar",
    designation: "ML Intern",
    company: "Tech Innovations",
    rating: 5,
    review: "I was able to build a complete ML capstone project under great mentorship, landing me a pre-placement offer.",
    image_url: "/testimonials photos/Harsh Padhiyar.png",
    type: "internship"
  },
  {
    id: 8,
    name: "Hemangini Parmar",
    designation: "DevOps Intern",
    company: "Cloud Systems",
    rating: 5,
    review: "The DevOps internship gave me hands-on cloud experience that recruiters actively look for. Highly recommended.",
    image_url: "/testimonials photos/Hemangini Parmar.png",
    type: "internship"
  },
  {
    id: 9,
    name: "Isha Patel",
    designation: "UI/UX Intern",
    company: "Design Hub",
    rating: 5,
    review: "I loved working on real-world wireframes and prototypes. The mentors guided me through every step of the design process.",
    image_url: "/testimonials photos/Isha Patel.png",
    type: "internship"
  },

  // Job / Alumni Testimonials
  {
    id: 10,
    name: "Ketan Parmar",
    designation: "DevOps Engineer",
    company: "Amazon",
    rating: 5,
    review: "The placement support was outstanding. I transitioned from learning to a full-time DevOps role smoothly.",
    image_url: "/testimonials photos/Ketan Parmar.png",
    type: "job"
  },
  {
    id: 11,
    name: "Krupa Patel",
    designation: "Web Developer",
    company: "Microsoft",
    rating: 5,
    review: "Blueboxx's training and network directly connected me with a top tech firm for my current position.",
    image_url: "/testimonials photos/Krupa Patel.png",
    type: "job"
  },
  {
    id: 12,
    name: "Manav Vithani",
    designation: "Creative Director",
    company: "Design Studio",
    rating: 5,
    review: "The rigorous practical work and mock interviews prepared me perfectly for my senior design role.",
    image_url: "/testimonials photos/Manav Vithani.png",
    type: "job"
  },
  {
    id: 13,
    name: "Nency Shah",
    designation: "Product Manager",
    company: "Flipkart",
    rating: 5,
    review: "The product management roadmap they provided was crucial for me clearing all my PM interview rounds.",
    image_url: "/testimonials photos/Nency Shah.png",
    type: "job"
  },
  {
    id: 14,
    name: "Nishant Prajapati",
    designation: "Senior PM",
    company: "Zomato",
    rating: 5,
    review: "Great mentorship and industry-relevant curriculum helped me land a Senior PM role faster than I expected.",
    image_url: "/testimonials photos/Nishant Prajapati.png",
    type: "job"
  },
  {
    id: 15,
    name: "Priyal Chauhan",
    designation: "SDE I",
    company: "Google",
    rating: 5,
    review: "I went from zero cloud knowledge to a full-time Software Engineer thanks to their structured placement program.",
    image_url: "/testimonials photos/Priyal Chauhan.png",
    type: "job"
  },
  {
    id: 16,
    name: "Tax Patel",
    designation: "App Developer",
    company: "Tech Giants",
    rating: 5,
    review: "Excellent organization with a professional team and a strong focus on quality. Landed my dream job here.",
    image_url: "/testimonials photos/Tax Patel.png",
    type: "job"
  },
  {
    id: 17,
    name: "Sirsath Prashik",
    designation: "Data Scientist",
    company: "Fintech Co",
    rating: 5,
    review: "The hands-on learning approach has helped me build confidence and improve my skills, securing a great package.",
    image_url: "/testimonials photos/sirsath prashik.png",
    type: "job"
  }
];
