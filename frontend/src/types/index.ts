/**
 * TypeScript 类型契约 — 严格对齐后端 OpenAPI 3.1.0 规范
 */

// ── Geo ──
export interface LatLng {
  lat: number;
  lng: number;
}

// ── User Preferences (schemas.UserPreferences) ──
export interface UserPreferences {
  weight_price?: number;   // default 0.33
  weight_distance?: number; // default 0.33
  weight_rating?: number;   // default 0.34
}

// ── Create Request Payload (schemas.CreateRequestPayload) ──
// NOTE: `stream` is a query parameter, NOT part of the body
export interface CreateRequestPayload {
  raw_input: string;
  location: LatLng;
  preferences?: UserPreferences | null;
}

// ── Submit Offer Body (schemas.SubmitOfferBody) ──
export interface SubmitOfferBody {
  request_id: string;
  price: number;
  eta_minutes: number;
  message?: string | null;
}

// ── Structured Request ──
export interface StructuredRequest {
  id: string;
  raw_input: string;
  category: string;
  requested_time: string;
  location: LatLng;
  radius_km: number;
  constraints: Record<string, unknown>;
  status: "pending" | "open" | "closed" | string;
  created_at: string | null;
}

// ── Place Summary (列表 / 地图联动) ──
export interface PlaceSummary {
  place_id: string;
  name: string;
  address: string;
  distance_km: number;
  price_level: "low" | "medium" | "high" | string;
  rating: number;
  rating_count: number;
  recommendation_score: number;
  status: "open_now" | "closing_soon" | "closed" | string;
  eta_minutes: number;
  reason_tags: string[];
}

// ── Request + Results (GET /api/requests/{id}) ──
export interface RequestWithResults {
  request: StructuredRequest;
  results: PlaceSummary[];
}

// ── Place Detail (GET /api/places/{place_id}) ──
export interface OpeningHoursToday {
  today_open: string;
  today_close: string;
  is_open_now: boolean;
}

export interface PlaceBasic {
  place_id: string;
  name: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  location: LatLng;
  rating: number;
  rating_count: number;
  price_level: "low" | "medium" | "high" | string;
  status: "open_now" | "closing_soon" | "closed" | string;
  opening_hours?: OpeningHoursToday | null;
}

export interface ReviewSummary {
  positive_highlights: string[];
  negative_highlights: string[];
  star_reasons: Record<string, string[]>;
}

export type RatingDistribution = Record<string, number>;

export interface PlaceDetail {
  place: PlaceBasic;
  review_summary: ReviewSummary;
  rating_distribution: RatingDistribution;
  recommendation_reasons: string[];
}

export interface PlaceDetailResponse {
  request_id: string;
  detail: PlaceDetail;
}

// ── Reviews (GET /api/places/{place_id}/reviews) ──
export interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: string;
  language: string;
}

export interface PlaceReviewsPage {
  place_id: string;
  page: number;
  page_size: number;
  total: number;
  reviews: PlaceReview[];
}

// ── User Profile ──
export interface UserProfileWeights {
  price: number;
  distance: number;
  rating: number;
  popularity: number;
}

export interface UserProfile {
  user_id: string;
  persona: string;
  budget_level: "low" | "medium" | "high" | string;
  distance_preference: string;
  has_kids: boolean;
  needs_wheelchair_access: boolean;
  weights: UserProfileWeights;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  profile: UserProfile;
}

// ── Offers ──
export interface OfferSlot {
  from: string;
  to: string;
}

export interface Offer {
  id: string;
  request_id: string;
  provider_id: string;
  price: number;
  currency: string;
  eta_minutes: number;
  slot: OfferSlot;
  status: string;
}

export interface OffersResponse {
  request_id: string;
  offers: Offer[];
}

// ── Providers (GET /api/providers) ──
export interface Provider {
  id: string;
  name: string;
  category: string;
  location: LatLng;
  address: string;
  rating: number;
  review_count: number;
  price_range: string;
  distance_km?: number | null;
}

// ── Debug / Trace (GET /api/requests/{id}/trace) ──
export interface TraceGraphNode {
  id: string;
  type: string;
}

export interface TraceGraphEdge {
  from: string;
  to: string;
}

export interface TraceStepView {
  node_id: string;
  status: string;
  duration_ms: number;
  input_summary: string;
  output_summary: string;
}

export interface TraceResponse {
  trace_id: string;
  request_id: string;
  graph: {
    nodes: TraceGraphNode[];
    edges: TraceGraphEdge[];
  };
  steps: TraceStepView[];
  created_at: string;
}

// ── Validation Error (OpenAPI HTTPValidationError) ──
export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail: ValidationErrorItem[];
}
