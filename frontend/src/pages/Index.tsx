import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MapBackground from "@/components/MapBackground";
import { Moon, Sun, Globe, ArrowRight, Paperclip, Mic } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";
import { useLang } from "@/i18n/LanguageContext";

const QUICK_ACCESS = [
  { label: "Barber", icon: "✂️", category: "barber" },
  { label: "Car Wash", icon: "🚗", category: "car_wash" },
  { label: "Dining", icon: "🍽", category: "dining" },
  { label: "Coffee", icon: "☕", category: "coffee" },
  { label: "Hotels", icon: "🏨", category: "hotels" },
];

const Index = () => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLang();
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(
    (q: string) => {
      if (q.trim()) {
        navigate(`/recommendations?q=${encodeURIComponent(q.trim())}`);
      }
    },
    [navigate]
  );

  const handleQuickAccess = (category: string, label: string) => {
    navigate(`/map?q=${encodeURIComponent(label)}&category=${category}`);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden">
      <MapBackground lat={31.2304} lng={121.4737} />
      {/* Header */}
      <div className="flex-shrink-0 safe-top relative z-10">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-base">✦</span>
            <span className="text-sm font-semibold text-foreground">Agent Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleLang}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-foreground">U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24 relative z-10">
        <motion.div
          className="w-full max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Greeting */}
          <motion.h1
            className="text-2xl font-bold text-foreground mb-1 text-center"
            style={{ fontFamily: "'DM Serif Display', 'Noto Serif SC', serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            How can I help you today?
          </motion.h1>
          <motion.p
            className="text-sm text-muted-foreground mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Find any service or book an appointment instantly.
          </motion.p>

          {/* Search Input Card */}
          <motion.div
            className={`rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-300 shadow-sm ${
              isFocused ? "ring-1 ring-primary/20 shadow-md" : ""
            }`}
          >
            <div className="px-4 pt-4 pb-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch(query);
                  }
                }}
                placeholder="Ask me anything... (e.g., I want to find a barber nearby)"
                rows={3}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Paperclip className="w-4 h-4 text-muted-foreground/60" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Mic className="w-4 h-4 text-muted-foreground/60" />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSearch(query)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  query.trim()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                disabled={!query.trim()}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-2.5">
              QUICK ACCESS
            </p>
            <div className="flex gap-2 flex-wrap">
              {QUICK_ACCESS.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAccess(item.category, item.label)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card text-foreground text-xs font-medium whitespace-nowrap hover:bg-secondary transition-colors border border-border/60 shadow-sm"
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default Index;
