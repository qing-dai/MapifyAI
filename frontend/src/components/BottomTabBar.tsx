import { useLocation, useNavigate } from "react-router-dom";
import { Compass, MessageSquare, Heart, User, Sparkles, Map } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Compass, label: "Explore" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "__ai__", icon: Sparkles, label: "AI Agent", isCenter: true },
  { path: "/map", icon: Map, label: "Map" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // No longer hiding on detail page

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-background/95 backdrop-blur-lg border-t border-border/50">
        <div className="flex items-center justify-around px-4 py-2 max-w-lg mx-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;

            if (tab.isCenter) {
              return (
                <motion.button
                  key={tab.path}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/chat")}
                  className="relative -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-[10px] text-primary font-medium mt-0.5 block text-center">
                    AI Agent
                  </span>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={tab.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3"
              >
                <tab.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground/60"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span
                  className={`text-[10px] transition-colors ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground/60"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
