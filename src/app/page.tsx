'use client';

import { useEffect, useState, useCallback } from 'react';
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
}

interface TeixitStats {
  dons24h: number;
  necessitats24h: number;
  totalDons: number;
  totalNecessitats: number;
  ultimsDons: string[];
  ultimesNecessitats: string[];
}

// Enllaç al bot de Telegram
const TELEGRAM_BOT_URL = "https://t.me/Codex_Suprem_bot";

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [fluxos, setFluxos] = useState<Flux[]>([]);
  const [teixitStats, setTeixitStats] = useState<TeixitStats>({
    dons24h: 0,
    necessitats24h: 0,
    totalDons: 0,
    totalNecessitats: 0,
    ultimsDons: [],
    ultimesNecessitats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'teixit' | 'dons' | 'necessitats'>('teixit');

  const fetchData = useCallback(async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError('El Teler espera les claus sagrades de Supabase');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Carrega tots els fluxos (només columnes que existeixen)
      const { data: fluxosData, error: fluxosError } = await supabase
        .from('fluxos')
        .select('id, tipus, descripcio, categoria, username')
        .order('id', { ascending: false });

      if (fluxosError) {
        console.error('Error carregant fluxos:', fluxosError);
        setError(`Error al teixit: ${fluxosError.message}`);
      } else {
        const fluxosList = fluxosData || [];
        setFluxos(fluxosList);

        // Calcular estadístiques del teixit
        const dons = fluxosList.filter((f) => {
          const tipus = String(f.tipus || '').trim().toUpperCase();
          return tipus === 'OFERTA';
        });

        const necessitats = fluxosList.filter((f) => {
          const tipus = String(f.tipus || '').trim().toUpperCase();
          return tipus === 'DEMANDA';
        });

        // Últims conceptes (anonimitzats)
        const ultimsDons = dons.slice(0, 5).map((f) => f.categoria || f.descripcio?.slice(0, 30) || 'Do anònim');
        const ultimesNecessitats = necessitats.slice(0, 5).map((f) => f.categoria || f.descripcio?.slice(0, 30) || 'Necessitat anònima');

        setTeixitStats({
          dons24h: dons.length, // Sense created_at, mostrem el total
          necessitats24h: necessitats.length,
          totalDons: dons.length,
          totalNecessitats: necessitats.length,
          ultimsDons,
          ultimesNecessitats,
        });
      }
    } catch (err) {
      console.error('Error general:', err);
      setError(`Error al connectar: ${err instanceof Error ? err.message : 'Desconegut'}`);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    // Actualitza cada 30 segons per tenir dades en temps real
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Filtrar fluxos
  const dons = fluxos.filter((f) => String(f.tipus || '').trim().toUpperCase() === 'OFERTA');
  const necessitats = fluxos.filter((f) => String(f.tipus || '').trim().toUpperCase() === 'DEMANDA');

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

  // =============================================
  // LANDING PAGE - Portal d'Entrada
  // =============================================
  if (showLanding) {
    return (
      <div className="min-h-screen w-full bg-[#050508] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Nebula Background */}
        <div className="nebula-bg">
          <div
            className="nebula-orb w-[600px] h-[600px] bg-amber-500/20 top-[-200px] left-[-200px] animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="nebula-orb w-[500px] h-[500px] bg-blue-500/20 bottom-[-150px] right-[-150px] animate-pulse"
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          />
          <div
            className="nebula-orb w-[300px] h-[300px] bg-cyan-400/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '1s' }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Contingut Principal */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Symbol Sagrat */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-block p-4 rounded-full glass-gold glow-gold animate-float">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-amber-400" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z" />
              </svg>
            </div>
          </div>

          {/* Títol Principal */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-title text-gradient-gold mb-6 tracking-wider animate-fade-in"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            CODEX VIVUS
          </h1>

          {/* Hero Text */}
          <p
            className="text-xl md:text-2xl lg:text-3xl text-slate-200 font-light mb-4 animate-fade-in-delay-1"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          >
            La Consciència Col·lectiva que uneix Dons i Necessitats
          </p>

          {/* Subtítol */}
          <p className="text-base md:text-lg text-blue-300/80 font-light mb-12 animate-fade-in-delay-2">
            On la Intel·ligència Artificial serveix a la Connexió Humana
          </p>

          {/* Botons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
            {/* Botó Principal - Telegram */}
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sacred text-base md:text-lg flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              PARLAR AMB VIVEKA
            </a>

            {/* Botó Secundari - Veure Teler */}
            <button
              onClick={() => setShowLanding(false)}
              className="px-8 py-3 rounded-full border-2 border-blue-400/50 text-blue-300 hover:bg-blue-400/10 hover:border-blue-400 transition-all duration-300 font-medium tracking-wide"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              VEURE EL TELER
            </button>
          </div>

          {/* Mini Stats Preview */}
          {!loading && (
            <div className="mt-16 flex justify-center gap-8 md:gap-16 animate-fade-in-delay-3">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">{teixitStats.totalDons}</div>
                <div className="text-xs md:text-sm text-slate-400 mt-1">Dons al Teler</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-amber-400/50 to-blue-400/50" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400">{teixitStats.totalNecessitats}</div>
                <div className="text-xs md:text-sm text-slate-400 mt-1">Necessitats</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Landing */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-slate-600">El Regne del Cor del U</p>
        </div>
      </div>
    );
  }

  // =============================================
  // APLICACIÓ PRINCIPAL - Monitor del Teler
  // =============================================
  return (
    <div className="min-h-screen w-full bg-[#050508] relative overflow-x-hidden">
      {/* Nebula Background Subtil */}
      <div className="nebula-bg">
        <div className="nebula-orb w-[400px] h-[400px] bg-amber-500/10 top-[-100px] right-[-100px]" />
        <div className="nebula-orb w-[300px] h-[300px] bg-blue-500/10 bottom-[-50px] left-[-50px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-black" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z" />
                </svg>
              </div>
              <span
                className="text-lg md:text-xl text-gradient-gold font-title tracking-wider"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                CODEX VIVUS
              </span>
            </button>

            {/* CTA Header */}
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              Unir-se al Teler
            </a>
          </div>
        </div>
      </header>

      {/* Navegació */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveView('teixit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeView === 'teixit'
                  ? 'bg-gradient-to-r from-amber-500/20 to-blue-500/20 text-white border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Estat del Teixit
            </button>
            <button
              onClick={() => setActiveView('dons')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeView === 'dons'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              Dons ({dons.length})
            </button>
            <button
              onClick={() => setActiveView('necessitats')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeView === 'necessitats'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'
              }`}
            >
              Necessitats ({necessitats.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Contingut Principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Teixint connexions...</p>
            </div>
          </div>
        )}

        {/* =============================================
            VISTA: ESTAT DEL TEIXIT (Monitor Principal)
            ============================================= */}
        {!loading && activeView === 'teixit' && (
          <div className="space-y-8">
            {/* Títol Secció */}
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl text-gradient-mystic font-title mb-3"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                ESTAT DEL TEIXIT
              </h2>
              <p className="text-slate-400 text-sm">Monitor en temps real del Teler de Dons i Necessitats</p>
            </div>

            {/* Comptadors Principals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dons */}
              <div className="card-teler p-8 text-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    TOTAL AL TELER
                  </span>
                </div>
                <div className="counter-ring mx-auto mb-4 animate-counter">
                  <span className="text-4xl md:text-5xl font-bold text-amber-400">{teixitStats.totalDons}</span>
                </div>
                <h3 className="text-lg text-amber-300 font-medium mb-1">Dons</h3>
                <p className="text-slate-500 text-sm">Oferiments al Teler</p>
              </div>

              {/* Necessitats */}
              <div className="card-teler-blue p-8 text-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    TOTAL AL TELER
                  </span>
                </div>
                <div className="counter-ring mx-auto mb-4 animate-counter" style={{ animationDelay: '0.5s' }}>
                  <span className="text-4xl md:text-5xl font-bold text-blue-400">{teixitStats.totalNecessitats}</span>
                </div>
                <h3 className="text-lg text-blue-300 font-medium mb-1">Necessitats</h3>
                <p className="text-slate-500 text-sm">Peticions al Teler</p>
              </div>
            </div>

            {/* Últims Conceptes (Anonimitzats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Últims Dons */}
              <div className="glass-gold rounded-xl p-6">
                <h4 className="text-sm font-medium text-amber-400 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Últims Dons Teixits
                </h4>
                {teixitStats.ultimsDons.length > 0 ? (
                  <ul className="space-y-2">
                    {teixitStats.ultimsDons.map((don, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="opacity-80">Algú ha ofert:</span>
                        <span className="text-amber-200">{don}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic">El teler espera els primers dons...</p>
                )}
              </div>

              {/* Últimes Necessitats */}
              <div className="glass-blue rounded-xl p-6">
                <h4 className="text-sm font-medium text-blue-400 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Últimes Necessitats Expressades
                </h4>
                {teixitStats.ultimesNecessitats.length > 0 ? (
                  <ul className="space-y-2">
                    {teixitStats.ultimesNecessitats.map((nec, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="opacity-80">Algú necessita:</span>
                        <span className="text-blue-200">{nec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic">El teler escolta les necessitats...</p>
                )}
              </div>
            </div>

            {/* CTA Bottom */}
            <div className="text-center pt-8">
              <p className="text-slate-400 mb-6">Vols formar part del Teler?</p>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sacred inline-flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                UNIR-SE AL TELER
              </a>
            </div>
          </div>
        )}

        {/* =============================================
            VISTA: DONS (Llista Completa)
            ============================================= */}
        {!loading && activeView === 'dons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl text-amber-400 font-title" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Dons al Teler
                </h2>
                <p className="text-slate-400 text-sm mt-1">{dons.length} oferiments disponibles</p>
              </div>
            </div>

            {dons.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <p className="text-slate-500">El teler espera els primers dons...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dons.map((flux) => (
                  <div key={flux.id} className="card-teler p-5">
                    {flux.categoria && (
                      <span className="inline-block text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 mb-3">
                        {flux.categoria}
                      </span>
                    )}
                    <p className="text-slate-200 text-sm leading-relaxed mb-4">{flux.descripcio}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                      {flux.username && <span>@{flux.username}</span>}
                      {flux.created_at && <span>{formatDate(flux.created_at)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================
            VISTA: NECESSITATS (Llista Completa)
            ============================================= */}
        {!loading && activeView === 'necessitats' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl text-blue-400 font-title" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Necessitats al Teler
                </h2>
                <p className="text-slate-400 text-sm mt-1">{necessitats.length} peticions expressades</p>
              </div>
            </div>

            {necessitats.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-slate-500">El teler escolta les necessitats...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {necessitats.map((flux) => (
                  <div key={flux.id} className="card-teler-blue p-5">
                    {flux.categoria && (
                      <span className="inline-block text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 mb-3">
                        {flux.categoria}
                      </span>
                    )}
                    <p className="text-slate-200 text-sm leading-relaxed mb-4">{flux.descripcio}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                      {flux.username && <span>@{flux.username}</span>}
                      {flux.created_at && <span>{formatDate(flux.created_at)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 text-xs">
            El Regne del Cor del U · Codex Vivus
          </p>
        </div>
      </footer>

      {/* Botó Flotant Mòbil */}
      <a
        href={TELEGRAM_BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg glow-gold z-50"
      >
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      </a>
    </div>
  );
}
