
import React, { useState, useMemo, useEffect } from 'react';
import InputGroup from './components/InputGroup';
import ResultCard from './components/ResultCard';
import { getLatestRates } from './services/geminiService';
import { CalculationInputs, GroundingSource } from './types';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    precioUsd: '',
    tasaDia: '',
    tasaBcv: ''
  });
  
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    const usd = parseFloat(inputs.precioUsd) || 0;
    const tDia = parseFloat(inputs.tasaDia) || 0;
    const tBcv = parseFloat(inputs.tasaBcv) || 0;

    const montoBs = usd * tDia;
    const montoBcvUsd = tBcv > 0 ? montoBs / tBcv : 0;

    return {
      montoBolivares: montoBs,
      montoBcvUsd: montoBcvUsd
    };
  }, [inputs]);

  const handleFetchRates = async () => {
    setIsLoadingRates(true);
    setError(null);
    try {
      const data = await getLatestRates();
      setInputs(prev => ({
        ...prev,
        tasaDia: data.tasaDia.toString(),
        tasaBcv: data.tasaBcv.toString()
      }));
      // Clean and set sources
      const mappedSources: GroundingSource[] = data.sources
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title || 'Fuente de información',
          uri: c.web.uri
        }));
      setSources(mappedSources);
    } catch (err) {
      setError("No se pudieron obtener las tasas automáticamente. Por favor, ingrésalas manualmente.");
      console.error(err);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleInputChange = (field: keyof CalculationInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const clearInputs = () => {
    setInputs({
      precioUsd: '',
      tasaDia: '',
      tasaBcv: ''
    });
    setSources([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Section: Inputs */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-calculator text-blue-600"></i>
                Calculadora Inteligente
              </h1>
              <p className="text-slate-500 text-sm mt-1">Conversión precisa y rápida</p>
            </div>
            <button 
              onClick={clearInputs}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
              title="Limpiar campos"
            >
              <i className="fa-solid fa-rotate-left text-lg"></i>
            </button>
          </div>

          <div className="space-y-4">
            <InputGroup 
              label="Precio en Dólares"
              icon="fa-solid fa-dollar-sign"
              placeholder="Ej. 10.00"
              value={inputs.precioUsd}
              onChange={(val) => handleInputChange('precioUsd', val)}
              suffix="USD"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup 
                label="Tasa del Día"
                icon="fa-solid fa-chart-line"
                placeholder="Ej. 60.50"
                value={inputs.tasaDia}
                onChange={(val) => handleInputChange('tasaDia', val)}
                suffix="Bs/$"
              />
              <InputGroup 
                label="Tasa BCV"
                icon="fa-solid fa-building-columns"
                placeholder="Ej. 54.20"
                value={inputs.tasaBcv}
                onChange={(val) => handleInputChange('tasaBcv', val)}
                suffix="Bs/$"
              />
            </div>

            <button
              onClick={handleFetchRates}
              disabled={isLoadingRates}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
                isLoadingRates 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]'
              }`}
            >
              {isLoadingRates ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Buscando tasas actuales...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Obtener tasas con IA (Gemini)
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Results */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ResultCard 
            label="Monto en Bolívares"
            value={results.montoBolivares}
            symbol="Bs."
            color="blue"
            description="Cálculo: Precio en $ × Tasa del Día"
          />
          
          <ResultCard 
            label="Equivalente Dólar BCV"
            value={results.montoBcvUsd}
            symbol="USD (BCV)"
            color="emerald"
            description="Cálculo: (Monto en Bs) ÷ Tasa BCV"
          />

          {/* Grounding Sources Panel */}
          {sources.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                Fuentes Consultadas
              </h4>
              <ul className="space-y-3">
                {sources.slice(0, 3).map((source, idx) => (
                  <li key={idx} className="group">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-slate-600 group-hover:text-blue-600 flex items-start gap-2 transition-colors"
                    >
                      <i className="fa-solid fa-link mt-1 text-[10px] text-slate-300 group-hover:text-blue-400"></i>
                      <span className="line-clamp-2">{source.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-slate-800 text-slate-300 p-6 rounded-3xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-blue-400">
                  <i className="fa-solid fa-circle-info"></i>
               </div>
               <h4 className="font-bold text-white">Guía de Uso</h4>
            </div>
            <p className="text-sm leading-relaxed">
              Esta herramienta permite estimar cuánto debes cobrar o pagar basándote en la diferencia entre el mercado paralelo y el oficial. 
              Utiliza el botón de <span className="text-blue-400 font-bold underline">Gemini</span> para consultar la web y rellenar las tasas del momento automáticamente.
            </p>
          </div>
        </div>

      </div>
      
      {/* Sticky footer for mobile */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-3 text-center text-xs text-slate-400 lg:hidden">
        Calculadora de Divisas v1.0 • Impulsado por Gemini 3
      </footer>
    </div>
  );
};

export default App;
