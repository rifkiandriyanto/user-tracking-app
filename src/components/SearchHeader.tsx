import { memo } from "react";

type SearchHeaderProps = {
  isFollowing: boolean;
  followedUserName?: string;
  query: string;
  onQueryChange: (value: string) => void;
  onUnfollow: () => void;
};

function SearchHeader({
  isFollowing,
  followedUserName,
  query,
  onQueryChange,
  onUnfollow,
}: SearchHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      {isFollowing && followedUserName ? (
        <button
          onClick={onUnfollow}
          className="w-full px-3 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-center"
        >
          Unfollow {followedUserName}
        </button>
      ) : (
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
        />
      )}
    </div>
  );
}

export default memo(SearchHeader);
