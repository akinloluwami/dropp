"use client";

import { Button } from "@/components/button";
import React, { useState } from "react";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout");
      if (response.ok) {
        window.location.href = "/auth";
      } else {
        setLoading(false);
        console.error("Logout failed");
      }
    } catch (error) {
      setLoading(false);
      console.error("Logout error:", error);
    }
  };

  return (
    <Button onClick={handleLogout} loading={loading}>
      Logout
    </Button>
  );
};

export default LogoutButton;
