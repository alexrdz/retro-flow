import { API_BASE_URL, getErrorMessage } from "./api";

export async function createSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
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
