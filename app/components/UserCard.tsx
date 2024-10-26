import React from 'react';

interface UserCardProps {
  user: { _id: string; name: string };
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  
  return (
    <div className="card bg-base-100 shadow-xl p-4 mb-4 cursor-pointer" onClick={onClick}>
      <h2 className="card-title">{user.name}</h2>
    </div>
  );
};

export default UserCard;
