import React, { FC, useState, useRef, useEffect } from "react";
import axios from "axios";

const UserProfile: FC<{
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const req = axios.create({
    withCredentials: true,
  });

  const handleLogout = async () => {
    try {
      await req.post("/api/auth/logout");
      onLogout();
    } catch (error) {}
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="p-1 rounded-full bg-white/50">
        <img
          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.name}`}
          alt="avatar"
          className="rounded-full size-10"
        />
      </button>
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 mt-2 w-[300px] p-5 bg-black shadow-lg rounded-lg"
        >
          <p className="font-bold">{user?.name}</p>
          <p className="text-gray-600">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 mt-3 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
