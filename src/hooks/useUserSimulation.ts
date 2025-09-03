import { useEffect, useRef } from "react";
import { generateUsers, updateUserPosition, User } from "@/lib/simulation";

type SnapshotMessage = { type: "snapshot"; users: User[] };
type UpdateMessage = { type: "update"; users: User[] };
type SimulationMessage = SnapshotMessage | UpdateMessage;

type SimulationOptions = {
  userCount?: number;
  snapshotDelay?: number;
  updateInterval?: number;
};


export function useUserSimulation(
  onMessage: (data: SimulationMessage) => void,
  options: SimulationOptions = {}
) {
  const {
    userCount = 100,
    snapshotDelay = 100,
    updateInterval = 1000,
  } = options;

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    let users = generateUsers(userCount);

    const snapshotTimeout = setTimeout(() => {
      onMessageRef.current({ type: "snapshot", users });
    }, snapshotDelay);

    const interval = setInterval(() => {
      users = users.map(updateUserPosition);
      onMessageRef.current({ type: "update", users });
    }, updateInterval);

    return () => {
      clearTimeout(snapshotTimeout);
      clearInterval(interval);
    };
  }, [userCount, snapshotDelay, updateInterval]);
}
