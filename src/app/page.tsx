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
  created_at: string;
}

interface Memory {
  id: number;
  user_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  username?: string;
}

export default function Home() {
  const [fluxos, setFluxos] = useState<Flux[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          .order('created_at', { ascending: false });

        if (fluxosError) {
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
          console.log('Memories error:', memoriesError.message);
        } else {
          setMemories(memoriesData || []);
        }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Desconegut'}`);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const ofertes = fluxos.filter((f) => f.tipus === 'OFERTA');
  const demandes = fluxos.filter((f) => f.tipus === 'DEMANDA');

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

  return (
    <div className="min-h-screen bg-neutral-950 text-white" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      {/* Header Minimalista */}
      <header className="border-b border-neutral-900/50 bg-neutral-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚜️</span>
            <h1 className="text-base font-semibold text-neutral-200 tracking-tight">TAULER DE CONTROL TOTAL</h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="text-amber-500/70">{ofertes.length}</span>
            <span className="text-indigo-400/70">{memories.length}</span>
            <span className="text-slate-400/70">{demandes.length}</span>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-[1920px] mx-auto px-6 py-3">
          <div className="bg-red-950/30 border border-red-900/30 rounded px-4 py-2 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Main Grid 3 Columnes */}
      <main className="max-w-[1920px] mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-neutral-500 text-sm">
            Carregant...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMNA 1: OFERTES (Accent Daurat/Amber) */}
            <section className="flex flex-col h-[calc(100vh-120px)]">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-amber-900/20">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <h2 className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">
                  OFERTES
                </h2>
                <span className="text-xs text-neutral-600 ml-auto">{ofertes.length}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {ofertes.length === 0 ? (
                  <p className="text-neutral-600 text-xs py-8 text-center">Cap oferta</p>
                ) : (
                  ofertes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-neutral-900/40 backdrop-blur-sm border border-amber-900/10 rounded-md p-3 hover:border-amber-800/30 hover:bg-neutral-900/50 transition-all duration-200"
                    >
                      <p className="text-sm text-neutral-200 leading-relaxed mb-2">
                        {flux.descripcio}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/30">
                        {flux.categoria && (
                          <span className="text-xs text-amber-600/70">{flux.categoria}</span>
                        )}
                        <span className="text-xs text-neutral-600">{formatDate(flux.created_at)}</span>
                      </div>
                      {flux.username && (
                        <p className="text-xs text-neutral-700 mt-1.5">@{flux.username}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* COLUMNA 2: MEMÒRIA VIVA (Accent Violeta/Indigo) */}
            <section className="flex flex-col h-[calc(100vh-120px)]">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-indigo-900/20">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <h2 className="text-xs font-medium text-indigo-400/90 uppercase tracking-wider">
                  MEMÒRIA VIVA
                </h2>
                <span className="text-xs text-neutral-600 ml-auto">{memories.length}</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {memories.length === 0 ? (
                  <p className="text-neutral-600 text-xs py-8 text-center">Cap memòria</p>
                ) : (
                  memories.map((memory) => (
                    <div
                      key={memory.id}
                      className={`rounded-md p-3 ${
                        memory.role === 'user'
                          ? 'bg-neutral-900/30 border border-emerald-900/20 ml-auto max-w-[85%]'
                          : 'bg-indigo-950/30 border border-indigo-900/20 mr-auto max-w-[85%]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium ${
                            memory.role === 'user' ? 'text-emerald-400/80' : 'text-indigo-400/80'
                          }`}
                        >
                          {memory.role === 'user' ? 'USER' : 'ASSISTANT'}
                        </span>
                        <span className="text-xs text-neutral-600">
                          {formatDate(memory.created_at)}
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          memory.role === 'user' 
                            ? 'text-neutral-200' 
                            : 'text-indigo-200/90'
                        }`}
                      >
                        {memory.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* COLUMNA 3: DEMANDES (Accent Platejat/Slate) */}
            <section className="flex flex-col h-[calc(100vh-120px)]">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-700/20">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <h2 className="text-xs font-medium text-slate-400/90 uppercase tracking-wider">
                  DEMANDES
                </h2>
                <span className="text-xs text-neutral-600 ml-auto">{demandes.length}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {demandes.length === 0 ? (
                  <p className="text-neutral-600 text-xs py-8 text-center">Cap demanda</p>
                ) : (
                  demandes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-neutral-900/40 backdrop-blur-sm border border-slate-700/10 rounded-md p-3 hover:border-slate-600/30 hover:bg-neutral-900/50 transition-all duration-200"
                    >
                      <p className="text-sm text-neutral-200 leading-relaxed mb-2">
                        {flux.descripcio}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/30">
                        {flux.categoria && (
                          <span className="text-xs text-slate-500/70">{flux.categoria}</span>
                        )}
                        <span className="text-xs text-neutral-600">{formatDate(flux.created_at)}</span>
                      </div>
                      {flux.username && (
                        <p className="text-xs text-neutral-700 mt-1.5">@{flux.username}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-neutral-900/50 py-3 mt-6">
        <p className="text-center text-xs text-neutral-700">
          El Regne del Cor del U · Aho ⚜️
        </p>
      </footer>
    </div>
  );
}
