/**
 * API 服务层 — 严格对齐后端 OpenAPI 3.1.0 规范
 *
 * 路由对应关系：
 *   POST   /api/requests/                    → createSearchRequest
 *   GET    /api/requests/{request_id}        → getRequest
 *   GET    /api/requests/{request_id}/offers → getOffers
 *   GET    /api/requests/{request_id}/trace  → getTrace
 *   POST   /api/offers/                      → submitOffer
 *   PATCH  /api/offers/{offer_id}            → updateOffer
 *   GET    /api/providers/                   → listProviders
 *   GET    /api/providers/{provider_id}      → getProvider
 *   GET    /api/users/me                     → getProfile
 *   PUT    /api/users/me/preferences         → updatePreferences
 *   GET    /api/places/{place_id}            → getPlaceDetail
 *   GET    /api/places/{place_id}/reviews    → getPlaceReviews
 *   GET    /health                           → healthCheck
 */
import type {
  LatLng,
  CreateRequestPayload,
  SubmitOfferBody,
  UserPreferences,
  PlaceDetailResponse,
  PlaceReviewsPage,
  RequestWithResults,
  OffersResponse,
  TraceResponse,
  ProfileResponse,
  Provider,
} from "@/types";

const BASE = "/api";

// ─────────────────────────────────────────────
// 1. Requests
// ─────────────────────────────────────────────

/**
 * POST /api/requests/?stream={bool}
 * stream 是 query param，不在 body 中
 */
export async function createSearchRequest(
  query: string,
  location: LatLng,
  options?: {
    stream?: boolean;
    preferences?: UserPreferences | null;
  }
): Promise<Response> {
  const stream = options?.stream ?? false;
  const payload: CreateRequestPayload = {
    raw_input: query,
    location,
    ...(options?.preferences ? { preferences: options.preferences } : {}),
  };

  return fetch(`${BASE}/requests/?stream=${stream}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(stream ? { Accept: "text/event-stream" } : {}),
    },
    body: JSON.stringify(payload),
  });
}

/** GET /api/requests/{request_id} */
export async function getRequest(
  requestId: string
): Promise<RequestWithResults> {
  const res = await fetch(`${BASE}/requests/${requestId}`);
  if (!res.ok) throw new Error(`GET /requests/${requestId} failed: ${res.status}`);
  return res.json();
}

/** GET /api/requests/{request_id}/offers */
export async function getOffers(
  requestId: string
): Promise<OffersResponse> {
  const res = await fetch(`${BASE}/requests/${requestId}/offers`);
  if (!res.ok) throw new Error(`GET /requests/${requestId}/offers failed: ${res.status}`);
  return res.json();
}

/** GET /api/requests/{request_id}/trace */
export async function getTrace(
  requestId: string
): Promise<TraceResponse> {
  const res = await fetch(`${BASE}/requests/${requestId}/trace`);
  if (!res.ok) throw new Error(`GET /requests/${requestId}/trace failed: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// 2. Places
// ─────────────────────────────────────────────

/** GET /api/places/{place_id}?request_id={optional} */
export async function getPlaceDetail(
  placeId: string,
  requestId?: string
): Promise<PlaceDetailResponse> {
  const qs = requestId ? `?request_id=${requestId}` : "";
  const res = await fetch(`${BASE}/places/${placeId}${qs}`);
  if (!res.ok) throw new Error(`GET /places/${placeId} failed: ${res.status}`);
  return res.json();
}

/** GET /api/places/{place_id}/reviews?page=&page_size=&sort= */
export async function getPlaceReviews(
  placeId: string,
  page = 1,
  pageSize = 20,
  sort: "relevance" | "newest" | "highest_rating" | "lowest_rating" = "relevance"
): Promise<PlaceReviewsPage> {
  const res = await fetch(
    `${BASE}/places/${placeId}/reviews?page=${page}&page_size=${pageSize}&sort=${sort}`
  );
  if (!res.ok) throw new Error(`GET /places/${placeId}/reviews failed: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// 3. Providers
// ─────────────────────────────────────────────

/** GET /api/providers/?category=&lat=&lng=&radius_km= */
export async function listProviders(options?: {
  category?: string;
  lat?: number;
  lng?: number;
  radius_km?: number;
}): Promise<Provider[]> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.lat != null) params.set("lat", String(options.lat));
  if (options?.lng != null) params.set("lng", String(options.lng));
  if (options?.radius_km != null) params.set("radius_km", String(options.radius_km));

  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${BASE}/providers/${qs}`);
  if (!res.ok) throw new Error(`GET /providers failed: ${res.status}`);
  return res.json();
}

/** GET /api/providers/{provider_id} */
export async function getProvider(providerId: string): Promise<Provider> {
  const res = await fetch(`${BASE}/providers/${providerId}`);
  if (!res.ok) throw new Error(`GET /providers/${providerId} failed: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// 4. Offers
// ─────────────────────────────────────────────

/** POST /api/offers/ */
export async function submitOffer(payload: SubmitOfferBody) {
  const res = await fetch(`${BASE}/offers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST /offers failed: ${res.status}`);
  return res.json();
}

/** PATCH /api/offers/{offer_id} */
export async function updateOffer(
  offerId: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(`${BASE}/offers/${offerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PATCH /offers/${offerId} failed: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// 5. Users / Profile
// ─────────────────────────────────────────────

/** GET /api/users/me */
export async function getProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${BASE}/users/me`);
  if (!res.ok) throw new Error(`GET /users/me failed: ${res.status}`);
  return res.json();
}

/** PUT /api/users/me/preferences */
export async function updatePreferences(
  prefs: UserPreferences
): Promise<ProfileResponse> {
  const res = await fetch(`${BASE}/users/me/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs),
  });
  if (!res.ok) throw new Error(`PUT /users/me/preferences failed: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// 6. Health
// ─────────────────────────────────────────────

/** GET /health */
export async function healthCheck(): Promise<unknown> {
  const res = await fetch("/health");
  if (!res.ok) throw new Error(`GET /health failed: ${res.status}`);
  return res.json();
}
