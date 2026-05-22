"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/websocket-client";
import type { WSEventMap } from "@/types/websocket-events";

type WSEvent = keyof WSEventMap;

export function useWebSocket<E extends WSEvent>(
  event: E,
  handler: (payload: WSEventMap[E]) => void,
  technicianId?: string
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket(technicianId);
    const listener = (payload: WSEventMap[E]) => handlerRef.current(payload);
    socket.on(event as string, listener as (...args: unknown[]) => void);
    return () => {
      socket.off(event as string, listener as (...args: unknown[]) => void);
    };
  }, [event, technicianId]);
}
