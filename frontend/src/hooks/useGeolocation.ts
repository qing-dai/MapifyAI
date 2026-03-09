import { useState, useEffect } from "react";
import type { LatLng } from "@/types";

interface GeolocationState {
  location: LatLng | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ location: null, error: "Geolocation not supported", loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (err) => {
        // Default to Shanghai if denied
        setState({
          location: { lat: 31.2304, lng: 121.4737 },
          error: err.message,
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return state;
}
