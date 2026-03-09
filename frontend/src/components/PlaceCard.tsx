import { motion } from "framer-motion";
import { Star, Bookmark } from "lucide-react";
import type { PlaceSummary } from "@/types";
import { useLang } from "@/i18n/LanguageContext";

interface PlaceCardProps {
  place: PlaceSummary;
  rank: number;
  isActive: boolean;
  onSelect: () => void;
  onDetail: () => void;
}

export default function PlaceCard({ place, rank, isActive, onSelect, onDetail }: PlaceCardProps) {
  const { t } = useLang();

  const statusMap: Record<string, { label: string; color: string }> = {
    open_now: { label: t.open, color: "text-emerald-600" },
    closing_soon: { label: t.closingSoon, color: "text-amber-600" },
    closed: { label: t.closed, color: "text-destructive" },
  };

  const status = statusMap[place.status] ?? { label: place.status, color: "text-muted-foreground" };

  const placeholderColors = [
    "bg-amber-100 dark:bg-amber-900/30",
    "bg-orange-100 dark:bg-orange-900/30",
    "bg-rose-100 dark:bg-rose-900/30",
    "bg-stone-100 dark:bg-stone-900/30",
    "bg-emerald-100 dark:bg-emerald-900/30",
    "bg-sky-100 dark:bg-sky-900/30",
  ];

  return (
    <motion.div
      className="mx-4 mb-1 cursor-pointer"
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      onDoubleClick={onDetail}
      layout
    >
      <div
        className={`rounded-xl p-3 transition-all duration-200 ${
          isActive
            ? "bg-card ring-1 ring-primary/20 shadow-sm"
            : "bg-transparent hover:bg-card/60"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${placeholderColors[(rank - 1) % placeholderColors.length]} flex items-center justify-center overflow-hidden`}>
            <span className="text-lg opacity-60">{place.name.charAt(0)}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-0.5">
              <h4 className="font-semibold text-sm text-foreground leading-tight">{place.name}</h4>
              <Bookmark className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                {place.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span className={`font-medium ${status.color}`}>{status.label}</span>
            </div>

            {place.reason_tags.length > 0 && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground/70">{t.whyThis}</span>{" "}
                {place.reason_tags.join(", ")}.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
