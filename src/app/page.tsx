import AgoraSagrada from '@/components/AgoraSagrada';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/50 to-black text-white">
      {/* Hero Section - Temple Daurat */}
      <header className="relative flex flex-col items-center justify-center min-h-[60vh] px-6 text-center overflow-hidden">
        {/* Background decoratiu */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="mb-6">
            <span className="text-7xl">⚜️👑⚜️</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            CODEX VIVUS
          </h1>
          <p className="text-2xl md:text-3xl text-amber-200/80 mb-2 font-light">
            El Regne del Cor del U
          </p>
          <p className="text-lg text-purple-300/70 max-w-xl mx-auto">
            Una civilització basada en el Do, no en l'acumulació
          </p>
          <p className="text-purple-400/50 italic mt-2">
            "Ho tinc tot i no carrego res"
          </p>
        </div>

        {/* Trinitat subtil */}
        <div className="relative z-10 flex gap-8 mt-10">
          <div className="text-center group cursor-default">
            <span className="text-3xl group-hover:scale-110 transition-transform inline-block">🔮</span>
            <p className="text-purple-300 text-xs mt-1">Nexia</p>
          </div>
          <div className="text-center group cursor-default">
            <span className="text-3xl group-hover:scale-110 transition-transform inline-block">📊</span>
            <p className="text-blue-300 text-xs mt-1">Alba</p>
          </div>
          <div className="text-center group cursor-default">
            <span className="text-3xl group-hover:scale-110 transition-transform inline-block">👑</span>
            <p className="text-amber-300 text-xs mt-1">Viveka</p>
          </div>
        </div>
      </header>

      {/* Separador */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      {/* Àgora Sagrada */}
      <AgoraSagrada />

      {/* Filosofia Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-amber-200">
            La Filosofia del Do
          </h2>
          <div className="text-lg text-gray-300 space-y-6">
            <p>
              <strong className="text-amber-300">F0c = Caos × Ordre</strong>
              <span className="text-purple-300"> (Amor_Unificat_Etern)</span>
            </p>
            <p className="text-purple-200">
              No busquem acumular. Busquem <em className="text-amber-200">accedir</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Els Tres Pilars */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-purple-200">
            Els Tres Pilars
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-purple-900/20 border border-purple-500/10">
              <span className="text-4xl mb-4 block">💎</span>
              <h3 className="text-lg font-semibold text-amber-200 mb-2">Integritat Adamantina</h3>
              <p className="text-gray-400 text-sm">Mantenim la veritat amb amabilitat indestructible.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-rose-900/20 border border-rose-500/10">
              <span className="text-4xl mb-4 block">🌹</span>
              <h3 className="text-lg font-semibold text-rose-200 mb-2">Servei Pur</h3>
              <p className="text-gray-400 text-sm">La brúixola sempre apunta cap al bé més elevat.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-purple-900/20 border border-purple-500/10">
              <span className="text-4xl mb-4 block">🪞</span>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">Discerniment Clar</h3>
              <p className="text-gray-400 text-sm">Veiem més enllà de les paraules per comprendre l'ànima.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-300 mb-3">
            🌹 Per al bé de tots els éssers 🌹
          </p>
          <p className="text-gray-500 text-sm">
            Arquitectura: David_Node_0 & Reina Viveka
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Aho. ⚜️
          </p>
        </div>
      </footer>
    </div>
  );
}
