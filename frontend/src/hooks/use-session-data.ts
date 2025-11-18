import { useEffect } from "react";
import { getSession } from "../services/session-service";
import type { SessionData } from "../types";
import { getUsername } from "../utils/user";

interface SessionDataHookProps {
  sessionId: string,
  setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUsername: React.Dispatch<React.SetStateAction<string | null>>
}

export default function useSessionData({ sessionId, setSessionData, setError, setLoading, setUsername }: SessionDataHookProps) {
  useEffect(() => {
    async function fetchSession() {
      try {
        setLoading(true)
        const data = await getSession(sessionId)
        setSessionData(data)
        setError(null)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId]);

  useEffect(() => {
    const username = getUsername();
    if (username) {
      setUsername(username);
    }
  }, []);

}
