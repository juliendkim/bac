import React, { useState, useMemo } from 'react';
import { Beer, User, Scale, Clock, AlertTriangle, Info, RefreshCcw, ShieldAlert, Wine, GlassWater, Gavel, ChevronDown, Octagon, Code } from 'lucide-react';

// 주종별 표준 데이터 정의 (ml per glass, ABV)
const DRINK_TYPES = {
  somaek: { name: '소맥', mlPerGlass: 200, defaultAbv: 7.0, icon: Beer },
  soju: { name: '소주', mlPerGlass: 50, defaultAbv: 16.5, icon: Wine },
  beer: { name: '맥주', mlPerGlass: 200, defaultAbv: 4.5, icon: Beer },
  makgeolli: { name: '막걸리', mlPerGlass: 250, defaultAbv: 6.0, icon: GlassWater },
  liquor: { name: '양주', mlPerGlass: 30, defaultAbv: 40.0, icon: Wine },
};

export default function App() {
  const [weight, setWeight] = useState(80);
  const [gender, setGender] = useState('male');
  const [drinkKey, setDrinkKey] = useState('somaek');
  const [glassCount, setGlassCount] = useState(10);
  const [customAbv, setCustomAbv] = useState(Math.round(DRINK_TYPES.somaek.defaultAbv));
  const [hours, setHours] = useState(0);

  const resetData = () => {
    setWeight(80);
    setGender('male');
    setGlassCount(10);
    handleDrinkChange('somaek');
    setHours(0);
  };

  const handleWeightChange = (val) => {
    const num = Number(val);
    setWeight(num > 150 ? 150 : num);
  };

  const handleGlassChange = (val) => {
    const num = Number(val);
    setGlassCount(num > 30 ? 30 : num);
  };

  const handleAbvChange = (val) => {
    const num = Number(val);
    setCustomAbv(num > 70 ? 70 : num);
  };

  const handleDrinkChange = (key) => {
    setDrinkKey(key);
    setCustomAbv(Math.round(DRINK_TYPES[key].defaultAbv));
  };

  const r = gender === 'male' ? 0.7 : 0.6;

  // 위드마크 공식에 의한 혈중알코올농도(BAC) 계산
  const result = useMemo(() => {
    const safeWeight = Math.max(35, weight);
    const safeGlass = Math.max(1, glassCount);
    const safeAbv = Math.max(1, customAbv);
    const selectedDrink = DRINK_TYPES[drinkKey];
    const totalVolume = safeGlass * selectedDrink.mlPerGlass;
    const alcoholGrams = totalVolume * (safeAbv / 100) * 0.7894;
    let bac = (alcoholGrams / (safeWeight * r)) * 0.1;
    const reduction = hours * 0.015;
    return Math.max(0, bac - reduction);
  }, [weight, drinkKey, glassCount, customAbv, hours, r]);

  const getStatus = (bac) => {
    if (bac <= 0) return { label: '정상', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800', accent: 'bg-green-500', icon: ShieldAlert, desc: '혈중 알코올이 검출되지 않습니다.' };
    if (bac < 0.03) return { label: '훈방', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', accent: 'bg-blue-500', icon: Info, desc: '법적 단속 기준(0.03%) 미만입니다.' };
    if (bac < 0.08) return { label: '면허정지', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800', accent: 'bg-orange-500', icon: AlertTriangle, desc: '100일간 면허 정지 (0.03%~0.08%)' };
    return { label: '면허취소', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800', accent: 'bg-red-600', icon: Octagon, desc: '면허 취소 및 결격 사유 발생 (0.08% 이상)' };
  };

  const status = getStatus(result);

  const maxScale = 0.2;
  const pointerPosition = Math.min(100, (result / maxScale) * 100);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-0 sm:p-6 md:p-8 font-sans transition-colors duration-500">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300 border border-transparent dark:border-slate-800">
        
        <div className="flex-1 p-6 sm:p-10 space-y-8 bg-white dark:bg-slate-900">
          <header className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-slate-900 dark:bg-slate-800 rounded-xl">
                  <Beer className="text-yellow-400" size={24} />
                </div>
                Am I sober?
              </h1>
              <button 
                onClick={resetData}
                className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all group shadow-sm"
                title="데이터 초기화"
              >
                <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </header>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Scale size={14} /> 체중 (35-150)
                </label>
                <input 
                  type="number" min="35" max="150" value={weight} 
                  onChange={(e) => handleWeightChange(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none transition-all font-bold text-lg dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> 성별
                </label>
                <div className="flex bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 rounded-2xl h-[54px]">
                  <button 
                    onClick={() => setGender('male')} 
                    className={`flex-1 rounded-xl transition-all font-black text-[13px] uppercase tracking-wider ${
                      gender === 'male' 
                        ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    남성
                  </button>
                  <button 
                    onClick={() => setGender('female')} 
                    className={`flex-1 rounded-xl transition-all font-black text-[13px] uppercase tracking-wider ${
                      gender === 'female' 
                        ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    여성
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">주종 선택</label>
              <div className="grid grid-cols-5 w-full gap-2">
                {Object.entries(DRINK_TYPES).map(([key, data]) => (
                  <button
                    key={key} onClick={() => handleDrinkChange(key)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all w-full ${
                      drinkKey === key 
                        ? 'border-slate-900 dark:border-blue-500 bg-slate-900 dark:bg-blue-600 text-white shadow-lg scale-105' 
                        : 'border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <data.icon size={18} />
                    <span className="text-[10px] font-black whitespace-nowrap">{data.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">음주량 (1-30)</label>
                <div className="relative group">
                  <input type="number" min="1" max="30" value={glassCount} onChange={(e) => handleGlassChange(e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-lg dark:text-white" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">잔</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-blue-500">도수 (1-70%)</label>
                <div className="relative group">
                  <input type="number" min="1" max="70" value={customAbv} onChange={(e) => handleAbvChange(e.target.value)} className="w-full p-3.5 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl outline-none font-bold text-lg text-blue-600 dark:text-blue-400" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-300">%</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                  <Clock size={14} /> 경과
                </label>
                <input 
                  type="range" min="0" max="5" step="0.5" value={hours} 
                  onChange={(e) => setHours(Number(e.target.value))} 
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-blue-500" 
                />
                <span className="text-sm font-black text-slate-900 dark:text-white shrink-0 min-w-[60px] text-right">
                  {hours} <span className="text-[10px] font-bold text-slate-400">hrs</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 분석 결과 대시보드 (우측) */}
        <div className="w-full lg:w-[450px] bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 overflow-y-auto">
          <div className="flex-1 space-y-3">
            <div className={`p-4 sm:p-5 rounded-[1.5rem] border-2 shadow-xl transition-all duration-700 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 overflow-hidden relative`}>
              <div className={`absolute top-0 left-0 w-full h-1.5 ${status.accent}`}></div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center gap-3 w-full pt-1">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl sm:text-6xl font-black tabular-nums tracking-tighter ${status.color}`}>
                      {result.toFixed(4)}
                    </span>
                    <span className={`text-xl sm:text-2xl font-black ${status.color} mr-2`}>%</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-lg sm:text-xl font-black text-white ${status.accent} shadow-md flex items-center gap-1.5 transition-all shrink-0`}>
                    <status.icon size={18} />
                    {status.label}
                  </div>
                </div>

                <div className="w-full pt-6 pb-2 px-2 relative">
                  <div className="absolute top-0 flex flex-col items-center transition-all duration-1000 ease-out z-20" style={{ left: `${pointerPosition}%`, transform: 'translateX(-50%)' }}>
                    <ChevronDown className={`${status.color} fill-current animate-bounce`} size={20} />
                  </div>

                  <div className="h-4 w-full rounded-full flex overflow-hidden border-2 border-slate-50 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-inner">
                    <div className="h-full bg-green-400" style={{ width: `${(0.03 / maxScale) * 100}%` }}></div>
                    <div className="h-full bg-orange-400" style={{ width: `${((0.08 - 0.03) / maxScale) * 100}%` }}></div>
                    <div className="h-full bg-red-500" style={{ width: `${((maxScale - 0.08) / maxScale) * 100}%` }}></div>
                  </div>

                  <div className="relative w-full mt-2 h-6">
                    <div className="absolute left-0 text-[10px] font-bold text-slate-400">
                      <div className="w-px h-1.5 bg-slate-300 dark:bg-slate-700 mb-1 mx-auto"></div>
                      <span>0.00</span>
                    </div>
                    <div className="absolute text-[10px] font-black text-orange-600 dark:text-orange-400" style={{ left: `${(0.03 / maxScale) * 100}%`, transform: 'translateX(-50%)' }}>
                      <div className="w-px h-2 bg-orange-400 mb-1 mx-auto"></div>
                      <div className="flex items-center gap-0.5 whitespace-nowrap">
                        <AlertTriangle size={10} />
                        <span>정지(0.03)</span>
                      </div>
                    </div>
                    <div className="absolute text-[10px] font-black text-red-600 dark:text-red-400" style={{ left: `${(0.08 / maxScale) * 100}%`, transform: 'translateX(-50%)' }}>
                      <div className="w-px h-2 bg-red-500 mb-1 mx-auto"></div>
                      <div className="flex items-center gap-0.5 whitespace-nowrap">
                        <Octagon size={10} />
                        <span>취소(0.08)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50 dark:border-slate-700 w-full text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic">{status.desc}</p>
                </div>
              </div>
            </div>

            {/* 법적 고지 섹션 */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-[1rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-start gap-3 text-left">
                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl shrink-0">
                  <Gavel className="text-amber-600 dark:text-amber-400" size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Legal Notice</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed font-sans">
                    본 시뮬레이션은 도로교통법 제44조 기준 위드마크 공식 기반 <strong>추정치</strong>일 뿐이며, 법적 증거로 활용될 수 없습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 소스 코드 섹션 */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-[1rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-start gap-3 text-left">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl shrink-0">
                  <Code className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Source Code</h4>
                  <a 
                    href="https://github.com/juliendkim/am-i-sober" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1"
                  >
                    https://github.com/juliendkim/am-i-sober
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}