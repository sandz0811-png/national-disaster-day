import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Code,
  FileSpreadsheet
} from 'lucide-react';
import { DashboardDataset } from '../types';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DashboardDataset;
  onRefreshWithUrl: (url: string) => void;
  isRefreshing: boolean;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  data,
  onRefreshWithUrl,
  isRefreshing,
}) => {
  const [customUrl, setCustomUrl] = useState<string>(data.sourceUrl);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'source' | 'json'>('source');

  if (!isOpen) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C332B]/60 backdrop-blur-xs">
      <div className="bg-[#F9F8F5] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#D9D4C7] space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2C332B]">Google 試算表資料來源與同步管理</h3>
              <p className="text-xs text-[#7A7568]">檢視發布網址、手動同步或匯出完整 JSON 結構</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#E9E6DF] flex items-center justify-center text-[#7A7568] border border-[#D9D4C7]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D9D4C7] text-xs">
          <button
            onClick={() => setActiveTab('source')}
            className={`pb-2.5 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'source' ? 'border-[#5A6355] text-[#5A6355]' : 'border-transparent text-[#7A7568] hover:text-[#2C332B]'
            }`}
          >
            試算表連線設定
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'json' ? 'border-[#5A6355] text-[#5A6355]' : 'border-transparent text-[#7A7568] hover:text-[#2C332B]'
            }`}
          >
            原始 JSON 數據結構
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'source' ? (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[#2C332B] mb-1">
                  Google Sheet 已發布之 CSV 網址：
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D9D4C7] text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#5A6355] text-[#2C332B]"
                  />
                  <button
                    onClick={() => onRefreshWithUrl(customUrl)}
                    disabled={isRefreshing}
                    className="px-3.5 py-2 rounded-lg bg-[#5A6355] hover:bg-[#3F493B] text-white font-medium flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    即時讀取
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D9D4C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C332B]">資料集摘要狀態</span>
                  <a
                    href="https://docs.google.com/spreadsheets/d/e/2PACX-1vS5mILW_fqrdU5vKWWsE46zh-Yyc3udoaGXkioyLYQbQKGVapxVzmLtb7SrjtgDvCBwLoy9-qBIE_ht/pub?gid=1325602019&single=true&output=csv"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5A6355] hover:text-[#3F493B] inline-flex items-center gap-1 text-[11px] font-semibold"
                  >
                    在瀏覽器開啟試算表 CSV <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                  <div className="p-2 rounded bg-[#F9F8F5] border border-[#D9D4C7]">
                    <span className="text-[#7A7568] block text-[10px]">總出席名單</span>
                    <strong className="text-[#2C332B] font-bold">{data.summary.totalParticipants} 位</strong>
                  </div>
                  <div className="p-2 rounded bg-[#F9F8F5] border border-[#D9D4C7]">
                    <span className="text-[#7A7568] block text-[10px]">合心區數</span>
                    <strong className="text-[#2C332B] font-bold">{data.regionStats.length} 區</strong>
                  </div>
                  <div className="p-2 rounded bg-[#F9F8F5] border border-[#D9D4C7]">
                    <span className="text-[#7A7568] block text-[10px]">總備餐數</span>
                    <strong className="text-[#2C332B] font-bold">{data.summary.totalMealsPlanned} 餐</strong>
                  </div>
                  <div className="p-2 rounded bg-[#F9F8F5] border border-[#D9D4C7]">
                    <span className="text-[#7A7568] block text-[10px]">房間規劃</span>
                    <strong className="text-[#2C332B] font-bold">{data.roomList.length} 間房</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#E9E6DF] border border-[#D9D4C7] text-[#5A6355] space-y-1">
                <p className="font-semibold text-xs">💡 自動離線容錯機制：</p>
                <p className="text-[11px] leading-relaxed text-[#5A6355]">
                  系統內建高精度離線備援資料庫，即使 Google Sheets API 出現網路延遲或 CORS 阻擋，儀表板各項圖表、膳食數據及男女安單排房皆能 100% 完整運作。
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <button
                  onClick={handleCopyJSON}
                  className="px-2.5 py-1 rounded bg-[#5A6355] hover:bg-[#3F493B] text-white font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-[#E9E6DF]" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已複製' : '複製 JSON'}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-[#2C332B] text-[#F4F1EA] text-[11px] font-mono overflow-x-auto max-h-72">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E8E4D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#5A6355] hover:bg-[#3F493B] text-white font-medium text-xs transition-colors"
          >
            關閉視窗
          </button>
        </div>

      </div>
    </div>
  );
};
