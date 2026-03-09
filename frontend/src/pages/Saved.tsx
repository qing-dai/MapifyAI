import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, MapPin, Clock } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

const SAVED_PLACES = [
  { id: "p5", name: "The Sage Bistro", rating: 4.8, category: "Fine Dining", address: "Gastronomy Park, SF", savedAt: "2 days ago" },
  { id: "p1", name: "The Ground Brew", rating: 4.9, category: "Coffee", address: "12 Market Street", savedAt: "1 week ago" },
  { id: "p2", name: "Komorebi Tables", rating: 4.7, category: "Café & Workspace", address: "88 Oak Avenue", savedAt: "2 weeks ago" },
  { id: "p3", name: "Velvet Crumb", rating: 4.8, category: "Bakery", address: "45 Elm Street", savedAt: "3 weeks ago" },
];

export default function Saved() {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <div className="flex-shrink-0 safe-top border-b border-border/50">
        <div className="flex items-center justify-center px-5 py-3">
          <h1 className="text-base font-semibold text-foreground">Saved Places</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-4 py-4 space-y-2">
        {SAVED_PLACES.map((place, idx) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/place/${place.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60 cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{place.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{place.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-medium text-foreground">{place.rating}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">· {place.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{place.savedAt}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}
