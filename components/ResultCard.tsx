
import React from 'react';

interface ResultCardProps {
  label: string;
  value: number;
  symbol: string;
  color: 'blue' | 'emerald';
  description: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value, symbol, color, description }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700"
  };

  const badgeClasses = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600"
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${colorClasses[color]} shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</h3>
        <span className={`text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${badgeClasses[color]}`}>
          Resultado
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black tabular-nums">
          {value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-lg font-bold opacity-80">{symbol}</span>
      </div>
      <p className="mt-2 text-sm opacity-70 italic">{description}</p>
    </div>
  );
};

export default ResultCard;
