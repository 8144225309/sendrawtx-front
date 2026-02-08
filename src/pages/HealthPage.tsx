import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Server, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { getHealth } from '@/services/api';
import type { HealthResponse } from '@/types/api';

function HealthPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
            <p className="text-[#a0a0a0]">Monitor RawRelay service health</p>
          </div>
          <Button variant="secondary" onClick={fetchHealth} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card variant="bordered" className="mb-6 border-[#ef4444]">
            <CardContent className="flex items-center gap-3 text-[#ef4444]">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {health && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#f7931a]" />
                  Service Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {health.status === 'ok' ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-[#22c55e]" />
                      <div>
                        <p className="text-lg font-semibold text-white">Operational</p>
                        <p className="text-sm text-[#a0a0a0]">All systems running normally</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-[#ef4444]" />
                      <div>
                        <p className="text-lg font-semibold text-white">Issues Detected</p>
                        <p className="text-sm text-[#a0a0a0]">Some systems may be degraded</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Endpoints */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Available Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#666] mb-3">Local Nodes</p>
                    <div className="space-y-2">
                      {health.endpoints.local_nodes.map((node) => (
                        <div key={node} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                          <span className="text-white">{node}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#666] mb-3">External APIs</p>
                    <div className="space-y-2">
                      {health.endpoints.external_apis.map((api) => (
                        <div key={api} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                          <span className="text-white">{api}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cache Stats */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#f7931a]" />
                  Result Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#666] mb-1">Cached Results</p>
                    <p className="text-2xl font-bold text-white">{health.cache.entries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#666] mb-1">Oldest Entry</p>
                    <p className="text-sm text-white">
                      {health.cache.oldest
                        ? new Date(health.cache.oldest * 1000).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#666] mb-1">Newest Entry</p>
                    <p className="text-sm text-white">
                      {health.cache.newest
                        ? new Date(health.cache.newest * 1000).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Node Policies */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Node Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#252525]">
                        <th className="text-left py-2 text-[#666] font-medium">Node</th>
                        <th className="text-left py-2 text-[#666] font-medium">Policy</th>
                        <th className="text-left py-2 text-[#666] font-medium">Sub-1sat</th>
                        <th className="text-left py-2 text-[#666] font-medium">Full RBF</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#252525]">
                        <td className="py-2 text-white">Bitcoin Core</td>
                        <td className="py-2"><Badge variant="info">Standard</Badge></td>
                        <td className="py-2"><XCircle className="w-4 h-4 text-[#ef4444]" /></td>
                        <td className="py-2"><CheckCircle className="w-4 h-4 text-[#22c55e]" /></td>
                      </tr>
                      <tr className="border-b border-[#252525]">
                        <td className="py-2 text-white">Bitcoin Knots</td>
                        <td className="py-2"><Badge variant="warning">Strict</Badge></td>
                        <td className="py-2"><XCircle className="w-4 h-4 text-[#ef4444]" /></td>
                        <td className="py-2"><CheckCircle className="w-4 h-4 text-[#22c55e]" /></td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white">Libre Relay</td>
                        <td className="py-2"><Badge variant="success">Permissive</Badge></td>
                        <td className="py-2"><CheckCircle className="w-4 h-4 text-[#22c55e]" /></td>
                        <td className="py-2"><CheckCircle className="w-4 h-4 text-[#22c55e]" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export { HealthPage };
