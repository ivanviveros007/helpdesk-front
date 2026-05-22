import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(technicianId?: string): Socket {
  if (socket?.connected) return socket;

  const url = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

  socket = io(`${url}/tickets`, {
    query: technicianId ? { technicianId } : {},
    withCredentials: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ["websocket"],
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
