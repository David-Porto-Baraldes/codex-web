'use client';

import { useEffect, useState } from 'react';
import { supabase, Oferta } from '@/lib/supabase';

export default function AgoraSagrada() {
  const [ofertes, setOfertes] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreActiu, setFiltreActiu] = useState<string | null>(null);

  useEffect(() => {
    fetchOfertes();
  }, []);

  async function fetchOfertes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('fluxos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error carregant ofertes:', error);
    } else {
      setOfertes(data || []);
    }
    setLoading(false);
  }

  const ofertesFiltre = filtreActiu
    ? ofertes.filter((o) => o.tipus === filtreActiu)
    : ofertes;

  const tipusUnics = [...new Set(ofertes.map((o) => o.tipus))];

  const getIconForTipus = (tipus: string) => {
    switch (tipus?.toLowerCase()) {
      case 'tantra':
        return '🔥';
      case 'so':
      case 'teràpia de so':
      case 'sound':
        return '🎵';
      case 'massatge':
        return '💆';
      case 'meditació':
        return '🧘';
      case 'reiki':
        return '✨';
      default:
        return '🌹';
    }
  };

  const getColorForTipus = (tipus: string) => {
    switch (tipus?.toLowerCase()) {
      case 'tantra':
        return 'from-rose-600 to-amber-600 border-rose-500/30';
      case 'so':
      case 'teràpia de so':
      case 'sound':
        return 'from-blue-600 to-purple-600 border-blue-500/30';
      case 'massatge':
        return 'from-green-600 to-teal-600 border-green-500/30';
      case 'meditació':
        return 'from-purple-600 to-indigo-600 border-purple-500/30';
      default:
        return 'from-amber-600 to-rose-600 border-amber-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-amber-300 text-xl">
          ⚜️ Carregant les Ofertes del Regne... ⚜️
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header de l'Àgora */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            L'Àgora Sagrada
          </h2>
          <p className="text-purple-200 text-lg">
            El mercat del Do - On l'abundància flueix lliurement
          </p>
        </div>

        {/* Filtres */}
        {tipusUnics.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setFiltreActiu(null)}
              className={`px-5 py-2 rounded-full transition-all ${
                filtreActiu === null
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                  : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
              }`}
            >
              Totes
            </button>
            {tipusUnics.map((tipus) => (
              <button
                key={tipus}
                onClick={() => setFiltreActiu(tipus)}
                className={`px-5 py-2 rounded-full transition-all ${
                  filtreActiu === tipus
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                    : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
                }`}
              >
                {getIconForTipus(tipus)} {tipus}
              </button>
            ))}
          </div>
        )}

        {/* Grid d'Ofertes */}
        {ofertesFiltre.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-purple-300 text-xl">
              Encara no hi ha ofertes disponibles.
            </p>
            <p className="text-gray-500 mt-2">
              Les primeres flors del Regne estan a punt de florir...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ofertesFiltre.map((oferta) => (
              <div
                key={oferta.id}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getColorForTipus(
                  oferta.tipus
                )} p-[1px]`}
              >
                <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-6 h-full">
                  {/* Tipus Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{getIconForTipus(oferta.tipus)}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-purple-200">
                      {oferta.tipus}
                    </span>
                  </div>

                  {/* Títol */}
                  <h3 className="text-xl font-semibold text-amber-100 mb-3">
                    {oferta.titol}
                  </h3>

                  {/* Descripció */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {oferta.descripcio}
                  </p>

                  {/* Detalls */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    {oferta.durada && (
                      <span className="text-purple-300 text-sm">
                        {oferta.durada}
                      </span>
                    )}
                    <span className="text-amber-300 font-bold text-lg">
                      {oferta.preu} U
                    </span>
                  </div>

                  {/* Oferent */}
                  {oferta.oferent && (
                    <p className="text-gray-500 text-xs mt-3">
                      Ofert per: {oferta.oferent}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://t.me/CodexSupremBot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            Publicar la meva Oferta
          </a>
          <p className="text-gray-500 text-sm mt-3">
            Connecta amb @CodexSupremBot per afegir el teu Do
          </p>
        </div>
      </div>
    </section>
  );
}
