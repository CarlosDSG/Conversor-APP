
import React, { useState, useMemo } from 'react';
import InputGroup from './components/InputGroup';
import ResultCard from './components/ResultCard';
import { CalculationInputs } from './types';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    precioUsd: '',
    tasaDia: '',
    tasaBcv: ''
  });

  const results = useMemo(() => {
    const usd = parseFloat(inputs.precioUsd) || 0;
    const tDia = parseFloat(inputs.tasaDia) || 0;
    const tBcv = parseFloat(inputs.tasaBcv) || 0;

    const montoBs = usd * tDia;
    const montoBcvUsd = tBcv > 0 ? montoBs / tBcv : 0;
    const brecha = tBcv > 0 ? ((tDia - tBcv) / tBcv) * 100 : 0;

    return {
      montoBolivares: montoBs,
      montoBcvUsd: montoBcvUsd,
      brecha: brecha
    };
  }, [inputs]);

  const handleInputChange = (field: keyof CalculationInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const clearInputs = () => {
    setInputs({
      precioUsd: '',
      tasaDia: '',
      tasaBcv: ''
    });
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
                Calculadora de Divisas
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

            <div className="relative">
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
              
              {/* Sutil Brecha Cambiaria */}
              {results.brecha !== 0 && (
                <div className="flex justify-center -mt-2 mb-4">
                  <div className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2 animate-fade-in">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brecha Cambiaria:</span>
                    <span className={`text-xs font-bold ${results.brecha > 15 ? 'text-red-500' : 'text-amber-600'}`}>
                      {results.brecha.toFixed(2)}%
                    </span>
                    <i className={`fa-solid ${results.brecha > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px] opacity-50`}></i>
                  </div>
                </div>
              )}
            </div>
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

          {/* Info Card */}
          <div className="bg-slate-800 text-slate-300 p-6 rounded-3xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-blue-400">
                  <i className="fa-solid fa-circle-info"></i>
               </div>
               <h4 className="font-bold text-white">Guía de Uso</h4>
            </div>
            <p className="text-sm leading-relaxed">
              Esta herramienta permite estimar cuánto debes cobrar o pagar basándote en la diferencia entre el mercado paralelo y el oficial. Ingresa manualmente el precio y las tasas vigentes para obtener los resultados al instante.
            </p>
          </div>
        </div>

      </div>
      
      {/* Sticky footer for mobile */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-3 text-center text-xs text-slate-400 lg:hidden">
        Calculadora de Divisas v1.1
      </footer>
    </div>
  );
};

export default App;
