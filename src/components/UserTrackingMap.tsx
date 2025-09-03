// src/components/UserTrackingMap.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const MAP_CONTAINER_ID = "map";

export default function UserTrackingMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error("Mapbox Access Token is not set!");
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: MAP_CONTAINER_ID,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.8456, -6.2088],
      zoom: 11,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div id={MAP_CONTAINER_ID} className="w-screen h-screen" />;
}
