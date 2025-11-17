import { API_BASE_URL, getErrorMessage } from "./api";

export async function createSession(username: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to create session: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSession(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to get session: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function joinSession(sessionId: string, username: string | null) {
  try {
    const bodyData: { id: string; username?: string } = {
      id: sessionId,
    }

    if (username) {
      bodyData.username = username;
    }
    const bodyString = JSON.stringify(bodyData);
    console.log(bodyString)

    const response = await fetch(`${API_BASE_URL}/sessions/join/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyString,
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to join session: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
