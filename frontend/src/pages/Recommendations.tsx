import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MoreHorizontal, Search } from "lucide-react";
import PlaceCard from "@/components/PlaceCard";
import BottomTabBar from "@/components/BottomTabBar";
import { useSearchStream } from "@/hooks/useSearchStream";
import { useLang } from "@/i18n/LanguageContext";

const FILTER_CHIPS = ["For You", "Breakfast", "Quiet Spots", "Outdoor"];

export default function Recommendations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "coffee shops nearby";
  const [activeFilter, setActiveFilter] = useState("For You");
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const { results, isLoading, isStreaming, startSearch } = useSearchStream();
  const { t } = useLang();

  useEffect(() => {
    startSearch(query, { lat: 31.2304, lng: 121.4737 });
  }, [query, startSearch]);

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="p-1"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>
          <h1 className="text-base font-semibold text-foreground">AI Recommendations</h1>
          <motion.button whileTap={{ scale: 0.9 }} className="p-1">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Search query display */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Looking for {query}...
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_CHIPS.map((chip) => (
            <motion.button
              key={chip}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(chip)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === chip
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="flex-shrink-0 px-4 pb-2">
        <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
          {t.resultsTitle}
        </p>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading && results.length === 0 ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="mx-4 mb-2">
              <div className="rounded-xl p-3 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence>
            {results.map((place, idx) => (
              <motion.div
                key={place.place_id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <PlaceCard
                  place={place}
                  rank={idx + 1}
                  isActive={activePlace === place.place_id}
                  onSelect={() => setActivePlace(place.place_id)}
                  onDetail={() => navigate(`/place/${place.place_id}`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isStreaming && results.length > 0 && (
          <div className="mx-4 mb-2">
            <div className="rounded-xl p-3 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}
