import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Clock, CheckCircle, Eye, Radio } from 'lucide-react';
import { Button, Card, CardContent, Textarea } from '@/components/ui';
import { broadcastTransaction } from '@/services/api';
import { TransactionPreview } from '@/components/TransactionPreview';
import { isPSBT } from '@/lib/txDecoder';

type BroadcastMode = 'preview' | 'broadcast';

function HomePage() {
  const navigate = useNavigate();
  const [rawtx, setRawtx] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<BroadcastMode>('broadcast');
  const [isValid, setIsValid] = useState(false);
  const [canBroadcast, setCanBroadcast] = useState(false);

  const handleValidChange = useCallback((valid: boolean, broadcastable: boolean) => {
    setIsValid(valid);
    setCanBroadcast(broadcastable);
  }, []);

  const handleBroadcast = async () => {
    if (!rawtx.trim()) {
      setError('Please enter a raw transaction');
      return;
    }

    // Check if it's a PSBT
    if (isPSBT(rawtx.trim())) {
      setError('Cannot broadcast PSBT directly. Please finalize it first.');
      return;
    }

    // Basic hex validation
    if (!/^[0-9a-fA-F]+$/.test(rawtx.trim())) {
      setError('Invalid hex - transaction must be hexadecimal');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await broadcastTransaction(rawtx.trim());
      if (result.txid) {
        navigate(`/tx/${result.txid}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Broadcast failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Non-Standard TX Support',
      description: 'Broadcast transactions that other services reject',
    },
    {
      icon: Zap,
      title: 'Multi-Endpoint Routing',
      description: 'Core, Knots, Libre Relay + external APIs',
    },
    {
      icon: Clock,
      title: 'Instant Analysis',
      description: 'See difficulty rating and policy bypass report',
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Broadcast Raw Transactions
          </h1>
          <p className="text-lg sm:text-xl text-[#a0a0a0] mb-8 max-w-2xl mx-auto">
            The non-standard TX specialist. Route transactions through permissive nodes when standard services reject them.
          </p>

          {/* Broadcast Form */}
          <Card variant="bordered" className="max-w-2xl mx-auto text-left">
            <CardContent>
              {/* Mode Toggle */}
              <div className="flex items-center justify-center gap-2 mb-4 p-1 bg-[#1a1a1a] rounded-lg">
                <button
                  onClick={() => setMode('preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'preview'
                      ? 'bg-[#252525] text-white'
                      : 'text-[#666] hover:text-[#a0a0a0]'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview Only
                </button>
                <button
                  onClick={() => setMode('broadcast')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'broadcast'
                      ? 'bg-[#f7931a] text-[#0f0f0f]'
                      : 'text-[#666] hover:text-[#a0a0a0]'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  Broadcast
                </button>
              </div>

              <Textarea
                placeholder="Paste raw transaction hex or PSBT (hex or base64)..."
                value={rawtx}
                onChange={(e) => {
                  setRawtx(e.target.value);
                  setError(null);
                }}
                error={error || undefined}
                rows={6}
                className="mb-4"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666]">
                  {rawtx.length > 0 && (
                    <>
                      {isPSBT(rawtx.trim()) ? 'PSBT' : `${Math.floor(rawtx.trim().length / 2)} bytes`}
                      {isValid && <span className="text-[#22c55e] ml-2">Valid</span>}
                    </>
                  )}
                </span>
                {mode === 'broadcast' ? (
                  <Button
                    onClick={handleBroadcast}
                    loading={loading}
                    disabled={!rawtx.trim() || !canBroadcast}
                    size="lg"
                  >
                    <span>Broadcast</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <span className="text-sm text-[#666] italic">
                    Preview mode - decoding only
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Preview */}
          {rawtx.trim() && (
            <div className="max-w-2xl mx-auto mt-6">
              <TransactionPreview
                rawTx={rawtx}
                onValidChange={handleValidChange}
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="text-center">
                <CardContent>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#f7931a20] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#f7931a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-[#a0a0a0]">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              'Paste your raw transaction hex',
              'We classify difficulty and identify non-standard features',
              'Route to endpoints that accept your TX type',
              'Get detailed report on acceptance and policy bypass',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#f7931a] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#0f0f0f]">{i + 1}</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[#a0a0a0]">{step}</p>
                </div>
                {i < 3 && (
                  <CheckCircle className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export { HomePage };
