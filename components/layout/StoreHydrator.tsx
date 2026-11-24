"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";

/**
 * Rehydrates the persisted store after first paint so the server-rendered
 * markup and the client's first render always match.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useProductStore.persist.rehydrate();
  }, []);

  return null;
}
