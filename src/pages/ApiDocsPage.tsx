import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Code, Terminal, Zap } from 'lucide-react';

function ApiDocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/{rawtx}',
      description: 'Broadcast transaction via URL path',
      params: ['pools', 'detail'],
    },
    {
      method: 'POST',
      path: '/api/broadcast',
      description: 'Broadcast transaction via POST body',
      body: '{ "rawtx": "...", "pools": "all", "detail": "full" }',
    },
    {
      method: 'GET',
      path: '/tx/{txid}',
      description: 'Lookup cached broadcast result',
      params: [],
    },
    {
      method: 'POST',
      path: '/classify',
      description: 'Classify transaction without broadcasting',
      body: '{ "rawtx": "..." }',
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Health check and system status',
      params: [],
    },
  ];

  const poolOptions = [
    { value: 'all', description: 'All endpoints (local nodes + external APIs)' },
    { value: 'local', description: 'Local nodes only (Core, Knots, Libre)' },
    { value: 'external', description: 'External APIs only (mempool.space, blockstream)' },
    { value: 'sub1sat', description: 'Endpoints accepting sub-1sat fee rates' },
    { value: 'permissive', description: 'Most permissive policy endpoints' },
  ];

  return (
    <div className="flex-1 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
          <p className="text-[#a0a0a0]">
            REST API for broadcasting raw Bitcoin transactions
          </p>
        </div>

        {/* Quick Start */}
        <Card variant="bordered" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#f7931a]" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#a0a0a0] mb-4">
              Broadcast a transaction with a single curl command:
            </p>
            <div className="bg-[#0f0f0f] rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code className="text-[#22c55e]">curl</code>
              <code className="text-white"> -X POST </code>
              <code className="text-[#f7931a]">https://sendrawtx.com/api/broadcast</code>
              <code className="text-white"> \</code>
              <br />
              <code className="text-white">  -H </code>
              <code className="text-[#eab308]">"Content-Type: application/json"</code>
              <code className="text-white"> \</code>
              <br />
              <code className="text-white">  -d </code>
              <code className="text-[#eab308]">'{`{"rawtx": "0100..."}`}'</code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold text-white">Endpoints</h2>

          {endpoints.map((endpoint) => (
            <Card key={endpoint.path} variant="bordered">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge
                    variant={endpoint.method === 'GET' ? 'info' : 'success'}
                    size="sm"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-white font-mono">{endpoint.path}</code>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#a0a0a0] mb-4">{endpoint.description}</p>

                {endpoint.params && endpoint.params.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-[#666] mb-2">Query Parameters:</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param) => (
                        <Badge key={param} variant="default">
                          ?{param}=...
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {endpoint.body && (
                  <div>
                    <p className="text-sm text-[#666] mb-2">Request Body:</p>
                    <div className="bg-[#0f0f0f] rounded-lg p-3 font-mono text-sm">
                      <code className="text-[#a0a0a0]">{endpoint.body}</code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pool Options */}
        <Card variant="bordered" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#f7931a]" />
              Pool Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#a0a0a0] mb-4">
              Use the <code className="text-[#f7931a]">pools</code> parameter to control routing:
            </p>
            <div className="space-y-3">
              {poolOptions.map((opt) => (
                <div key={opt.value} className="flex items-start gap-3">
                  <Badge variant="default" className="mt-0.5">
                    {opt.value}
                  </Badge>
                  <span className="text-[#a0a0a0]">{opt.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Example */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#f7931a]" />
              Response Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#0f0f0f] rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-[#a0a0a0]">
{`{
  "success": true,
  "txid": "abc123...",
  "broadcast_results": {
    "core": {"success": true, "time_ms": 45},
    "libre": {"success": true, "time_ms": 52}
  },
  "classification": {
    "difficulty_class": "moderate",
    "is_standard": false,
    "non_standard_features": ["sub_1sat_fee"]
  },
  "comparison": {
    "advantage": "Standard APIs would reject...",
    "bypass_required": ["1sat_minimum_fee"]
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { ApiDocsPage };
