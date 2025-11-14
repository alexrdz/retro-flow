// check if we are in development environment
export const API_BASE_URL: string = import.meta.env.DEV ? "http://localhost:3001/api" : import.meta.env.VITE_API_BASE_URL!;


  // handle different response types
export const getErrorMessage = async (response: Response) => {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const data = await response.json().catch(() => ({}));
    return data.error || data.message || 'Unknown error';
  }

  // HTML error page, plain text, etc.
  const text = await response.text().catch(() => '');
  return text || `HTTP ${response.status}`;
};
