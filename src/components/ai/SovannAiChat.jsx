import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  RotateCcw,
  MapPin,
  Compass,
  Utensils,
  Bed,
  Loader2,
} from "lucide-react";
import { aiService } from "../../services/aiService";
import sovannLogo from "../../assets/sovann-ai.png";
import sovannBlinkLogo from "../../assets/sovann-ai-blink.png";

// Formats basic markdown elements (headings, bold, bullet points, numbered lists) safely
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Headings
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="pt-1 text-sm font-bold text-brand-900 dark:text-emerald-300">
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="pt-1.5 text-base font-bold text-brand-900 dark:text-emerald-200">
              {trimmed.replace(/^##\s+/, "")}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="pt-2 text-lg font-bold text-brand-900 dark:text-emerald-100">
              {trimmed.replace(/^#\s+/, "")}
            </h2>
          );
        }

        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.replace(/^[-*]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              <span>{parseBold(content)}</span>
            </div>
          );
        }

        // Numbered lists (e.g. "1. ")
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-semibold text-gold-600 dark:text-gold-400">{numMatch[1]}.</span>
              <span>{parseBold(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{parseBold(trimmed)}</p>;
      })}
    </div>
  );
}

function parseBold(str) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-brand-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const DEFAULT_SUGGESTIONS = [
  "Top places to visit in Siem Reap?",
  "Recommend boutique hotels with pool",
  "What authentic Khmer foods should I try?",
  "How do I pay with Bakong KHQR?",
];

/**
 * Animated Sovann Face with natural periodic eye blinking
 */
