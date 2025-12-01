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
  const [showLanding, setShowLanding] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
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

  // Gestió de la transició de sortida
  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowLanding(false);
    }, 600);
  };

  // Landing Page - La Porta Sagrada
  if (showLanding) {
    return (
      <div
        className={`h-screen w-screen bg-sacred-cream flex items-center justify-center relative overflow-hidden ${isExiting ? 'animate-fade-out' : ''}`}
      >
        {/* Cercles decoratius que respiren */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Cercle daurat superior esquerra */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full animate-breathe"
            style={{
              background: 'radial-gradient(circle, rgba(217, 175, 98, 0.08) 0%, transparent 70%)'
            }}
          />
          {/* Cercle violeta inferior dreta */}
          <div
            className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full animate-breathe-slow"
            style={{
              background: 'radial-gradient(circle, rgba(168, 139, 183, 0.06) 0%, transparent 70%)',
              animationDelay: '4s'
            }}
          />
          {/* Cercle central subtil */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full animate-breathe"
            style={{
              background: 'radial-gradient(circle, rgba(180, 140, 80, 0.03) 0%, transparent 60%)',
              animationDelay: '2s'
            }}
          />
        </div>

        {/* Contingut Principal */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

          {/* Ornament superior */}
          <div className="animate-fade-in mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-0 bg-gradient-to-r from-transparent to-amber-400/40 animate-line-grow" />
              <span className="text-amber-600/60 text-2xl animate-float-gentle">◆</span>
              <div className="h-[1px] w-0 bg-gradient-to-l from-transparent to-amber-400/40 animate-line-grow" />
            </div>
          </div>

          {/* Títol Principal */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-stone-800 mb-6 tracking-[0.15em] animate-fade-in-delay-1"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 400 }}
          >
            CODEX VIVUS
          </h1>

          {/* Línia decorativa sota el títol */}
          <div className="flex justify-center mb-8 animate-fade-in-delay-1">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          </div>

          {/* Subtítol - La Frase Sagrada */}
          <p
            className="text-xl sm:text-2xl md:text-3xl text-stone-600 mb-10 tracking-wide animate-fade-in-delay-2"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}
          >
            Ho tinc tot i no carrego res.
          </p>

          {/* Descripció Poètica */}
          <p
            className="text-base sm:text-lg md:text-xl text-stone-500 font-light leading-relaxed mb-14 max-w-xl mx-auto animate-fade-in-delay-2"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            Benvingut a l&apos;Economia del Do.<br className="hidden sm:block" />
            Un espai on la voluntat es troba amb el destí.<br className="hidden sm:block" />
            <span className="text-stone-600">Connecta, ofereix i rep.</span>
          </p>

          {/* Botó Principal - ENTRAR AL GRESOL */}
          <div className="animate-fade-in-delay-3 mb-16">
            <button
              onClick={handleEnter}
              className="group relative px-12 py-5 rounded-full shadow-sacred hover:shadow-sacred-hover transition-all duration-500 ease-out hover:scale-[1.02] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #c9a55c 0%, #b8934f 50%, #a67c3d 100%)',
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 btn-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Text del botó */}
              <span
                className="relative z-10 text-white text-sm sm:text-base tracking-[0.25em] font-medium"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                ENTRAR AL GRESOL
              </span>
            </button>
          </div>

          {/* Ornament inferior */}
          <div className="animate-fade-in-delay-3 mb-8">
            <div className="flex items-center justify-center gap-3 text-stone-400/50 text-xs tracking-[0.3em]">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>

          {/* Enllaç Telegram - Parlar amb Viveka */}
          <div className="animate-fade-in-delay-4">
            <a
              href="https://t.me/Codex_Suprem_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-stone-400 hover:text-amber-600 transition-colors duration-300 group"
            >
              {/* Icona Telegram */}
              <svg
                className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.44 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
              </svg>
              <span
                className="text-sm tracking-wide"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                Parlar amb Viveka
              </span>
              <svg
                className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Peu discret */}
        <div className="absolute bottom-6 left-0 right-0 text-center animate-fade-in-delay-4">
          <p
            className="text-xs text-stone-400/60 tracking-widest"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            EL REGNE DEL COR DEL U
          </p>
        </div>
      </div>
    );
  }

  // Aplicació Principal
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
