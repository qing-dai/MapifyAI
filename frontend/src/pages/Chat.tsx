import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, User, Zap, Search, MapPin, Star, Calendar } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  skills?: Skill[];
  placeCards?: PlaceCardData[];
};

type Skill = {
  label: string;
  icon: string;
};

type PlaceCardData = {
  id: string;
  name: string;
  rating: number;
  category: string;
  address: string;
};

const SKILLS: Skill[] = [
  { label: "Find Places", icon: "🔍" },
  { label: "Book Table", icon: "📅" },
  { label: "Get Directions", icon: "🗺" },
  { label: "Compare Prices", icon: "💰" },
];

const AI_RESPONSES: { match: string; text: string; places?: PlaceCardData[] }[] = [
  {
    match: "coffee",
    text: "I found some great coffee spots near you! Here are my top picks based on your preferences for minimalist design and strong espresso:",
    places: [
      { id: "p1", name: "The Ground Brew", rating: 4.9, category: "Coffee", address: "12 Market Street" },
      { id: "p3", name: "Velvet Crumb", rating: 4.8, category: "Bakery & Coffee", address: "45 Elm Street" },
      { id: "p4", name: "Origin Roast", rating: 4.6, category: "Coffee", address: "200 Pine Road" },
    ],
  },
  {
    match: "restaurant",
    text: "Here are some highly-rated restaurants that match your taste profile. I've prioritized places with great atmosphere and seasonal menus:",
    places: [
      { id: "p5", name: "The Sage Bistro", rating: 4.8, category: "Fine Dining", address: "Gastronomy Park" },
      { id: "p2", name: "Komorebi Tables", rating: 4.7, category: "Japanese Fusion", address: "88 Oak Avenue" },
    ],
  },
  {
    match: "barber",
    text: "I found 3 barber shops nearby with good ratings and availability today:",
    places: [
      { id: "p1", name: "Sharp Edge Barber", rating: 4.7, category: "Barber", address: "22 Main St" },
      { id: "p2", name: "The Gentleman's Cut", rating: 4.5, category: "Barber", address: "55 Oak Blvd" },
    ],
  },
  {
    match: "default",
    text: "I'd be happy to help! I can find places, make bookings, compare prices, or get directions for you. What are you looking for today?",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi there! 👋 I'm your AI Agent. I can help you discover places, book appointments, and more. What would you like to do today?",
    skills: SKILLS,
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.content.toLowerCase();
      const matched = AI_RESPONSES.find((r) => lower.includes(r.match)) || AI_RESPONSES.find((r) => r.match === "default")!;
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: matched.text,
        placeCards: matched.places,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSkillClick = (skill: Skill) => {
    setInput(skill.label);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 safe-top border-b border-border/50">
        <div className="flex items-center justify-center px-5 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-base font-semibold text-foreground">AI Agent</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-40">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === "user" ? "" : ""}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/60 text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Skills */}
                {msg.skills && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.skills.map((skill) => (
                      <motion.button
                        key={skill.label}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSkillClick(skill)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/60 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        <span>{skill.icon}</span>
                        {skill.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Place Cards from AI */}
                {msg.placeCards && (
                  <div className="mt-3 space-y-2">
                    {msg.placeCards.map((place) => (
                      <motion.div
                        key={place.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/place/${place.id}`)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60 cursor-pointer hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{place.name}</p>
                          <p className="text-xs text-muted-foreground">{place.category} · {place.address}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium text-foreground">{place.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border border-border/60">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 safe-bottom">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-card border border-border/60 shadow-lg max-w-lg mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask your AI agent..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none px-3 py-2"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              input.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            disabled={!input.trim() || isTyping}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
