// components/SearchUser.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { usersAtom, followUserIdAtom } from "@/store/userStore";

import SearchHeader from "./SearchHeader";
import SearchResultList from "./SearchResultList";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const allUsers = useAtomValue(usersAtom);
  const [followedUserId, setFollowedUserId] = useAtom(followUserIdAtom);

  const followedUser = useMemo(
    () => allUsers.find((user) => user.id === followedUserId),
    [allUsers, followedUserId]
  );

  const filteredUsers = useMemo(() => {
    if (followedUserId || !query) {
      return allUsers;
    }
    const lowercasedQuery = query.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.id.toLowerCase().includes(lowercasedQuery)
    );
  }, [allUsers, query, followedUserId]);

  const handleUserClick = useCallback(
    (userId: string) => {
      setFollowedUserId((currentId) => {
        if (currentId === userId) return null;
        setQuery("");
        return userId;
      });
    },
    [setFollowedUserId]
  );

  const handleUnfollowClick = useCallback(() => {
    setFollowedUserId(null);
  }, [setFollowedUserId]);

  return (
    <div className="absolute top-4 left-4 z-10 w-80 h-[calc(100vh-2rem)] max-h-[700px] flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <SearchHeader
        isFollowing={!!followedUserId}
        followedUserName={followedUser?.name}
        query={query}
        onQueryChange={setQuery}
        onUnfollow={handleUnfollowClick}
      />

      <SearchResultList
        users={filteredUsers}
        onUserClick={handleUserClick}
        activeUserId={followedUserId}
        query={query}
      />

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
        <strong>Total users:</strong> {allUsers.length}
      </div>
    </div>
  );
}
