'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface Flux {
  id: number;
  tipus: 'OFERTA' | 'DEMANDA';
  descripcio: string;
  categoria?: string;
  username?: string;
  created_at?: string;
}

interface Memory {
  id: number;
  user_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  username?: string;
}

type ViewType = 'ofertes' | 'demandes' | 'memories';

export default function Home() {
  const [fluxos, setFluxos] = useState<Flux[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<ViewType>('memories');

  useEffect(() => {
    async function fetchData() {
      if (!supabaseUrl || !supabaseKey) {
        setError('Falten les variables de Supabase');
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Carrega fluxos
        const { data: fluxosData, error: fluxosError } = await supabase
          .from('fluxos')
          .select('*')
          .order('id', { ascending: false });

        if (fluxosError) {
          console.error('Error carregant fluxos:', fluxosError);
          setError(`Error fluxos: ${fluxosError.message}`);
        } else {
          setFluxos(fluxosData || []);
        }

        // Carrega memories (ordenades per created_at descendent)
        const { data: memoriesData, error: memoriesError } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false });

        if (memoriesError) {
          console.error('Error carregant memories:', memoriesError);
        } else {
          setMemories(memoriesData || []);
        }
      } catch (err) {
        console.error('Error general:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Desconegut'}`);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Filtrar fluxos de forma robusta (case-insensitive i trim)
  const ofertes = fluxos.filter((f) => {
    const tipus = String(f.tipus || '').trim().toUpperCase();
    return tipus === 'OFERTA';
  });
  
  const demandes = fluxos.filter((f) => {
    const tipus = String(f.tipus || '').trim().toUpperCase();
    return tipus === 'DEMANDA';
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ca-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // Renderitzar vista activa
  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-neutral-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 mx-auto mb-4"></div>
            <p className="text-sm">Carregant...</p>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'ofertes':
        return (
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-100 mb-2">Ofertes (Donar)</h1>
                <p className="text-sm text-neutral-500">{ofertes.length} ofertes disponibles</p>
              </div>
              {ofertes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-neutral-500 text-lg">Cap oferta disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ofertes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-neutral-800/50 border border-amber-900/20 rounded-lg p-5 hover:border-amber-700/40 hover:bg-neutral-800/70 transition-all duration-200"
                    >
                      <div className="mb-3">
                        {flux.categoria && (
                          <span className="inline-block text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-400 mb-2">
                            {flux.categoria}
                          </span>
                        )}
                        <p className="text-neutral-200 leading-relaxed text-sm">
                          {flux.descripcio}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
                        {flux.username && (
                          <span className="text-xs text-neutral-500">@{flux.username}</span>
                        )}
                        {flux.created_at && (
                          <span className="text-xs text-neutral-600">{formatDate(flux.created_at)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'demandes':
        return (
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-100 mb-2">Demandes (Rebre)</h1>
                <p className="text-sm text-neutral-500">{demandes.length} demandes disponibles</p>
              </div>
              {demandes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-neutral-500 text-lg">Cap demanda disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demandes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-neutral-800/50 border border-slate-700/20 rounded-lg p-5 hover:border-slate-600/40 hover:bg-neutral-800/70 transition-all duration-200"
                    >
                      <div className="mb-3">
                        {flux.categoria && (
                          <span className="inline-block text-xs px-2 py-1 rounded bg-slate-500/10 text-slate-400 mb-2">
                            {flux.categoria}
                          </span>
                        )}
                        <p className="text-neutral-200 leading-relaxed text-sm">
                          {flux.descripcio}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
                        {flux.username && (
                          <span className="text-xs text-neutral-500">@{flux.username}</span>
                        )}
                        {flux.created_at && (
                          <span className="text-xs text-neutral-600">{formatDate(flux.created_at)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'memories':
        return (
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-100 mb-2">Memòria Viva (Xat)</h1>
                <p className="text-sm text-neutral-500">{memories.length} missatges</p>
              </div>
              {memories.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-neutral-500 text-lg">Cap memòria disponible</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {memories.map((memory) => (
                    <div
                      key={memory.id}
                      className={`flex ${memory.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          memory.role === 'user'
                            ? 'bg-emerald-600/20 border border-emerald-700/30 text-neutral-100'
                            : 'bg-indigo-950/40 border border-indigo-800/30 text-indigo-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-medium ${
                              memory.role === 'user' ? 'text-emerald-400' : 'text-indigo-400'
                            }`}
                          >
                            {memory.role === 'user' ? 'Usuari' : 'Nexia'}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {formatDate(memory.created_at)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {memory.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-neutral-900 text-white overflow-hidden" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      {/* Barra Lateral Esquerra */}
      <aside className="w-[260px] bg-neutral-950 border-r border-neutral-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚜️</span>
            <h1 className="text-lg font-semibold text-neutral-100">CODEX VIVUS</h1>
          </div>
        </div>

        {/* Menú de Navegació */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('ofertes')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'ofertes'
                ? 'bg-amber-500/10 border border-amber-700/30 text-amber-400'
                : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🦁</span>
              <div>
                <div className="font-medium">Ofertes</div>
                <div className="text-xs opacity-70">Donar</div>
              </div>
            </div>
            {activeView === 'ofertes' && (
              <div className="mt-2 text-xs text-amber-500/70">{ofertes.length} disponibles</div>
            )}
          </button>

          <button
            onClick={() => setActiveView('demandes')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'demandes'
                ? 'bg-slate-500/10 border border-slate-700/30 text-slate-400'
                : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🦅</span>
              <div>
                <div className="font-medium">Demandes</div>
                <div className="text-xs opacity-70">Rebre</div>
              </div>
            </div>
            {activeView === 'demandes' && (
              <div className="mt-2 text-xs text-slate-500/70">{demandes.length} disponibles</div>
            )}
          </button>

          <button
            onClick={() => setActiveView('memories')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'memories'
                ? 'bg-indigo-500/10 border border-indigo-700/30 text-indigo-400'
                : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧠</span>
              <div>
                <div className="font-medium">Memòria Viva</div>
                <div className="text-xs opacity-70">Xat</div>
              </div>
            </div>
            {activeView === 'memories' && (
              <div className="mt-2 text-xs text-indigo-500/70">{memories.length} missatges</div>
            )}
          </button>
        </nav>

        {/* Footer Lateral */}
        <div className="p-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-600 text-center">
            El Regne del Cor del U
          </p>
        </div>
      </aside>

      {/* Zona de Contingut Principal */}
      <main className="flex-1 bg-neutral-900 overflow-hidden flex flex-col">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-950/30 border-b border-red-900/30 px-6 py-3">
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        {/* Contingut de la Vista */}
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
