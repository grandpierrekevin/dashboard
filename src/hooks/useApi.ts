import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

interface ApiError {
  message: string;
  status: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      message: response.statusText,
      status: response.status,
    };
    throw error;
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}

export function useApiQuery<T>(
  key: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: key,
    queryFn: () => fetchApi<T>(endpoint),
    ...options,
  });
}

export function useApiMutation<T, V>(
  endpoint: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn: (variables) =>
      fetchApi<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(variables),
      }),
    ...options,
  });
}

// Exemple d'utilisation :
/*
const { data, isLoading } = useApiQuery(['users'], '/users', {
  staleTime: 5 * 60 * 1000,
});

const mutation = useApiMutation('/users', {
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});
*/ 