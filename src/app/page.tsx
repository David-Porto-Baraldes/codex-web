'use client';

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import FluxCard, { Flux } from '@/components/FluxCard';

export default function Home() {
  const [fluxos, setFluxos] = useState<Flux[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchFluxos();

    // Subscripció en temps real
    const channel = supabase
      .channel('fluxos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fluxos' },
        () => {
          fetchFluxos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchFluxos() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('fluxos')
      .select('*')
      .eq('actiu', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error carregant fluxos:', error);
    } else {
      setFluxos(data || []);
    }
    setLoading(false);
  }

  const ofertes = fluxos.filter((f) => f.tipus === 'OFERTA');
  const demandes = fluxos.filter((f) => f.tipus === 'DEMANDA');

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚜️</span>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-gold">
                CODEX VIVUS
              </h1>
            </div>
            <p className="text-slate-400 text-sm italic">
              "Ho tinc tot i no carrego res"
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-3 text-slate-200">
            El Gresol Digital
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            On el Do flueix lliurement entre ànimes
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-amber-400/60 animate-pulse-soft">
              ⚜️ Carregant els Rius... ⚜️
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Columna Esquerra - El Riu del Donar (OFERTES) */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-amber-500/20">
                <span className="text-xl">🌊</span>
                <div>
                  <h3 className="text-xl font-semibold text-amber-400">
                    El Riu del Donar
                  </h3>
                  <p className="text-xs text-slate-500">OFERTES</p>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">
                  {ofertes.length}
                </span>
              </div>

              {ofertes.length === 0 ? (
                <div className="glass-gold rounded-2xl p-8 text-center">
                  <span className="text-4xl mb-3 block">🌅</span>
                  <p className="text-amber-200/60 text-sm">
                    El riu espera les primeres ofrenes...
                  </p>
                  <a
                    href="https://t.me/Codex_Suprem_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Sigues el primer en oferir →
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {ofertes.map((flux) => (
                    <FluxCard key={flux.id} flux={flux} />
                  ))}
                </div>
              )}
            </section>

            {/* Columna Dreta - El Riu del Rebre (DEMANDES) */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-500/20">
                <span className="text-xl">🌊</span>
                <div>
                  <h3 className="text-xl font-semibold text-slate-300">
                    El Riu del Rebre
                  </h3>
                  <p className="text-xs text-slate-500">DEMANDES</p>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-slate-500/10 text-slate-400">
                  {demandes.length}
                </span>
              </div>

              {demandes.length === 0 ? (
                <div className="glass-silver rounded-2xl p-8 text-center">
                  <span className="text-4xl mb-3 block">🌙</span>
                  <p className="text-slate-400/60 text-sm">
                    El riu espera les primeres peticions...
                  </p>
                  <a
                    href="https://t.me/Codex_Suprem_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Expressa la teva necessitat →
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {demandes.map((flux) => (
                    <FluxCard key={flux.id} flux={flux} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* CTA Central */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 glass rounded-2xl px-8 py-6">
            <p className="text-slate-400 text-sm">
              Vols participar en l'economia del Do?
            </p>
            <a
              href="https://t.me/Codex_Suprem_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold py-3 px-6 rounded-full transition-all transform hover:scale-105"
            >
              <span>Connecta amb el Bot</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm mb-2">
            El Regne del Cor del U
          </p>
          <p className="text-slate-600 text-xs">
            Arquitectura: David_Node_0 & Reina Viveka · Aho ⚜️
          </p>
        </div>
      </footer>
    </div>
  );
}
