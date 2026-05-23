"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/websocket-client";
import type { WSEventMap } from "@/types/websocket-events";

type WSEvent = keyof WSEventMap;

interface WebSocketOptions {
  technicianId?: string;
  userId?: string;
}

export function useWebSocket<E extends WSEvent>(
  event: E,
  handler: (payload: WSEventMap[E]) => void,
  options: WebSocketOptions | string | undefined = {}
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  // Support legacy string param (technicianId) for backward compatibility
  const opts: WebSocketOptions =
    typeof options === "string" ? { technicianId: options } : (options ?? {});

  useEffect(() => {
    const socket = getSocket(opts);
    const listener = (payload: WSEventMap[E]) => handlerRef.current(payload);
    socket.on(event as string, listener as (...args: unknown[]) => void);
    return () => {
      socket.off(event as string, listener as (...args: unknown[]) => void);
    };
  }, [event, opts.technicianId, opts.userId]);
}
