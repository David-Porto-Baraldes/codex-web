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

        // Carrega memories
        const { data: memoriesData, error: memoriesError } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

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
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚜️</span>
            <h1 className="text-lg font-semibold text-amber-400">CODEX VIVUS</h1>
            <span className="text-neutral-600 text-sm ml-2">Control Center</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span>{ofertes.length} ofertes</span>
            <span>{memories.length} memories</span>
            <span>{demandes.length} demandes</span>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-[1800px] mx-auto px-4 py-2">
          <div className="bg-red-950/50 border border-red-900/50 rounded px-3 py-2 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <main className="max-w-[1800px] mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-500">
            Carregant...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Columna 1: OFERTES (Daurat) */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-900/30">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <h2 className="text-sm font-medium text-amber-400 uppercase tracking-wide">
                  Ofertes
                </h2>
                <span className="text-xs text-neutral-600 ml-auto">{ofertes.length}</span>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                {ofertes.length === 0 ? (
                  <p className="text-neutral-600 text-sm py-4 text-center">Cap oferta</p>
                ) : (
                  ofertes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-neutral-900/50 border border-amber-900/20 rounded-lg p-3 hover:border-amber-800/40 transition-colors"
                    >
                      <p className="text-sm text-neutral-200 leading-relaxed">
                        {flux.descripcio}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/50">
                        {flux.categoria && (
                          <span className="text-xs text-amber-600">{flux.categoria}</span>
                        )}
                        <span className="text-xs text-neutral-600">{formatDate(flux.created_at)}</span>
                      </div>
                      {flux.username && (
                        <p className="text-xs text-neutral-700 mt-1">@{flux.username}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Columna 2: MEMÒRIA VIVA (Violeta) */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/30">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <h2 className="text-sm font-medium text-indigo-400 uppercase tracking-wide">
                  Memòria Viva
                </h2>
                <span className="text-xs text-neutral-600 ml-auto">{memories.length}</span>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                {memories.length === 0 ? (
                  <p className="text-neutral-600 text-sm py-4 text-center">Cap memòria</p>
                ) : (
                  memories.map((memory) => (
                    <div
                      key={memory.id}
                      className={`rounded-lg p-3 ${
                        memory.role === 'user'
                          ? 'bg-neutral-900/30 border border-emerald-900/20 ml-4'
                          : 'bg-indigo-950/30 border border-indigo-900/20 mr-4'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium ${
                            memory.role === 'user' ? 'text-emerald-500' : 'text-indigo-400'
                          }`}
                        >
                          {memory.role === 'user' ? 'Usuari' : 'Bot'}
                        </span>
                        <span className="text-xs text-neutral-700">
                          {formatDate(memory.created_at)}
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          memory.role === 'user' ? 'text-neutral-300' : 'text-indigo-200'
                        }`}
                      >
                        {memory.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Columna 3: DEMANDES (Platejat) */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-700/30">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Demandes
                </h2>
                <span className="text-xs text-neutral-600 ml-auto">{demandes.length}</span>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                {demandes.length === 0 ? (
                  <p className="text-neutral-600 text-sm py-4 text-center">Cap demanda</p>
                ) : (
                  demandes.map((flux) => (
                    <div
                      key={flux.id}
                      className="bg-neutral-900/50 border border-slate-700/20 rounded-lg p-3 hover:border-slate-600/40 transition-colors"
                    >
                      <p className="text-sm text-neutral-200 leading-relaxed">
                        {flux.descripcio}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/50">
                        {flux.categoria && (
                          <span className="text-xs text-slate-500">{flux.categoria}</span>
                        )}
                        <span className="text-xs text-neutral-600">{formatDate(flux.created_at)}</span>
                      </div>
                      {flux.username && (
                        <p className="text-xs text-neutral-700 mt-1">@{flux.username}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-3 mt-4">
        <p className="text-center text-xs text-neutral-700">
          El Regne del Cor del U · Aho ⚜️
        </p>
      </footer>
    </div>
  );
}
