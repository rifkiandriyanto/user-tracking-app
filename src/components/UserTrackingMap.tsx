"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useUserSimulation } from "@/hooks/useUserSimulation";
import type { User } from "@/lib/simulation";
import { useAtom, useSetAtom } from "jotai";
import { usersAtom, followUserIdAtom } from "@/store/userStore";

const buildPopupHtml = (user: User, isCurrentlyFollowing: boolean) => {
  const buttonStyle = "w-full mt-2 py-1.5 px-2.5 rounded text-white cursor-pointer transition-colors";
  const actionButton = isCurrentlyFollowing
    ? `<button onclick="window.unfollowUser()" class="${buttonStyle} bg-red-500 hover:bg-red-600">Unfollow</button>`
    : `<button onclick="window.followUser('${user.id}')" class="${buttonStyle} bg-blue-500 hover:bg-blue-600">Follow</button>`;

  return `
    <div class="font-sans min-w-[180px] text-black">
      <h3 class="m-0 mb-1 text-base font-bold">${user.name}</h3>
      <p class="m-0 text-xs text-gray-600">ID: ${user.id}</p>
      <p class="m-0 text-xs text-gray-600">Lat: ${user.latitude.toFixed(5)}</p>
      <p class="m-0 text-xs text-gray-600">Lng: ${user.longitude.toFixed(5)}</p>
      ${actionButton}
    </div>
  `;
};

const createMarkerNode = () => {
  const node = document.createElement("div");
  node.className = "user-marker";
  node.style.cssText = `
    width: 12px; height: 12px; border-radius: 50%;
    background: #00bcd4; border: 2px solid white;
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    cursor: pointer;
  `;
  return node;
};

export default function UserTrackingMap() {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const activePopupUserIdRef = useRef<string | null>(null);

  const setUsersAtom = useSetAtom(usersAtom);
  const [followUserId, setFollowUserId] = useAtom(followUserIdAtom);

  const followUserIdRef = useRef(followUserId);
  useEffect(() => {
    followUserIdRef.current = followUserId;
  }, [followUserId]);

  const onSimulationData = useCallback((data: { type: string; users: User[] }) => {
    if (data.type !== "snapshot" && data.type !== "update") return;

    setUsersAtom(data.users);

    const map = mapInstanceRef.current;
    if (!map) return;

    const markerRegistry = markersRef.current;

    data.users.forEach((user) => {
      const { id, latitude, longitude } = user;
      const lngLat: [number, number] = [longitude, latitude];
      const isBeingFollowed = id === followUserIdRef.current;

      let marker = markerRegistry[id];

      if (marker) {
        marker.setLngLat(lngLat);
      } else {
        const markerNode = createMarkerNode();
        marker = new mapboxgl.Marker({ element: markerNode })
          .setLngLat(lngLat)
          .addTo(map);
        
        markerNode.addEventListener("click", (e) => {
          e.stopPropagation();
          if (popupRef.current) {
            const isFollowedOnOpen = user.id === followUserIdRef.current;
            popupRef.current
              .setLngLat(lngLat)
              .setHTML(buildPopupHtml(user, isFollowedOnOpen))
              .addTo(map);
            activePopupUserIdRef.current = user.id;
          }
        });
        markerRegistry[id] = marker;
      }

      if (isBeingFollowed) {
        map.easeTo({ center: lngLat, duration: 1000 });

        if (popupRef.current) {
          const isPopupOpenForThisUser = popupRef.current.isOpen() && activePopupUserIdRef.current === id;
          if (!isPopupOpenForThisUser) {
            popupRef.current
              .setLngLat(lngLat)
              .setHTML(buildPopupHtml(user, true))
              .addTo(map);
            activePopupUserIdRef.current = id;
          }
        }
      }
      
      const isPopupCurrentlyOpen = popupRef.current?.isOpen() && activePopupUserIdRef.current === id;
      if (isPopupCurrentlyOpen) {
        popupRef.current?.setLngLat(lngLat).setHTML(buildPopupHtml(user, isBeingFollowed));
      }
    });
  }, [setUsersAtom]);

  useUserSimulation(onSimulationData);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.8456, -6.2088],
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapInstanceRef.current = map;

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      anchor: "bottom",
      offset: [0, -15],
    });

    popup.on("close", () => {
      if (followUserIdRef.current) {
        setFollowUserId(null);
      }
      activePopupUserIdRef.current = null;
    });

    popupRef.current = popup;

    map.on("click", (e) => {
      if (followUserIdRef.current) return;
      const target = e.originalEvent.target as HTMLElement;
      if (!target.closest(".user-marker")) {
        popupRef.current?.remove();
        activePopupUserIdRef.current = null;
      }
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [setFollowUserId]);

  useEffect(() => {
    (window as any).followUser = (userId: string) => setFollowUserId(userId);
    (window as any).unfollowUser = () => {
      setFollowUserId(null);
      popupRef.current?.remove();
      activePopupUserIdRef.current = null;
    };

    return () => {
      delete (window as any).followUser;
      delete (window as any).unfollowUser;
    };
  }, [setFollowUserId]);

  return <div id="map" className="w-screen h-screen" />;
}
