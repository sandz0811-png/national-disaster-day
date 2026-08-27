import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  Printer, 
  Database,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Compass,
  RotateCcw
} from 'lucide-react';
import { DashboardDataset, SessionFilter } from '../types';

interface HeaderProps {
  data: DashboardDataset;
  rawDataset: DashboardDataset;
  selectedSession: SessionFilter;
  onSelectSession: (session: SessionFilter) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  rawDataset,
  selectedSession,
  onSelectSession,
  onRefresh,
  isRefreshing,
  onOpenSyncModal,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const sessions = [
    {
      id: 'all' as SessionFilter,
      label: '全部場次',
      count: rawDataset.summary.totalParticipants,
      icon: Layers,
    },
    {
      id: 'taitung' as SessionFilter,
      label: '臺東場（主場）',
      count: rawDataset.summary.taitungMainCount,
      icon: MapPin,
    },
    {
      id: 'hualien' as SessionFilter,
      label: '花蓮場（副場）',
      count: rawDataset.summary.hualienSubCount,
      icon: MapPin,
    },
    {
      id: 'seminar' as SessionFilter,
      label: '僅參與座談',
      count: rawDataset.summary.seminarOnlyCount,
      icon: Compass,
    },
  ];

  const handleExportCSV = () => {
    // Generate combined summary CSV
    const csvContent = [
      '慈濟全台防救災團隊活動與後勤調度總表',
      `更新時間: ${data.lastUpdated}`,
      '',
      '=== 合心區統計 ===',
      '合心區,女性,男性,總和',
      ...data.regionStats.map(r => `${r.region},${r.female},${r.male},${r.total}`),
      `總和,${data.summary.femaleCount},${data.summary.maleCount},${data.summary.totalParticipants}`,
      '',
      '=== 功能組統計 ===',
      '功能組,女性,男性,總和',
      ...data.functionStats.map(f => `${f.group},${f.female},${f.male},${f.total}`),
      '',
      '=== 用餐需求 ===',
      '日期,星期,早餐,午餐,晚餐,合計',
      ...data.mealStats.map(m => `${m.date},${m.dayOfWeek},${m.breakfast},${m.lunch},${m.dinner},${m.total}`),
      '',
      '=== 每日安單需求 ===',
      '日期,臺東場,花蓮場,總安單人數',
      ...data.dailyLodgingStats.map(l => `${l.date},${l.taitung},${l.hualien},${l.total}`),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `慈濟防救災團隊_後勤調度報表_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="bg-[#F9F8F5] border-b border-[#D9D4C7] sticky top-0 z-40 shadow-xs print:static">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Title & Action Tools */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand & Event Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A6355] flex items-center justify-center text-[#F4F1EA] shadow-sm shadow-[#2C332B]/10 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#F4F1EA]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-serif italic tracking-wide bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]">
                  2025 國家防災日主演練
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A7568]">
                  <Calendar className="w-3 h-3 text-[#8C8273]" />
                  09/15 (二) ~ 09/18 (五)
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-[#7A7568]">
                  <MapPin className="w-3 h-3 text-[#8C8273]" />
                  臺東 (主場) / 花蓮 (副場) / 玉里座談
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#2C332B] mt-0.5">
                慈濟全台防救災團隊 <span className="text-[#A87B52] font-normal text-base sm:text-lg">活動與後勤調度儀表板</span>
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            {/* Live Data Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#EBE9E1] border border-[#D9D4C7] text-xs text-[#5A6355]">
              <span className="w-2 h-2 rounded-full bg-[#5A6355] animate-pulse"></span>
              <Clock className="w-3 h-3 text-[#8C8273]" />
              <span className="hidden sm:inline">已同步:</span>
              <span className="font-mono font-medium text-[#2C332B]">{data.lastUpdated}</span>
            </div>

            {/* Refresh Button */}
            <button
              id="btn-refresh-data"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E9E6DF] hover:bg-[#D9D4C7] text-[#2C332B] text-xs font-medium transition-colors disabled:opacity-50 border border-[#D9D4C7]"
              title="從 Google Sheet 重新讀取"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#5A6355]' : 'text-[#5A6355]'}`} />
              <span className="hidden sm:inline">{isRefreshing ? '同步中...' : '重新整理'}</span>
            </button>

            {/* Google Sheets Link & Raw Data Modal */}
            <button
              id="btn-open-sync-modal"
              onClick={onOpenSyncModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F0EEE8] hover:bg-[#E2DDD1] text-[#5A6355] border border-[#D9D4C7] text-xs font-medium transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#5A6355]" />
              <span className="hidden sm:inline">試算表來源</span>
              <span className="sm:hidden">來源</span>
            </button>

            {/* Export CSV */}
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C332B] hover:bg-[#3F493B] text-[#F4F1EA] text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#A87B52]" />
              <span>匯出報表</span>
            </button>

            {/* Print */}
            <button
              id="btn-print-page"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D9D4C7] bg-[#F9F8F5] hover:bg-[#E9E6DF] text-[#5A6355] text-xs font-medium transition-colors"
              title="列印或存為 PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Row: Clean Session Toggle inside Header */}
        <div className="mt-2.5 pt-2.5 border-t border-[#E8E4D8] flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-xs font-bold text-[#5A6355] mr-1 shrink-0">
              參與場次:
            </span>
            {sessions.map((s) => {
              const isSelected = selectedSession === s.id;
              const Icon = s.icon;

              return (
                <button
                  key={s.id}
                  id={`header-session-toggle-${s.id}`}
                  onClick={() => onSelectSession(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#5A6355] text-white shadow-xs'
                      : 'bg-[#EBE9E1] text-[#5A6355] hover:bg-[#E9E6DF] hover:text-[#2C332B] border border-[#D9D4C7]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F4F1EA]' : 'text-[#8C8273]'}`} />
                  <span>{s.label}</span>
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

          {selectedSession !== 'all' && (
            <button
              onClick={() => onSelectSession('all')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#E9E6DF] text-[#5A6355] hover:text-[#2C332B] border border-[#D9D4C7] font-medium text-xs transition-colors shrink-0"
              title="重設為全部場次"
            >
              <RotateCcw className="w-3 h-3 text-[#8C8273]" />
              <span className="hidden sm:inline">重設全部</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

