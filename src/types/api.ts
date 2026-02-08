// API Response Types - must match backend/app.py and backend/classify.py

export interface BroadcastResult {
  success: boolean;
  txid?: string;
  error?: string;
  time_ms?: number;
}

export interface TxSize {
  total_bytes: number;
  vbytes: number;
  is_segwit: boolean;
}

export interface OpReturn {
  count: number;
  sizes: number[];
  total_bytes: number;
  max_size: number;
}

export type DifficultyClass =
  | 'trivial'
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'extreme'
  | 'near_impossible';

export interface Classification {
  txid: string;
  size: TxSize;
  fee_rate_sat_vb: number | null;
  is_standard: boolean;
  difficulty_class: DifficultyClass;
  difficulty_score: number;
  non_standard_features: string[];
  op_return: OpReturn;
}

export interface ServicePrediction {
  would_accept: boolean;
  reason: string;
}

export interface Comparison {
  standard_services: Record<string, ServicePrediction>;
  rawrelay_routing: {
    accepted_by: string[];
    rejected_by: string[];
    path_found: boolean;
  };
  bypass_required: string[];
  advantage: string;
}

export interface BroadcastMeta {
  processed_at: string;
  processing_time_ms: number;
  endpoints_attempted: number;
  endpoints_accepted: number;
}

export interface BroadcastResponse {
  success: boolean;
  txid: string;
  broadcast_results: Record<string, BroadcastResult>;
  classification: Classification;
  comparison: Comparison;
  meta: BroadcastMeta;
}

export interface ClassifyResponse {
  classification: Classification;
  predictions: Record<string, ServicePrediction>;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  cache: {
    entries: number;
    oldest: number | null;
    newest: number | null;
  };
  endpoints: {
    local_nodes: string[];
    external_apis: string[];
  };
}

export type PoolOption =
  | 'all'
  | 'local'
  | 'external'
  | 'sub1sat'
  | 'permissive'
  | 'default'
  | string;

export type DetailLevel = 'simple' | 'standard' | 'full';

// Pool display names
export const POOL_NAMES: Record<string, string> = {
  core: 'Bitcoin Core',
  knots: 'Bitcoin Knots',
  libre: 'Libre Relay',
  mempool_space: 'mempool.space',
  blockstream: 'Blockstream',
  blockcypher: 'BlockCypher',
};

// Difficulty class display
export const DIFFICULTY_LABELS: Record<DifficultyClass, string> = {
  trivial: 'Trivial',
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  extreme: 'Extreme',
  near_impossible: 'Near Impossible',
};

export const DIFFICULTY_COLORS: Record<DifficultyClass, string> = {
  trivial: '#22c55e',
  easy: '#84cc16',
  moderate: '#eab308',
  hard: '#f97316',
  extreme: '#ef4444',
  near_impossible: '#dc2626',
};
