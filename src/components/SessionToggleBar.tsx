import React from 'react';
import { 
  MapPin, 
  Layers, 
  RotateCcw, 
  Users, 
  Compass, 
  UtensilsCrossed, 
  BedDouble,
  Check
} from 'lucide-react';
import { SessionFilter, DashboardDataset } from '../types';

interface SessionToggleBarProps {
  currentSession: SessionFilter;
  onSelectSession: (session: SessionFilter) => void;
  rawDataset: DashboardDataset;
  filteredDataset: DashboardDataset;
}

export const SessionToggleBar: React.FC<SessionToggleBarProps> = ({
  currentSession,
  onSelectSession,
  rawDataset,
  filteredDataset,
}) => {
  const sessions = [
    {
      id: 'all' as SessionFilter,
      label: '全部場次',
      shortLabel: '全部',
      count: rawDataset.summary.totalParticipants,
      pct: '100%',
      icon: Layers,
      color: 'border-[#D9D4C7]',
    },
    {
      id: 'taitung' as SessionFilter,
      label: '臺東場（主場）',
      shortLabel: '臺東主場',
      count: rawDataset.summary.taitungMainCount,
      pct: '51.6%',
      icon: MapPin,
      color: 'border-[#5A6355]',
    },
    {
      id: 'hualien' as SessionFilter,
      label: '花蓮場（副場）',
      shortLabel: '花蓮副場',
      count: rawDataset.summary.hualienSubCount,
      pct: '37.1%',
      icon: MapPin,
      color: 'border-[#A87B52]',
    },
    {
      id: 'seminar' as SessionFilter,
      label: '僅參與座談',
      shortLabel: '僅座談',
      count: rawDataset.summary.seminarOnlyCount,
      pct: '11.3%',
      icon: Compass,
      color: 'border-[#8C8273]',
    },
  ];

  return (
    <div className="bg-[#F9F8F5] border border-[#D9D4C7] rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title & Description */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center shrink-0 border border-[#D9D4C7]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A87B52] bg-[#F4ECE3] px-2 py-0.5 rounded border border-[#D9D4C7]">
                場次切換篩選器
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2C332B]">
                國家防災日主活動 - 參與場次調查
              </h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-0.5">
              點擊切換場次，即時聯動過濾全站大盤、合心區、交通、膳食與安單數據
            </p>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-[#EBE9E1] p-1.5 rounded-xl border border-[#D9D4C7]">
          {sessions.map((s) => {
            const isSelected = currentSession === s.id;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                id={`session-toggle-${s.id}`}
                onClick={() => onSelectSession(s.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5A6355] text-white shadow-xs'
                    : 'text-[#5A6355] hover:bg-[#E9E6DF] hover:text-[#2C332B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F4F1EA]' : 'text-[#8C8273]'}`} />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.shortLabel}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-[#3F493B] text-white'
                      : 'bg-white text-[#7A7568] border border-[#D9D4C7]'
                  }`}
                >
                  {s.count}人
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Notification Bar */}
      {currentSession !== 'all' && (
        <div className="mt-3.5 pt-3 border-t border-[#E8E4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-[#5A6355] flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E9E6DF] font-bold text-[#2C332B] border border-[#D9D4C7]">
              <Check className="w-3 h-3 text-[#5A6355]" />
              目前過濾場次：{sessions.find(s => s.id === currentSession)?.label}
            </span>
            <span className="text-[#7A7568]">
              （出席人員: <strong className="text-[#2C332B]">{filteredDataset.summary.totalParticipants} 位</strong> · 
              男: {filteredDataset.summary.maleCount} / 女: {filteredDataset.summary.femaleCount} · 
              膳食: {filteredDataset.summary.totalMealsPlanned} 餐 · 
              安單最高: {filteredDataset.summary.maxDailyLodging} 人）
            </span>
          </div>

          <button
            onClick={() => onSelectSession('all')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#F4F1EA] text-[#5A6355] hover:text-[#2C332B] border border-[#D9D4C7] font-medium text-xs transition-colors shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3 text-[#8C8273]" />
            重設顯示全部
          </button>
        </div>
      )}
    </div>
  );
};