function SovannFace({ className = "h-14 w-14", isFloating = false, isHovered = false }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimer;
    let finishTimer;
    let secondBlinkTimer;
    let secondFinishTimer;

    const scheduleNextBlink = () => {
      // Natural blink interval: between 2.5s and 4.8s
      const delay = Math.random() * 2300 + 2500;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        finishTimer = setTimeout(() => {
          setIsBlinking(false);

          // 25% chance of a playful double blink
          if (Math.random() < 0.25) {
            secondBlinkTimer = setTimeout(() => {
              setIsBlinking(true);
              secondFinishTimer = setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 120);
            }, 80);
          } else {
            scheduleNextBlink();
          }
        }, 160);
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(finishTimer);
      clearTimeout(secondBlinkTimer);
      clearTimeout(secondFinishTimer);
    };
  }, []);

  return (
    <div
      className={`relative ${className} select-none transition-transform duration-300 ${
        isFloating ? "animate-sovann-float" : ""
      } ${isHovered ? "scale-105" : ""}`}
    >
      {/* Base Open Eyes Face */}
      <img
        src={sovannLogo}
        alt="Sovann AI"
        className={`h-full w-full object-contain drop-shadow-xl transition-opacity duration-75 ${
          isBlinking ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Blinking Happy Eyes Face */}
      <img
        src={sovannBlinkLogo}
        alt="Sovann AI Blinking"
        className={`absolute inset-0 h-full w-full object-contain drop-shadow-xl transition-opacity duration-75 ${
          isBlinking ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function SovannAiChat({ embedded = false, initialTab = "chat" }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [activeTab, setActiveTab] = useState(initialTab); // "chat" | "planner"
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "model",
      content:
        "សួស្តី! Hello! I am **Sovann**, your Cambodian Smart Tourism AI Concierge.\n\n" +
        "I can help you explore top attractions, recommend hotels & authentic dining, plan day-by-day itineraries, and guide you on local travel etiquette & Bakong KHQR payments.\n\n" +
        "How can I assist your Cambodia adventure today?",
      suggestedFollowUps: DEFAULT_SUGGESTIONS,
      referencedItems: [],
    },
  ]);

  // Itinerary Planner Form state
  const [plannerDest, setPlannerDest] = useState("Siem Reap");
  const [plannerDays, setPlannerDays] = useState(3);
  const [plannerBudget, setPlannerBudget] = useState("MODERATE");
  const [plannerStyle, setPlannerStyle] = useState("CULTURE_HERITAGE");
  const [itineraryResult, setItineraryResult] = useState(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // Greeting bubble state & hover state
  const [showGreeting, setShowGreeting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Pop up "Hello" greeting 1.6 seconds after load
  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      if (!isOpen && !hasInteracted) {
        setShowGreeting(true);
      }
    }, 1600);

    // Auto-hide greeting after 10 seconds if user hasn't clicked
    const autoHideTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 10000);

    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(autoHideTimer);
    };
  }, [isOpen, hasInteracted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, activeTab]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userTurn = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    // Prepare conversation history (exclude initial welcome)
    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.role === "model" ? "model" : "user",
        content: m.content,
      }));

    setMessages((prev) => [...prev, userTurn]);
    setInputMessage("");
    setLoading(true);

    try {
      const data = await aiService.chat({
        message: query,
        conversationHistory: history,
        destination: plannerDest,
      });

      const assistantTurn = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.reply,
        suggestedFollowUps: data.suggestedFollowUps || [],
        referencedItems: data.referencedItems || [],
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, assistantTurn]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          content:
            "I am having a moment reconnecting to the travel network. You can also explore our **[Tours](/tour)** or **[Hotels](/hotel)** directly!",
          suggestedFollowUps: DEFAULT_SUGGESTIONS,
          referencedItems: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "model",
        content: "Conversation cleared! What else would you like to discover about Cambodia?",
        suggestedFollowUps: DEFAULT_SUGGESTIONS,
        referencedItems: [],
      },
    ]);
  };

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItineraryResult(null);

    try {
      const data = await aiService.generateItinerary({
        destination: plannerDest,
        numberOfDays: plannerDays,
        budget: plannerBudget,
        travelStyle: plannerStyle,
      });
      setItineraryResult(data);
      setSelectedDayIdx(0);
    } catch (err) {
      console.error("Itinerary generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) on the right side */}
      {!embedded && (
      <div className="fixed bottom-[5.25rem] right-6 z-50 flex items-center gap-3">
        {/* Animated Speech Bubble: Sovann Says Hello! */}
        {!isOpen && showGreeting && (
          <div className="relative flex items-center gap-2.5 rounded-2xl border border-gold-400/50 bg-white/95 px-3.5 py-2 text-xs text-brand-900 shadow-lift backdrop-blur-md dark:bg-[#0d1c15] dark:text-emerald-100 animate-in fade-in slide-in-from-right-3 duration-300">
            <span className="inline-block animate-wave text-base select-none">👋</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowGreeting(false);
                setHasInteracted(true);
              }}
              className="text-left font-sans text-xs leading-tight hover:underline focus:outline-none"
            >
              <span className="font-bold text-brand-800 dark:text-emerald-300">សួស្តី! Hello!</span>
              <br />
              <span className="text-[11px] text-muted dark:text-emerald-400/80">I'm Sovann. Need travel tips?</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowGreeting(false);
                setHasInteracted(true);
              }}
              aria-label="Dismiss greeting"
              className="ml-0.5 rounded-md p-0.5 text-muted hover:bg-brand-50 hover:text-ink dark:text-emerald-400/60 dark:hover:bg-brand-900 dark:hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
            {/* Pointer arrow pointing right to Sovann */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-0 w-0 border-y-[6px] border-y-transparent border-l-[7px] border-l-white/95 dark:border-l-[#0d1c15]" />
          </div>
        )}

        {/* Regular Tooltip if Greeting is not shown */}
        {!isOpen && !showGreeting && (
          <div className="hidden animate-fade animate-ai-glow animate-sovann-float sm:flex items-center gap-2 rounded-full border border-gold-400/40 bg-brand-900/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lift backdrop-blur-md">
            <Sparkles size={13} className="text-gold-400" />
            <span>
              <span className="inline-block animate-wave text-sm select-none">👋</span> Hello! Ask Sovann AI
            </span>
          </div>
        )}

        {/* Sovann Floating Button with Blinking Face */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowGreeting(false);
            setHasInteracted(true);
          }}
          onMouseEnter={() => {
            setIsHovered(true);
            if (!isOpen && !showGreeting && !hasInteracted) {
              setShowGreeting(true);
            }
          }}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={isOpen ? "Close Sovann AI Assistant" : "Open Sovann AI Assistant"}
          className="group relative flex h-14 w-14 items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        >
          {isOpen ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-900 text-white shadow-lift border border-gold-400/40 transition-transform duration-200 group-hover:rotate-90">
              <X size={22} />
            </div>
          ) : (
            <SovannFace className="h-14 w-14" isFloating={true} isHovered={isHovered} />
          )}
        </button>
      </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Sovann AI Chat Concierge"
          className={`${embedded
            ? "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-soft dark:border-brand-900/80 dark:bg-[#0b1611] animate-in fade-in duration-200"
            : "fixed bottom-[9.5rem] right-4 z-50 flex h-[620px] max-h-[calc(100vh-11rem)] w-[410px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-brand-200/80 bg-white shadow-2xl backdrop-blur-xl dark:border-brand-900/80 dark:bg-[#0b1611] animate-in fade-in slide-in-from-bottom-5 duration-200"
          }`}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-line bg-gradient-to-r from-brand-800 via-brand-900 to-brand-950 px-4 py-3 text-white dark:border-brand-900/60">
            <div className="flex items-center gap-3">
              <SovannFace className="h-10 w-10 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold tracking-tight text-white sm:text-base">Sovann AI</h3>
                  <span className="rounded-full bg-gold-400/20 px-1.5 py-0.2 text-[10px] font-semibold text-gold-300">
                    Cambodia Concierge
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80">Powered by Google Gemini & DB Grounding</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="grid h-8 w-8 place-items-center rounded-lg text-emerald-200/80 transition-colors hover:bg-brand-700/50 hover:text-white"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-lg text-emerald-200/80 transition-colors hover:bg-brand-700/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-line bg-brand-50/50 p-1.5 dark:border-brand-900/50 dark:bg-[#08120e]">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${
                activeTab === "chat"
                  ? "bg-white text-brand-800 shadow-sm dark:bg-[#13241c] dark:text-emerald-300"
                  : "text-muted hover:text-ink dark:text-emerald-400/70"
              }`}
            >
              <MessageSquare size={14} />
              Chat Concierge
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("planner")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${
                activeTab === "planner"
                  ? "bg-white text-brand-800 shadow-sm dark:bg-[#13241c] dark:text-emerald-300"
                  : "text-muted hover:text-ink dark:text-emerald-400/70"
              }`}
            >
              <Compass size={14} />
              Trip Planner
            </button>
          </div>

          {/* TAB 1: Chat Concierge */}
          {activeTab === "chat" && (
            <>
              {/* Message Thread */}
              <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-ink dark:text-emerald-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[92%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {msg.role !== "user" && (
                        <SovannFace className="mb-0.5 h-7 w-7 shrink-0" />
                      )}
                      <div
                        className={`rounded-2xl p-3.5 shadow-sm transition-all ${
                          msg.role === "user"
                            ? "rounded-tr-xs bg-gradient-to-r from-brand-700 to-brand-800 text-white"
                            : "rounded-tl-xs border border-line bg-brand-50/70 text-ink dark:border-brand-900/50 dark:bg-[#13241c] dark:text-emerald-50"
                        }`}
                      >
                        <FormattedMessage text={msg.content} />
                      </div>
                    </div>

                    {/* Referenced Items (Attractions, Hotels, Foods) */}
                    {msg.referencedItems && msg.referencedItems.length > 0 && (
                      <div className="mt-2.5 w-full max-w-[95%] space-y-2 pl-9">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-emerald-400">
                          Referenced in platform:
                        </span>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {msg.referencedItems.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-xl border border-line bg-white p-2 text-xs shadow-soft dark:border-brand-900/60 dark:bg-[#0d1c15]"
                            >
                              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-emerald-300">
                                {item.type === "HOTEL" ? (
                                  <Bed size={14} />
                                ) : item.type === "FOOD" ? (
                                  <Utensils size={14} />
                                ) : (
                                  <MapPin size={14} />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-bold text-brand-900 dark:text-emerald-200">{item.name}</p>
                                <p className="truncate text-[10px] text-muted dark:text-emerald-400/70">
                                  {item.price ? `$${item.price}` : item.location || item.type}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Suggestion Chips */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                        {msg.suggestedFollowUps.map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(chip)}
                            className="rounded-full border border-brand-200 bg-white px-3 py-1 text-[11px] font-medium text-brand-800 shadow-2xs transition-all hover:border-gold-400 hover:bg-gold-50 hover:text-brand-900 active:scale-95 dark:border-brand-900/60 dark:bg-[#12221b] dark:text-emerald-300 dark:hover:bg-brand-900/80"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center gap-2.5 text-xs text-muted dark:text-emerald-400/80 pl-1">
                    <SovannFace className="h-5 w-5 shrink-0 animate-bounce" />
                    <span>Sovann is crafting your response...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="border-t border-line bg-canvas p-3 dark:border-brand-900/60 dark:bg-[#07100c]"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-1.5 shadow-2xs focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20 dark:border-brand-900/70 dark:bg-[#101e18]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about places, hotels, foods, KHQR..."
                    disabled={loading}
                    className="flex-1 bg-transparent py-1.5 text-xs outline-none placeholder:text-muted dark:text-emerald-100 dark:placeholder:text-emerald-400/50 sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    aria-label="Send message"
                    className="grid h-8 w-8 place-items-center rounded-xl bg-brand-700 text-white transition-all hover:bg-brand-800 active:scale-95 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* TAB 2: Trip Planner Mode */}
          {activeTab === "planner" && (
            <div className="flex-1 overflow-y-auto p-4">
              {!itineraryResult ? (
                <form onSubmit={handleGenerateItinerary} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted dark:text-emerald-400">
                      Destination
                    </label>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {["Siem Reap", "Phnom Penh", "Kampot", "Koh Rong", "Battambang"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setPlannerDest(d)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                            plannerDest === d
                              ? "bg-brand-700 text-white shadow-sm"
                              : "border border-line bg-white text-muted hover:border-brand-300 dark:border-brand-900/60 dark:bg-[#12221b] dark:text-emerald-300"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted dark:text-emerald-400">
                      Duration: <span className="font-display font-bold text-brand-800 dark:text-emerald-200">{plannerDays} Days</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={plannerDays}
                      onChange={(e) => setPlannerDays(Number(e.target.value))}
                      className="mt-2 w-full accent-brand-700"
                    />
                    <div className="flex justify-between text-[10px] text-muted dark:text-emerald-400/70">
                      <span>1 Day</span>
                      <span>3 Days</span>
                      <span>7 Days</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted dark:text-emerald-400">
                      Budget Level
                    </label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {[
                        { id: "BUDGET", label: "Budget", desc: "$30/day" },
                        { id: "MODERATE", label: "Moderate", desc: "$80/day" },
                        { id: "LUXURY", label: "Luxury", desc: "$200+/day" },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setPlannerBudget(b.id)}
                          className={`rounded-xl p-2 text-center transition-all ${
                            plannerBudget === b.id
                              ? "border-2 border-brand-600 bg-brand-50 text-brand-900 dark:bg-brand-900/60 dark:text-emerald-200"
                              : "border border-line bg-white text-muted dark:border-brand-900/60 dark:bg-[#12221b]"
                          }`}
                        >
                          <p className="text-xs font-bold">{b.label}</p>
                          <p className="text-[10px] opacity-80">{b.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted dark:text-emerald-400">
                      Travel Style
                    </label>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {[
                        { id: "CULTURE_HERITAGE", label: "Temples & Culture" },
                        { id: "NATURE_ADVENTURE", label: "Nature & Islands" },
                        { id: "FOODIE", label: "Food & Nightlife" },
                        { id: "RELAXATION", label: "Relaxation & Spa" },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setPlannerStyle(s.id)}
                          className={`rounded-xl p-2 text-left text-xs font-semibold transition-all ${
                            plannerStyle === s.id
                              ? "border border-brand-700 bg-brand-700 text-white"
                              : "border border-line bg-white text-muted hover:border-brand-300 dark:border-brand-900/60 dark:bg-[#12221b] dark:text-emerald-300"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 py-3 text-sm font-bold text-white shadow-soft transition-all hover:brightness-110 active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Designing Itinerary...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-gold-400" />
                        Generate Custom Plan
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs text-ink dark:text-emerald-50">
                  <div className="flex items-center justify-between border-b border-line pb-2 dark:border-brand-900/60">
                    <div>
                      <h4 className="font-display text-sm font-bold text-brand-900 dark:text-emerald-200">
                        {itineraryResult.title}
                      </h4>
                      <p className="text-[11px] text-muted dark:text-emerald-400/80">
                        Est. Budget: {itineraryResult.estimatedTotalBudget}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setItineraryResult(null)}
                      className="text-xs font-bold text-brand-700 hover:underline dark:text-emerald-400"
                    >
                      New Plan
                    </button>
                  </div>

                  {/* Day tabs */}
                  {itineraryResult.days && itineraryResult.days.length > 0 && (
                    <div>
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {itineraryResult.days.map((day, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedDayIdx(idx)}
                            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                              selectedDayIdx === idx
                                ? "bg-brand-700 text-white shadow-xs"
                                : "border border-line bg-white text-muted dark:border-brand-900/60 dark:bg-[#12221b] dark:text-emerald-300"
                            }`}
                          >
                            Day {day.dayNumber}
                          </button>
                        ))}
                      </div>

                      {/* Selected Day Details */}
                      {itineraryResult.days[selectedDayIdx] && (
                        <div className="mt-3 space-y-3 rounded-2xl border border-line bg-brand-50/50 p-3.5 dark:border-brand-900/60 dark:bg-[#12221b]">
                          <h5 className="font-bold text-brand-900 dark:text-emerald-200">
                            {itineraryResult.days[selectedDayIdx].theme}
                          </h5>

                          <div className="space-y-2 text-[11px]">
                            <div>
                              <span className="font-bold text-gold-600 dark:text-gold-400">🌅 Morning:</span>{" "}
                              {itineraryResult.days[selectedDayIdx].morningActivity}
                            </div>
                            <div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">🍲 Lunch:</span>{" "}
                              {itineraryResult.days[selectedDayIdx].lunchRecommendation}
                            </div>
                            <div>
                              <span className="font-bold text-gold-600 dark:text-gold-400">🏛️ Afternoon:</span>{" "}
                              {itineraryResult.days[selectedDayIdx].afternoonActivity}
                            </div>
                            <div>
                              <span className="font-bold text-brand-700 dark:text-emerald-300">🌙 Evening:</span>{" "}
                              {itineraryResult.days[selectedDayIdx].eveningActivity}
                            </div>
                            <div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">🍽️ Dinner:</span>{" "}
                              {itineraryResult.days[selectedDayIdx].dinnerRecommendation}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practical Tips */}
                  {itineraryResult.practicalTips && (
                    <div className="space-y-1.5 rounded-2xl border border-line bg-white p-3 dark:border-brand-900/60 dark:bg-[#0e1d16]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-emerald-400">
                        Local Cambodia Tips:
                      </span>
                      <ul className="list-inside list-disc space-y-1 text-[11px] text-muted dark:text-emerald-300/80">
                        {itineraryResult.practicalTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </aside>
      )}
    </>
  );
}
