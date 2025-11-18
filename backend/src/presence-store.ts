const onlineUsers = new Map<string, Set<string>>(); // sessionId -> Set<username>
const readyUsers = new Map<string, Set<string>>();  // sessionId -> Set<username>
const socketToUser = new Map<string, { username: string, sessionId: string }>(); // socketId -> user info

export function addUserToSession(sessionId: string, username: string, socketId: string) {
  if (!onlineUsers.has(sessionId)) {
    onlineUsers.set(sessionId, new Set());
  }
  onlineUsers.get(sessionId)!.add(username);
  socketToUser.set(socketId, { username, sessionId });
}

export function removeUserFromSession(socketId: string) {
  const userInfo = socketToUser.get(socketId);
  if (!userInfo) return null;

  const { username, sessionId } = userInfo;

  // remove from online users
  onlineUsers.get(sessionId)?.delete(username);

  // remove from ready users
  readyUsers.get(sessionId)?.delete(username);

  // clean up empty sets
  if (onlineUsers.get(sessionId)?.size === 0) {
    onlineUsers.delete(sessionId);
  }
  if (readyUsers.get(sessionId)?.size === 0) {
    readyUsers.delete(sessionId);
  }

  socketToUser.delete(socketId);

  return { username, sessionId };
}

export function getOnlineUsers(sessionId: string): string[] {
  return Array.from(onlineUsers.get(sessionId) || []);
}

export function getReadyUsers(sessionId: string): string[] {
  return Array.from(readyUsers.get(sessionId) || []);
}

export function setUserReady(sessionId: string, username: string, isReady: boolean) {
  if (!readyUsers.has(sessionId)) {
    readyUsers.set(sessionId, new Set());
  }

  const ready = readyUsers.get(sessionId)!;
  if (isReady) {
    ready.add(username);
  } else {
    ready.delete(username);
  }
}

export function getPresenceState(sessionId: string) {
  return {
    onlineUsers: getOnlineUsers(sessionId),
    readyUsers: getReadyUsers(sessionId)
  };
}
