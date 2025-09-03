// components/UserListItem.tsx
'use client';

import Image from 'next/image';
import { memo } from 'react'; // <-- Impor memo
import { User } from '@/lib/simulation';

type UserListItemProps = {
  user: User;
  isBeingFollowed: boolean;
  onClick: () => void;
};

// Komponen dibungkus dengan memo. Ia hanya akan re-render jika props (user, isBeingFollowed, onClick) berubah.
function UserListItem({ user, isBeingFollowed, onClick }: UserListItemProps) {
  const truncatedId = user.id.substring(0, 8);

  return (
    <li
      onClick={onClick}
      className={`
        flex items-center p-3 transition-all duration-200 cursor-pointer border-l-4
        ${isBeingFollowed
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
          : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      <Image
        src={user.avatar}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-full flex-shrink-0"
      />
      <div className="ml-4 flex-grow overflow-hidden">
        <p className="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">
          {user.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ID: {truncatedId}...
        </p>
      </div>
      {isBeingFollowed && (
        <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" title="Following"></div>
      )}
    </li>
  );
}

export default memo(UserListItem);
