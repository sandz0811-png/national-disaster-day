import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  Printer, 
  Database,
  ExternalLink,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { DashboardDataset } from '../types';

interface HeaderProps {
  data: DashboardDataset;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  onRefresh,
  isRefreshing,
  onOpenSyncModal,
}) => {
  const handlePrint = () => {
    window.print();
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Event Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#5A6355] flex items-center justify-center text-[#F4F1EA] shadow-md shadow-[#2C332B]/10 shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#F4F1EA]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-serif italic tracking-wide bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]">
                  2025 國家防災日主演練
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#7A7568]">
                  <Calendar className="w-3.5 h-3.5 text-[#8C8273]" />
                  09/15 (二) ~ 09/18 (五)
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#7A7568]">
                  <MapPin className="w-3.5 h-3.5 text-[#8C8273]" />
                  臺東 (主場) / 花蓮 (副場) / 玉里座談
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#2C332B] mt-0.5">
                慈濟全台防救災團隊 <span className="text-[#A87B52] font-normal text-lg sm:text-xl">活動與後勤調度儀表板</span>
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            {/* Live Data Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBE9E1] border border-[#D9D4C7] text-xs text-[#5A6355]">
              <span className="w-2 h-2 rounded-full bg-[#5A6355] animate-pulse"></span>
              <Clock className="w-3.5 h-3.5 text-[#8C8273]" />
              <span className="hidden sm:inline">資料已同步:</span>
              <span className="font-mono font-medium text-[#2C332B]">{data.lastUpdated}</span>
            </div>

            {/* Refresh Button */}
            <button
              id="btn-refresh-data"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E9E6DF] hover:bg-[#D9D4C7] text-[#2C332B] text-xs font-medium transition-colors disabled:opacity-50 border border-[#D9D4C7]"
              title="從 Google Sheet 重新讀取"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#5A6355]' : 'text-[#5A6355]'}`} />
              <span>{isRefreshing ? '同步中...' : '重新整理'}</span>
            </button>

            {/* Google Sheets Link & Raw Data Modal */}
            <button
              id="btn-open-sync-modal"
              onClick={onOpenSyncModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0EEE8] hover:bg-[#E2DDD1] text-[#5A6355] border border-[#D9D4C7] text-xs font-medium transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#5A6355]" />
              <span className="hidden sm:inline">試算表來源</span>
              <span className="sm:hidden">來源</span>
            </button>

            {/* Export CSV */}
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2C332B] hover:bg-[#3F493B] text-[#F4F1EA] text-xs font-medium transition-colors shadow-xs"
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
      </div>
    </header>
  );
};
