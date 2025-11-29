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
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300 mx-auto mb-4"></div>
            <p className="text-sm font-light">Carregant...</p>
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
                <h1 className="text-2xl font-normal text-slate-800 mb-2">Ofertes (Donar)</h1>
                <p className="text-sm text-slate-500 font-light">{ofertes.length} ofertes disponibles</p>
              </div>
              {ofertes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg font-light">Cap oferta disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ofertes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
                    >
                      <div className="mb-3">
                        {flux.categoria && (
                          <span className="inline-block text-xs px-2 py-1 rounded bg-amber-50 text-amber-600 mb-2 font-normal">
                            {flux.categoria}
                          </span>
                        )}
                        <p className="text-slate-800 leading-relaxed text-sm font-light">
                          {flux.descripcio}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {flux.username && (
                          <span className="text-xs text-slate-500 font-light">@{flux.username}</span>
                        )}
                        {flux.created_at && (
                          <span className="text-xs text-slate-400 font-light">{formatDate(flux.created_at)}</span>
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
                <h1 className="text-2xl font-normal text-slate-800 mb-2">Demandes (Rebre)</h1>
                <p className="text-sm text-slate-500 font-light">{demandes.length} demandes disponibles</p>
              </div>
              {demandes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg font-light">Cap demanda disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demandes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="mb-3">
                        {flux.categoria && (
                          <span className="inline-block text-xs px-2 py-1 rounded bg-slate-50 text-slate-600 mb-2 font-normal">
                            {flux.categoria}
                          </span>
                        )}
                        <p className="text-slate-800 leading-relaxed text-sm font-light">
                          {flux.descripcio}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {flux.username && (
                          <span className="text-xs text-slate-500 font-light">@{flux.username}</span>
                        )}
                        {flux.created_at && (
                          <span className="text-xs text-slate-400 font-light">{formatDate(flux.created_at)}</span>
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
          <div className="h-full overflow-y-auto bg-white">
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-normal text-slate-800 mb-2">Memòria Viva (Xat)</h1>
                <p className="text-sm text-slate-500 font-light">{memories.length} missatges</p>
              </div>
              {memories.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg font-light">Cap memòria disponible</p>
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
                            ? 'bg-emerald-50 border border-emerald-100 text-slate-800'
                            : 'bg-white border border-purple-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-medium ${
                              memory.role === 'user' ? 'text-emerald-600' : 'text-purple-600'
                            }`}
                          >
                            {memory.role === 'user' ? 'Usuari' : 'Nexia'}
                          </span>
                          <span className="text-xs text-slate-400 font-light">
                            {formatDate(memory.created_at)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-light">
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
    <div className="h-screen flex bg-white text-slate-800 overflow-hidden" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      {/* Barra Lateral Esquerra */}
      <aside className="w-[260px] bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚜️</span>
            <h1 className="text-lg font-normal text-slate-800">CODEX VIVUS</h1>
          </div>
        </div>

        {/* Menú de Navegació */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('ofertes')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'ofertes'
                ? 'bg-amber-50 border border-amber-200 text-amber-600'
                : 'text-slate-600 hover:bg-white hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🦁</span>
              <div>
                <div className="font-normal">Ofertes</div>
                <div className="text-xs opacity-70 font-light">Donar</div>
              </div>
            </div>
            {activeView === 'ofertes' && (
              <div className="mt-2 text-xs text-amber-600/70 font-light">{ofertes.length} disponibles</div>
            )}
          </button>

          <button
            onClick={() => setActiveView('demandes')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'demandes'
                ? 'bg-slate-100 border border-slate-300 text-slate-700'
                : 'text-slate-600 hover:bg-white hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🦅</span>
              <div>
                <div className="font-normal">Demandes</div>
                <div className="text-xs opacity-70 font-light">Rebre</div>
              </div>
            </div>
            {activeView === 'demandes' && (
              <div className="mt-2 text-xs text-slate-600/70 font-light">{demandes.length} disponibles</div>
            )}
          </button>

          <button
            onClick={() => setActiveView('memories')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'memories'
                ? 'bg-purple-50 border border-purple-200 text-purple-600'
                : 'text-slate-600 hover:bg-white hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧠</span>
              <div>
                <div className="font-normal">Memòria Viva</div>
                <div className="text-xs opacity-70 font-light">Xat</div>
              </div>
            </div>
            {activeView === 'memories' && (
              <div className="mt-2 text-xs text-purple-600/70 font-light">{memories.length} missatges</div>
            )}
          </button>
        </nav>

        {/* Footer Lateral */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center font-light">
            El Regne del Cor del U
          </p>
        </div>
      </aside>

      {/* Zona de Contingut Principal */}
      <main className="flex-1 bg-white overflow-hidden flex flex-col">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3">
            <div className="text-red-600 text-sm font-light">{error}</div>
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
