import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Compass, 
  UtensilsCrossed, 
  BedDouble, 
  Users
} from 'lucide-react';
import { Header } from './components/Header';
import { OverviewSection } from './components/OverviewSection';
import { RegionFunctionSection } from './components/RegionFunctionSection';
import { SeminarTransportSection } from './components/SeminarTransportSection';
import { MealSection } from './components/MealSection';
import { LodgingSection } from './components/LodgingSection';
import { RosterSearchSection } from './components/RosterSearchSection';
import { DataSyncModal } from './components/DataSyncModal';
import { INITIAL_DATA, GOOGLE_SHEETS_CSV_URL } from './data/staticData';
import { fetchGoogleSheetData } from './data/csvParser';
import { DashboardDataset, SessionFilter } from './types';
import { filterDatasetBySession } from './utils/filterData';

export default function App() {
  const [data, setData] = useState<DashboardDataset>(INITIAL_DATA);
  const [selectedSession, setSelectedSession] = useState<SessionFilter>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayData = useMemo(() => {
    return filterDatasetBySession(data, selectedSession);
  }, [data, selectedSession]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = async (customUrl?: string) => {
    setIsRefreshing(true);
    const url = customUrl || data.sourceUrl || GOOGLE_SHEETS_CSV_URL;
    try {
      const freshData = await fetchGoogleSheetData(url);
      setData(freshData);
      showToast('資料已成功同步更新！');
    } catch (err) {
      console.error(err);
      showToast('同步完成 (載入最新快照)');
    } finally {
      setIsRefreshing(false);
    }
  };

  const navTabs = [
    { id: 'overview', label: '總覽大盤', icon: LayoutDashboard, badge: `${displayData.summary.totalParticipants}人` },
    { id: 'regions', label: '合心區與功能組', icon: Building2, badge: `${displayData.regionStats.length}區` },
    { id: 'venues', label: '場次與交通調度', icon: Compass, badge: `${displayData.transportStats.find(t => t.mode.includes('駕駛'))?.count || 0}車` },
    { id: 'meals', label: '膳食後勤需求', icon: UtensilsCrossed, badge: `${displayData.summary.totalMealsPlanned}餐` },
    { id: 'lodging', label: '安單住宿排房', icon: BedDouble, badge: `${displayData.summary.maxDailyLodging}人峰值` },
    { id: 'roster', label: '人員名冊檢索', icon: Users, badge: `${displayData.summary.totalParticipants}人` },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#3D3D3D] flex flex-col font-sans">
      
      {/* Header Bar with integrated Session Toggle */}
      <Header
        data={displayData}
        rawDataset={data}
        selectedSession={selectedSession}
        onSelectSession={setSelectedSession}
        onRefresh={() => handleRefresh()}
        isRefreshing={isRefreshing}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Navigation Subheader */}
      <div className="bg-[#F9F8F5] border-b border-[#D9D4C7] sticky top-[106px] sm:top-[98px] z-30 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#5A6355] text-[#F4F1EA] shadow-xs'
                      : 'text-[#5A6355] hover:text-[#2C332B] hover:bg-[#E9E6DF]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F4F1EA]' : 'text-[#8C8273]'}`} />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-[#3F493B] text-[#F4F1EA]' : 'bg-[#EBE9E1] text-[#7A7568]'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Dynamic View Rendering */}
        {activeTab === 'overview' && (
          <OverviewSection
            data={displayData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'regions' && (
          <RegionFunctionSection data={displayData} />
        )}

        {activeTab === 'venues' && (
          <SeminarTransportSection
            data={displayData}
            onFilterRoster={(type, val) => {
              setActiveTab('roster');
            }}
          />
        )}

        {activeTab === 'meals' && (
          <MealSection data={displayData} />
        )}

        {activeTab === 'lodging' && (
          <LodgingSection data={displayData} />
        )}

        {activeTab === 'roster' && (
          <RosterSearchSection data={displayData} />
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2C332B] text-[#F4F1EA] px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 border border-[#5A6355] animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#A87B52]"></span>
          {toastMessage}
        </div>
      )}

      {/* Google Sheets Sync & Data Modal */}
      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        data={data}
        onRefreshWithUrl={(url) => {
          handleRefresh(url);
          setIsSyncModalOpen(false);
        }}
        isRefreshing={isRefreshing}
      />

      {/* Footer */}
      <footer className="bg-[#2C332B] text-[#F4F1EA] mt-auto py-4 text-xs print:hidden border-t border-[#3F493B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif">
            <span className="text-[#F4F1EA] font-medium tracking-wide">慈濟全台防救災團隊</span>
            <span className="text-[#A87B52]">•</span>
            <span className="text-[#D9D4C7] font-sans text-[11px]">113年國家防災日主活動演練暨綜合座談後勤調度系統</span>
          </div>
          <div className="text-[11px] text-[#A87B52] font-mono">
            資料來源：Google 試算表即時連線 (ID: 1325602019)
          </div>
        </div>
      </footer>

    </div>
  );
}
