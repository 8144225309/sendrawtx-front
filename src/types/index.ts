// API Response Types matching backend/app.py

export type DifficultyClass = 'trivial' | 'easy' | 'moderate' | 'hard' | 'extreme' | 'near_impossible';

export type PoolName = 'core' | 'knots' | 'libre' | 'mempool_space' | 'blockstream' | 'blockcypher';

export interface SizeInfo {
  total_bytes: number;
  vbytes: number;
  is_segwit: boolean;
}

export interface OpReturnInfo {
  count: number;
  sizes: number[];
  total_bytes: number;
  max_size: number;
}

export interface Classification {
  txid: string;
  size: SizeInfo;
  fee_rate_sat_vb: number | null;
  is_standard: boolean;
  difficulty_class: DifficultyClass;
  difficulty_score: number;
  non_standard_features: string[];
  op_return: OpReturnInfo;
}

export interface Prediction {
  would_accept: boolean;
  reason: string;
}

export interface BroadcastResult {
  success: boolean;
  txid?: string;
  error?: string;
  time_ms: number;
}

export interface StandardService {
  would_accept: boolean;
  reason: string;
}

export interface RawRelayRouting {
  accepted_by: string[];
  rejected_by: string[];
  path_found: boolean;
}

export interface Comparison {
  standard_services: Record<string, StandardService>;
  rawrelay_routing: RawRelayRouting;
  bypass_required: string[];
  advantage: string;
}

export interface Meta {
  processed_at: string;
  processing_time_ms: number;
  endpoints_attempted: number;
  endpoints_accepted: number;
}

// Full response from POST /api/broadcast with detail=full
export interface BroadcastResponse {
  success: boolean;
  txid: string;
  broadcast_results: Record<string, BroadcastResult>;
  classification: Classification;
  comparison: Comparison;
  meta: Meta;
}

// Response from POST /classify
export interface ClassifyResponse {
  classification: Classification;
  predictions: Record<string, Prediction>;
}

// Response from GET /health
export interface HealthResponse {
  status: string;
  cache: {
    size: number;
    hits: number;
    misses: number;
  };
  endpoints: {
    local_nodes: string[];
    external_apis: string[];
  };
}

// Pool info matching backend/pools.py
export interface PoolInfo {
  id: PoolName;
  name: string;
  type: 'rpc' | 'api';
  sub1sat: boolean;
  full_rbf: boolean;
  policy: 'standard' | 'strict' | 'permissive';
  accepts_inscriptions: boolean;
  max_op_return: number | null;
}

// Frontend form types
export interface BroadcastFormData {
  rawtx: string;
  pools: string;
  detail: 'simple' | 'standard' | 'full';
}

// Theme
export type Theme = 'dark' | 'light';

// UI State
export interface TxState {
  isLoading: boolean;
  result: BroadcastResponse | null;
  error: string | null;
}
