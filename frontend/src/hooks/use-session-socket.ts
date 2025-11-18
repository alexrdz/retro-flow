import { useEffect } from "react";
import { socketService } from "../services/socket-service";
import { getUsername } from "../utils/user";
import type { SessionData } from "../types";

export default function useSessionSocket(sessionId: string, setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>) {
    useEffect(() => {
    socketService.connect();
    const username = getUsername();
    if (sessionId && username) {
      socketService.joinSession(sessionId, username);
    }

    return () => {
      if (sessionId) {
        socketService.leaveSession(sessionId);
      }
    };
  }, [sessionId]);


  useEffect(() => {
    // listen for cards created by others
    socketService.onCardCreated((card) => {
      setSessionData((prev) => prev ? {
        ...prev,
        cards: [...prev.cards, card]
      } : null);
    });

    // listen for cards updated by others
    socketService.onCardUpdated((card) => {
      setSessionData((prev) => prev ? {
        ...prev,
        cards: prev.cards.map((c) => c.id === card.id ? card : c)
      } : null);
    });

    // listen for cards deleted by others
    socketService.onCardDeleted(({ cardId }) => {
      setSessionData((prev) => prev ? {
        ...prev,
        cards: prev.cards.filter((c) => c.id !== cardId)
      } : null);
    });

    // cleanup listeners on unmount
    return () => {
      socketService.offCardCreated();
      socketService.offCardUpdated();
      socketService.offCardDeleted();
    };
  }, []);
}
