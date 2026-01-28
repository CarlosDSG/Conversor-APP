
import React from 'react';

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: string;
  placeholder: string;
  suffix?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, icon, placeholder, suffix }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-sm font-semibold text-slate-600 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <i className={icon}></i>
        </div>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm text-lg font-medium"
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-400 text-sm font-bold">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
