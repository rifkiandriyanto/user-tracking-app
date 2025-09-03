// components/SearchResultList.tsx
import { memo } from 'react';
import UserListItem from './UserListItem';
import type { User } from '@/lib/simulation';

type SearchResultListProps = {
  users: User[];
  onUserClick: (userId: string) => void;
  activeUserId: string | null;
  query: string;
};

function SearchResultList({ users, onUserClick, activeUserId, query }: SearchResultListProps) {
  const hasResults = users.length > 0;
  const showNotFoundMessage = !hasResults && query && !activeUserId;

  return (
    <div className="flex-grow overflow-y-auto">
      {hasResults ? (
        <ul className="p-2 space-y-1">
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isBeingFollowed={activeUserId === user.id}
              onClick={() => onUserClick(user.id)}
            />
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          {showNotFoundMessage && <p>No users found for "{query}".</p>}
        </div>
      )}
    </div>
  );
}

export default memo(SearchResultList);
