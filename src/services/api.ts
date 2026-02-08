import type {
  BroadcastResponse,
  ClassifyResponse,
  HealthResponse,
  PoolOption,
  DetailLevel,
} from '@/types/api';

const API_BASE = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(response.status, error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function broadcastTransaction(
  rawtx: string,
  pools: PoolOption = 'default',
  detail: DetailLevel = 'full'
): Promise<BroadcastResponse> {
  return request<BroadcastResponse>('/api/broadcast', {
    method: 'POST',
    body: JSON.stringify({ rawtx, pools, detail }),
  });
}

export async function classifyTransaction(rawtx: string): Promise<ClassifyResponse> {
  return request<ClassifyResponse>('/classify', {
    method: 'POST',
    body: JSON.stringify({ rawtx }),
  });
}

export async function lookupTransaction(txid: string): Promise<BroadcastResponse> {
  return request<BroadcastResponse>(`/tx/${txid}`);
}

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health');
}

export { ApiError };
