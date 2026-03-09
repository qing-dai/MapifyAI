import { motion } from "framer-motion";
import { User, MapPin, Star, Heart, Settings, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

const STATS = [
  { label: "Visited", value: "23" },
  { label: "Reviews", value: "8" },
  { label: "Saved", value: "14" },
];

const RECENT_VISITS = [
  { name: "The Ground Brew", rating: 5, date: "Yesterday" },
  { name: "Velvet Crumb", rating: 4, date: "3 days ago" },
  { name: "The Sage Bistro", rating: 5, date: "1 week ago" },
];

const MENU_ITEMS = [
  { icon: Settings, label: "Preferences" },
  { icon: CreditCard, label: "Payment Methods" },
  { icon: Bell, label: "Notifications" },
  { icon: HelpCircle, label: "Help & Support" },
];

export default function Profile() {
  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <div className="flex-shrink-0 safe-top border-b border-border/50">
        <div className="flex items-center justify-center px-5 py-3">
          <h1 className="text-base font-semibold text-foreground">Profile</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-5 py-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-2">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Alex Chen</h2>
          <p className="text-xs text-muted-foreground">San Francisco, CA</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around py-4 rounded-2xl bg-card border border-border/60 mb-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Visits */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-3">RECENT VISITS</p>
          <div className="space-y-2">
            {RECENT_VISITS.map((visit) => (
              <div key={visit.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60">
                <div>
                  <p className="text-sm font-medium text-foreground">{visit.name}</p>
                  <p className="text-xs text-muted-foreground">{visit.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < visit.rating ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </motion.button>
          ))}

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors mt-2"
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">Sign Out</span>
          </motion.button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
