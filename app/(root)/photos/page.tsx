"use client";

import { useEffect } from "react";

export default function Photos() {
  useEffect(() => {
    window.open("http://localhost:5500/frontend", "_blank");
  }, []);

  return null;
}
