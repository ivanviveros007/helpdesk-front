import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

interface SocketOptions {
  technicianId?: string;
  userId?: string;
}

export function getSocket(options: SocketOptions = {}): Socket {
  if (socket?.connected) return socket;

  const url = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";
  const query: Record<string, string> = {};
  if (options.technicianId) query.technicianId = options.technicianId;
  if (options.userId) query.userId = options.userId;

  socket = io(`${url}/tickets`, {
    query,
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
