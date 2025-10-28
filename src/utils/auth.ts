// Authentication utility functions

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Add auth token to fetch requests
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If token is invalid or expired, clear it and redirect to login
  if (response.status === 401) {
    clearAuthToken();
    window.location.href = '/admin';
  }

  return response;
};
