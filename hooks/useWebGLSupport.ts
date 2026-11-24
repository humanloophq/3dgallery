"use client";

import { useEffect, useState } from "react";

export type WebGLSupport = "checking" | "supported" | "unsupported";

export function useWebGLSupport(): WebGLSupport {
  const [support, setSupport] = useState<WebGLSupport>("checking");

  useEffect(() => {
    let cancelled = false;

    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!cancelled) setSupport(context ? "supported" : "unsupported");
    } catch {
      if (!cancelled) setSupport("unsupported");
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return support;
}
