import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Heart, Star, MapPin, CheckCircle2, AlertCircle, Clock } from "lucide-react";

// Mock detail data
const MOCK_DETAILS: Record<string, {
  name: string;
  address: string;
  rating: number;
  ratingCount: number;
  priceLevel: string;
  about: string;
  strengths: string[];
  considerations: string[];
  dishes: string;
  avgSpend: string;
  availability: string;
}> = {
  p1: {
    name: "The Ground Brew",
    address: "12 Market Street, Downtown",
    rating: 4.9,
    ratingCount: 2341,
    priceLevel: "$$",
    about: "The Ground Brew offers a refined coffee experience in a minimalist setting. Our baristas craft each cup with precision, using single-origin beans sourced directly from farmers.",
    strengths: ["Exceptional single-origin espresso.", "Minimalist Scandinavian interior design."],
    considerations: ["Limited seating during peak hours."],
    dishes: "40+",
    avgSpend: "$$",
    availability: "Today 8:00 AM",
  },
  p2: {
    name: "Komorebi Tables",
    address: "88 Oak Avenue, Midtown",
    rating: 4.7,
    ratingCount: 1890,
    priceLevel: "$$",
    about: "Komorebi Tables is a tranquil workspace and café hybrid. With high-speed WiFi and carefully curated acoustics, it's the perfect spot for deep work or quiet conversations.",
    strengths: ["High-speed WiFi throughout.", "Very quiet and focused environment."],
    considerations: ["Menu options are limited."],
    dishes: "25+",
    avgSpend: "$$",
    availability: "Today 9:00 AM",
  },
  p3: {
    name: "Velvet Crumb",
    address: "45 Elm Street, West End",
    rating: 4.8,
    ratingCount: 3102,
    priceLevel: "$",
    about: "Velvet Crumb is a beloved artisan bakery known for its sourdough breads and delicate pastries. Every item is made fresh daily using traditional techniques.",
    strengths: ["Award-winning artisanal sourdough.", "Currently trending in the area."],
    considerations: ["Can get crowded on weekends."],
    dishes: "35+",
    avgSpend: "$",
    availability: "Today 7:00 AM",
  },
  p4: {
    name: "Origin Roast",
    address: "200 Pine Road, Riverside",
    rating: 4.6,
    ratingCount: 876,
    priceLevel: "$",
    about: "Origin Roast is a neighborhood coffee shop specializing in single-origin pour-overs. Located just steps away, it's the perfect quick stop for quality caffeine.",
    strengths: ["Within 200m of your location.", "Excellent single-origin selection."],
    considerations: ["Small space, takeaway recommended."],
    dishes: "20+",
    avgSpend: "$",
    availability: "Today 7:30 AM",
  },
  p5: {
    name: "The Sage Bistro",
    address: "Gastronomy Park, San Francisco",
    rating: 4.8,
    ratingCount: 212,
    priceLevel: "$$$",
    about: "The Sage Bistro offers a refined culinary journey in the heart of San Francisco. Our kitchen celebrates locally sourced ingredients, transformed into contemporary dishes that highlight the purity of seasonal flavors.",
    strengths: ["Incredible farm-to-table seasonal menu.", "Atmospheric lighting perfect for dates."],
    considerations: ["Booking essential for weekend dinner."],
    dishes: "60+",
    avgSpend: "$$",
    availability: "Tonight 7:30 PM",
  },
  p6: {
    name: "Blue Bottle Coffee",
    address: "299 Copper Lane, Uptown",
    rating: 4.3,
    ratingCount: 654,
    priceLevel: "$$$",
    about: "Blue Bottle Coffee brings Japanese minimalism to the pour-over experience. Each cup is brewed with meticulous attention to detail using freshly roasted beans.",
    strengths: ["Japanese minimalist aesthetic.", "Expert pour-over technique."],
    considerations: ["Currently closed, check hours."],
    dishes: "15+",
    avgSpend: "$$$",
    availability: "Tomorrow 8:00 AM",
  },
};

// Warm placeholder gradients for the hero image
const heroGradients = [
  "from-amber-800/80 via-amber-700/60 to-amber-900/80",
  "from-stone-700/80 via-stone-600/60 to-stone-800/80",
  "from-emerald-800/80 via-emerald-700/60 to-emerald-900/80",
];

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const detail = MOCK_DETAILS[id || ""] || MOCK_DETAILS.p5;
  const gradientIdx = (id?.charCodeAt(1) || 0) % heroGradients.length;

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-y-auto">
      {/* Hero Image Area */}
      <div className="relative h-72 flex-shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${heroGradients[gradientIdx]}`} />

        {/* Overlay controls */}
        <div className="absolute top-0 left-0 right-0 z-10 safe-top">
          <div className="flex items-center justify-between px-4 py-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-background" />
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 text-background" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center"
              >
                <Heart className="w-4 h-4 text-background" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Image dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === 0 ? "bg-background" : "bg-background/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 -mt-4 bg-background rounded-t-3xl relative z-10">
        {/* Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">
            CURATED CHOICE
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-foreground">{detail.rating}</span>
            <span className="text-xs text-muted-foreground">({detail.ratingCount})</span>
          </div>
        </div>

        {/* Name & Address */}
        <h1
          className="text-2xl font-bold text-foreground mb-1"
          style={{ fontFamily: "'DM Serif Display', 'Noto Serif SC', serif" }}
        >
          {detail.name}
        </h1>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-5">
          <MapPin className="w-3 h-3" />
          <span>{detail.address}</span>
        </div>

        {/* AI Insights */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <span className="text-base">✦</span> AI Insights
          </h2>

          <div className="mb-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">
              STRENGTHS
            </p>
            {detail.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{s}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-amber-600 mb-2">
              CONSIDERATIONS
            </p>
            {detail.considerations.map((c, i) => (
              <div key={i} className="flex items-start gap-2 mb-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{detail.about}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around py-4 border-t border-b border-border mb-5">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Dishes</p>
            <p className="text-base font-semibold text-foreground">{detail.dishes}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Rating</p>
            <p className="text-base font-semibold text-foreground">{detail.rating}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Avg. Spend</p>
            <p className="text-base font-semibold text-foreground">{detail.avgSpend}</p>
          </div>
        </div>

        {/* Availability & CTA */}
        <div className="flex items-center justify-between pb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
              AVAILABILITY
            </p>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">{detail.availability}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"
          >
            Book a Table 🍽
          </motion.button>
        </div>
      </div>
    </div>
  );
}
