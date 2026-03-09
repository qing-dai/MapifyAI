import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, Mic, Layers, Navigation, MapPin, Star, Heart } from "lucide-react";
import MapBackground from "@/components/MapBackground";
import MapPins from "@/components/MapPins";
import BottomTabBar from "@/components/BottomTabBar";
import { useSearchStream } from "@/hooks/useSearchStream";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function MapExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { location } = useGeolocation();
  const { results, startSearch } = useSearchStream();
  const [activePlace, setActivePlace] = useState<string | null>(null);

  const lat = location?.lat ?? 31.2304;
  const lng = location?.lng ?? 121.4737;

  useEffect(() => {
    if (query) {
      startSearch(query, { lat, lng });
    }
  }, [query, lat, lng, startSearch]);

  const activeResult = results.find((r) => r.place_id === activePlace);

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">
      <MapBackground lat={lat} lng={lng} />

      {/* Map Pins */}
      <AnimatePresence>
        {results.length > 0 && (
          <MapPins
            places={results}
            activePlace={activePlace}
            onPinClick={setActivePlace}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-full bg-background/90 backdrop-blur-sm shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground flex-1">
              {query || "Search destinations..."}
            </span>
            <Mic className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute right-4 top-1/3 z-20 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <Layers className="w-4 h-4 text-muted-foreground" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <Navigation className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Active place card overlay */}
      <AnimatePresence>
        {activeResult && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-20 left-4 right-4 z-30"
          >
            <div
              className="bg-background rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/place/${activeResult.place_id}`)}
            >
              {/* Thumbnail area */}
              <div className="h-32 bg-gradient-to-br from-muted to-secondary flex items-center justify-center relative">
                <MapPin className="w-8 h-8 text-muted-foreground/40" />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{activeResult.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-foreground">
                      {activeResult.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({activeResult.rating_count})
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{activeResult.address}</p>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-muted text-sm font-medium text-foreground">
                    <Navigation className="w-3.5 h-3.5" />
                    Directions
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabBar />
    </div>
  );
}
