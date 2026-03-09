/**
 * useSearchStream — 搜索流 Hook
 *
 * 调用 POST /api/requests/?stream={bool}
 * - stream=false (默认): 返回 JSON
 * - stream=true: 预留 SSE（OpenAPI 标注为 reserved for future）
 *
 * 后端不可用时自动回退到 mock 数据。
 */
import { useState, useCallback, useRef } from "react";
import type { PlaceSummary, LatLng } from "@/types";
import { createSearchRequest } from "@/services/api";

// ── Mock 数据（后端未就绪时使用）──
const MOCK_PLACES: PlaceSummary[] = [
  {
    place_id: "p1",
    name: "The Ground Brew",
    address: "12 Market Street, Downtown",
    distance_km: 0.2,
    price_level: "$$",
    rating: 4.9,
    rating_count: 2341,
    recommendation_score: 0.95,
    status: "open_now",
    eta_minutes: 3,
    reason_tags: ["Minimalist design", "Strong espresso"],
  },
  {
    place_id: "p2",
    name: "Komorebi Tables",
    address: "88 Oak Avenue, Midtown",
    distance_km: 0.5,
    price_level: "$$",
    rating: 4.7,
    rating_count: 1890,
    recommendation_score: 0.91,
    status: "closing_soon",
    eta_minutes: 7,
    reason_tags: ["High-speed WiFi", "Quiet environment"],
  },
  {
    place_id: "p3",
    name: "Velvet Crumb",
    address: "45 Elm Street, West End",
    distance_km: 0.8,
    price_level: "$",
    rating: 4.8,
    rating_count: 3102,
    recommendation_score: 0.88,
    status: "open_now",
    eta_minutes: 10,
    reason_tags: ["Artisanal sourdough", "Trending"],
  },
  {
    place_id: "p4",
    name: "Origin Roast",
    address: "200 Pine Road, Riverside",
    distance_km: 0.2,
    price_level: "$",
    rating: 4.6,
    rating_count: 876,
    recommendation_score: 0.84,
    status: "open_now",
    eta_minutes: 4,
    reason_tags: ["Near you", "Single origin"],
  },
  {
    place_id: "p5",
    name: "The Sage Bistro",
    address: "Gastronomy Park, Central",
    distance_km: 1.5,
    price_level: "$$$",
    rating: 4.8,
    rating_count: 212,
    recommendation_score: 0.79,
    status: "open_now",
    eta_minutes: 14,
    reason_tags: ["Farm-to-table", "Date night"],
  },
  {
    place_id: "p6",
    name: "Blue Bottle Coffee",
    address: "299 Copper Lane, Uptown",
    distance_km: 3.0,
    price_level: "$$$",
    rating: 4.3,
    rating_count: 654,
    recommendation_score: 0.72,
    status: "closed",
    eta_minutes: 25,
    reason_tags: ["Japanese minimal", "Pour-over"],
  },
];

type RankedOfferLike = {
  id?: string;
  provider_id?: string;
  name?: string;
  address?: string;
  distance_km?: number;
  price_range?: string;
  rating?: number;
  review_count?: number;
  score?: number;
  reasons?: string[];
  time_label?: string;
  eta_minutes?: number;
};

function inferStatus(timeLabel?: string): PlaceSummary["status"] {
  const label = (timeLabel || "").toLowerCase();
  if (label.includes("closing soon")) return "closing_soon";
  if (label.includes("closed")) return "closed";
  return "open_now";
}

function inferEtaMinutes(offer: RankedOfferLike): number {
  if (typeof offer.eta_minutes === "number") return offer.eta_minutes;
  const label = offer.time_label || "";
  const matched = label.match(/(\d+)\s*min/i);
  if (matched?.[1]) return Number(matched[1]);
  if (typeof offer.distance_km === "number") return Math.max(3, Math.round(offer.distance_km * 4));
  return 10;
}

function normalizeOffersToPlaces(offers: RankedOfferLike[]): PlaceSummary[] {
  return offers.map((offer, idx) => {
    const score = typeof offer.score === "number" ? offer.score : 1 - idx * 0.05;
    const id = offer.id || offer.provider_id || `provider-${idx}`;
    return {
      place_id: id,
      name: offer.name || `Provider ${idx + 1}`,
      address: offer.address || "Address unavailable",
      distance_km: typeof offer.distance_km === "number" ? offer.distance_km : 0,
      price_level: offer.price_range || "medium",
      rating: typeof offer.rating === "number" ? offer.rating : 0,
      rating_count: typeof offer.review_count === "number" ? offer.review_count : 0,
      recommendation_score: score,
      status: inferStatus(offer.time_label),
      eta_minutes: inferEtaMinutes(offer),
      reason_tags: Array.isArray(offer.reasons) ? offer.reasons : [],
    };
  });
}

export function useSearchStream() {
  const [results, setResults] = useState<PlaceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const timerRef = useRef<number[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const startMockStream = useCallback(() => {
    setRequestId("mock-req-" + Date.now());
    MOCK_PLACES.forEach((place, idx) => {
      const timer = window.setTimeout(() => {
        setResults((prev) => [...prev, place]);
        if (idx === 0) setIsLoading(false);
        if (idx === MOCK_PLACES.length - 1) setIsStreaming(false);
      }, 600 + idx * 500);
      timerRef.current.push(timer);
    });
  }, []);

  const startSearch = useCallback(
    async (query: string, location: LatLng) => {
      clearTimers();
      setResults([]);
      setIsLoading(true);
      setIsStreaming(true);

      try {
        // POST /api/requests/?stream=false (default non-stream mode)
        const res = await createSearchRequest(query, location, { stream: false });

        if (!res.ok) throw new Error(`API returned ${res.status}`);

        const data = await res.json();
        setRequestId(data.request?.id || data.request_id || null);
        const normalizedResults: PlaceSummary[] = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.offers)
            ? normalizeOffersToPlaces(data.offers)
            : [];
        setResults(
          normalizedResults.sort(
            (a: PlaceSummary, b: PlaceSummary) =>
              b.recommendation_score - a.recommendation_score
          )
        );
        setIsLoading(false);
        setIsStreaming(false);
      } catch (err) {
        // 后端不可用 → 回退到 mock
        console.warn("Backend unavailable, using mock data:", err);
        startMockStream();
      }
    },
    [startMockStream]
  );

  const reset = useCallback(() => {
    clearTimers();
    setResults([]);
    setIsLoading(false);
    setIsStreaming(false);
    setRequestId(null);
  }, []);

  return { results, isLoading, isStreaming, requestId, startSearch, reset };
}
