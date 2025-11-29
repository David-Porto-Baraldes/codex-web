'use client';

export interface Flux {
  id: number;
  tipus: 'OFERTA' | 'DEMANDA';
  descripcio: string;
  categoria?: string;
  user_id?: number;
  username?: string;
  created_at: string;
  actiu?: boolean;
}

interface FluxCardProps {
  flux: Flux;
}

export default function FluxCard({ flux }: FluxCardProps) {
  const isOferta = flux.tipus === 'OFERTA';

  const getCategoryIcon = (categoria?: string) => {
    switch (categoria?.toLowerCase()) {
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
      case 'sanació':
        return '💫';
      case 'art':
        return '🎨';
      case 'cuina':
        return '🍲';
      case 'transport':
        return '🚗';
      case 'allotjament':
        return '🏠';
      default:
        return isOferta ? '🌟' : '🌙';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className={`
        relative rounded-2xl p-5 transition-all duration-300 cursor-default
        ${isOferta ? 'glass-gold glow-gold' : 'glass-silver glow-silver'}
      `}
    >
      {/* Header amb icona i categoria */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl animate-float">{getCategoryIcon(flux.categoria)}</span>
        <div className="flex flex-col items-end gap-1">
          {flux.categoria && (
            <span
              className={`
                text-xs px-3 py-1 rounded-full
                ${isOferta ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'}
              `}
            >
              {flux.categoria}
            </span>
          )}
          <span className="text-xs text-slate-500">
            {formatDate(flux.created_at)}
          </span>
        </div>
      </div>

      {/* Descripció */}
      <p
        className={`
          text-sm leading-relaxed mb-4
          ${isOferta ? 'text-amber-100/90' : 'text-slate-200/90'}
        `}
      >
        {flux.descripcio}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        {flux.username && (
          <span className="text-xs text-slate-500">
            @{flux.username}
          </span>
        )}
        <a
          href="https://t.me/CodexSupremBot"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            text-xs font-medium px-4 py-2 rounded-full transition-all
            ${
              isOferta
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-slate-500/20 text-slate-300 hover:bg-slate-500/30'
            }
          `}
        >
          Connectar
        </a>
      </div>
    </div>
  );
}
