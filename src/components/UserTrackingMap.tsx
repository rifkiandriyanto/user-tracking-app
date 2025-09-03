"use client";
import { useEffect, useRef, useCallback } from "react";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useUserSimulation } from "@/hooks/useUserSimulation";
import type { User } from "@/lib/simulation";
import type { FeatureCollection } from "geojson";

import { useAtom, useSetAtom, useAtomValue } from "jotai";
import {
  usersAtom,
  followUserIdAtom,
  userToFollowAtom,
} from "@/store/userStore";

export default function UserTrackingMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const USER_SOURCE_ID = "user-source";
  const USER_LAYER_ID = "user-layer";

  const users = useAtomValue(usersAtom);
  const setUsers = useSetAtom(usersAtom);
  const [followUserId, setFollowUserId] = useAtom(followUserIdAtom);
  const userToFollow = useAtomValue(userToFollowAtom);

  const usersRef = useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  const followUserIdRef = useRef(followUserId);
  useEffect(() => {
    followUserIdRef.current = followUserId;
  }, [followUserId]);

  const createGeoJSON = (users: User[]): FeatureCollection => ({
    type: "FeatureCollection",
    features: users.map((user) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [user.longitude, user.latitude],
      },
      properties: {
        id: user.id,
        name: user.name,
      },
    })),
  });

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.8456, -6.2088],
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      map.addSource(USER_SOURCE_ID, {
        type: "geojson",
        data: createGeoJSON([]),
      });
      map.addLayer({
        id: USER_LAYER_ID,
        type: "circle",
        source: USER_SOURCE_ID,
        paint: {
          "circle-radius": 6,
          "circle-color": "#00bcd4",
          "circle-stroke-width": 2,
          "circle-stroke-color": "white",
        },
      });

      map.on("click", USER_LAYER_ID, (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const coordinates = (feature.geometry as any).coordinates.slice();
          const user = usersRef.current.find(
            (u) => u.id === feature.properties?.id
          );

          if (!user) return;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const isCurrentlyFollowing = followUserIdRef.current === user.id;

          popupRef.current
            ?.setLngLat(coordinates as [number, number])
            .setHTML(renderPopup(user, isCurrentlyFollowing))
            .addTo(map);
        }
      });

      map.on("mouseenter", USER_LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", USER_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;
    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      anchor: "bottom",
      offset: [0, -15],
    }).on("close", () => {
      setFollowUserId(null);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [setFollowUserId]); // setFollowUserId dijamin stabil oleh Jotai

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource(USER_SOURCE_ID) as GeoJSONSource | undefined;
    if (source) {
      source.setData(createGeoJSON(users));
    }
  }, [users]);

  const renderPopup = useCallback((user: User, isFollowing = false) => {
    const baseButtonClasses =
      "w-full mt-2 py-1.5 px-2.5 rounded text-white cursor-pointer transition-colors";
    const followButton = `<button onclick="window.followUser('${user.id}')" class="${baseButtonClasses} bg-blue-500 hover:bg-blue-600">Follow</button>`;
    const unfollowButton = `<button onclick="window.unfollowUser()" class="${baseButtonClasses} bg-red-500 hover:bg-red-600">Unfollow</button>`;

    return `
        <div class="font-sans min-w-[180px] text-black">
            <h3 class="m-0 mb-1 text-base font-bold">${user.name}</h3>
            <p class="m-0 text-xs text-gray-600">ID: ${user.id}</p>
            <p class="m-0 text-xs text-gray-600">Lat: ${user.latitude.toFixed(
              5
            )}</p>
            <p class="m-0 text-xs text-gray-600">Lng: ${user.longitude.toFixed(
              5
            )}</p>
            ${isFollowing ? unfollowButton : followButton}
        </div>
    `;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userToFollow) {
      if (!userToFollow && !followUserId) {
        popupRef.current?.remove();
      }
      return;
    }

    const lngLat: [number, number] = [
      userToFollow.longitude,
      userToFollow.latitude,
    ];
    map.easeTo({ center: lngLat, duration: 1000 });

    popupRef.current
      ?.setLngLat(lngLat)
      .setHTML(renderPopup(userToFollow, true))
      .addTo(map);
  }, [userToFollow, renderPopup, followUserId]);

  useEffect(() => {
    // Cukup set ID pengguna yang akan diikuti.
    (window as any).followUser = (userId: string) => setFollowUserId(userId);
    // Cukup set ID menjadi null untuk berhenti mengikuti.
    (window as any).unfollowUser = () => setFollowUserId(null);

    return () => {
      delete (window as any).followUser;
      delete (window as any).unfollowUser;
    };
  }, [setFollowUserId]);

  const handleMessage = useCallback(
    (payload: any) => {
      if (payload.type === "snapshot" || payload.type === "update") {
        setUsers(payload.users);
      }
    },
    [setUsers]
  );

  useUserSimulation(handleMessage);

  return <div id="map" className="w-screen h-screen" />;
}
