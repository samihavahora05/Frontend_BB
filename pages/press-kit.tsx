import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { Download, FileImage, FileText } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";

export default function PressKitPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="pt-24 pb-20 bg-[#0d1635] text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight"
          >
            BlueBoxx <span className="text-[#C9A227]">Press Kit</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to write about BlueBoxx. Download high-resolution logos, brand assets, and company information.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileImage size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Brand Logos</h3>
                    <p className="text-sm text-slate-500">SVG, PNG, and AI formats</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Download size={16} /> Download Logos (.zip)
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Company Profile</h3>
                    <p className="text-sm text-slate-500">PDF Document with stats and info</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Download size={16} /> Download Profile (.pdf)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
