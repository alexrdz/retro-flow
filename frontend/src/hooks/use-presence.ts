import { useEffect, useState } from "react";
import { getUsername } from "../utils/user";
import { socketService } from "../services/socket-service";

export default function usePresence(sessionId: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
const [readyUsers, setReadyUsers] = useState<string[]>([]);
const [isReady, setIsReady] = useState(false);
const username = getUsername() || 'anonymous';

useEffect(() => {
  // listen for initial presence state
  socketService.onPresenceUpdate((data) => {
    setOnlineUsers(data.onlineUsers);
    setReadyUsers(data.readyUsers);
  });

  // listen for ready status changes
  socketService.onReadyStatusChanged((data) => {
    setReadyUsers(data.readyUsers);
  });

  // cleanup listeners
  return () => {
    socketService.offPresenceUpdate();
    socketService.offReadyStatusChanged();
  };
}, []);

  // toggle ready status
  function toggleReady() {
    const newStatus = !isReady;
    setIsReady(newStatus);
    socketService.markReady(sessionId, username, newStatus);
  }

  return {
    onlineUsers,
    readyUsers,
    isReady,
    toggleReady
  }
}
