import { getImageUrl } from "../../lib/imageUtils";
import { useRouter } from "next/router";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Star, Clock, BookOpen, Users, ShoppingCart } from "lucide-react";
import { useStore } from "../../store/useStore";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export interface CourseProps {
  id: string | number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  modules: number;
  price: string;
  rawPrice: number;
  image: string;
  category: string;
}

export function CourseCard({ course }: { course: CourseProps }) {
  const router = useRouter();
  const addToCart = useStore((state) => state.addToCart);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to course detail
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart.");
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    addToCart({
      id: course.id,
      title: course.title,
      price: course.rawPrice,
      thumbnail: course.image,
      type: 'course'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="bg-white border border-slate-200 hover:border-[#1B2A6B]/30 hover:shadow-[0_8px_30px_rgba(27,42,107,0.12)] transition-all duration-300 rounded-[1.25rem] overflow-hidden group cursor-pointer flex flex-col h-full relative"
        onClick={() => router.push(`/courses/${course.id}`)}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C9A227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Thumbnail */}
        <div className="relative h-44 overflow-hidden">
          <img 
            src={getImageUrl(course.image)} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635]/80 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/50 backdrop-blur-md text-[#C9A227] font-extrabold uppercase tracking-widest text-[9px] shadow-sm px-2.5 py-0.5 border border-white/10">
              {course.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-800">{course.rating}</span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 flex flex-col flex-1 relative z-10">
          <h3 className="font-extrabold text-base text-slate-900 mb-1 group-hover:text-[#1B2A6B] transition-colors line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-[11px] font-bold text-slate-500 mb-4 flex items-center gap-2">
            By {course.instructor}
          </p>

          <div className="grid grid-cols-2 gap-y-2 gap-x-1 mb-5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <Clock size={12} className="text-[#C9A227]" /> {course.duration}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <BookOpen size={12} className="text-[#C9A227]" /> {course.modules} Modules
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 col-span-2">
              <Users size={12} className="text-slate-400" /> {course.students.toLocaleString()} students
            </div>
          </div>

          {/* Footer & Add to Cart */}
          <div className="mt-auto flex items-center justify-between bg-slate-50 -mx-5 -mb-5 px-5 py-4 border-t border-slate-100">
            <span className="text-lg font-black text-emerald-600 tracking-tight">{course.price}</span>
            <Button 
              onClick={handleAddToCart}
              className="bg-white border border-slate-200 hover:bg-[#1B2A6B] hover:border-[#1B2A6B] text-slate-700 hover:text-white font-black h-8 px-4 rounded-full text-[10px] shadow-sm hover:shadow-md transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShoppingCart size={12} /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
