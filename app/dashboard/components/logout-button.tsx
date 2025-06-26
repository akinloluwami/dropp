"use client";

import { Button } from "@/components/button";
import React from "react";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout");
      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
