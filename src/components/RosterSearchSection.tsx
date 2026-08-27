import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Car, 
  BedDouble, 
  Compass, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Download,
  Building,
  Calendar
} from 'lucide-react';
import { DashboardDataset, ParticipantRoster } from '../types';

interface RosterSearchSectionProps {
  data: DashboardDataset;
}

export const RosterSearchSection: React.FC<RosterSearchSectionProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedLodging, setSelectedLodging] = useState<'all' | 'lodging' | 'no-lodging'>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRoster | null>(null);

  // Extract unique filter options
  const regions = useMemo(() => {
    return Array.from(new Set(data.participants.map(p => p.region))).filter(Boolean);
  }, [data.participants]);

  const functionalGroups = useMemo(() => {
    return Array.from(new Set(data.participants.map(p => p.functionalGroup))).filter(Boolean);
  }, [data.participants]);

  // Filtered List
  const filteredParticipants = useMemo(() => {
    return data.participants.filter(p => {
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
      if (selectedGroup !== 'all' && p.functionalGroup !== selectedGroup) return false;
      if (selectedVenue !== 'all' && !p.venue.includes(selectedVenue)) return false;
      
      if (selectedLodging === 'lodging') {
        if (!p.stay915 && !p.stay916 && !p.stay917) return false;
      } else if (selectedLodging === 'no-lodging') {
        if (p.stay915 || p.stay916 || p.stay917) return false;
      }

      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const match = 
          p.name.toLowerCase().includes(term) ||
          p.region.toLowerCase().includes(term) ||
          p.functionalGroup.toLowerCase().includes(term) ||
          p.roommatePreference.toLowerCase().includes(term) ||
          p.transport.toLowerCase().includes(term);
        if (!match) return false;
      }

      return true;
    });
  }, [data.participants, selectedRegion, selectedGroup, selectedVenue, selectedLodging, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Header */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">人員名冊快速檢索與調度卡片</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              可依姓名、合心區、功能組、主副場次、交通自駕/共乘及安單日期即時查詢
            </p>
          </div>

          {/* Result Count */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-white text-[#2C332B] border border-[#D9D4C7] font-semibold">
              符合條件: <strong className="text-[#5A6355] font-bold">{filteredParticipants.length}</strong> / 62 位
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <input
              type="text"
              placeholder="搜尋姓名/室友/交通..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#D9D4C7] bg-white text-xs text-[#2C332B] focus:outline-none focus:ring-2 focus:ring-[#5A6355]"
            />
            <Search className="w-4 h-4 text-[#8C8273] absolute left-2.5 top-2.5" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-[#8C8273] hover:text-[#2C332B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Select */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D9D4C7] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5A6355] text-[#2C332B]"
            >
              <option value="all">所有合心區 (全部)</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Functional Group Select */}
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D9D4C7] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5A6355] text-[#2C332B]"
            >
              <option value="all">所有功能組 (全部)</option>
              {functionalGroups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Venue Select */}
          <div>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D9D4C7] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5A6355] text-[#2C332B]"
            >
              <option value="all">所有活動場次</option>
              <option value="臺東">臺東場（主場）</option>
              <option value="花蓮">花蓮場（副場）</option>
              <option value="僅參與">僅座談</option>
            </select>
          </div>

          {/* Lodging Status */}
          <div>
            <select
              value={selectedLodging}
              onChange={(e) => setSelectedLodging(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-[#D9D4C7] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5A6355] text-[#2C332B]"
            >
              <option value="all">安單狀態 (不限)</option>
              <option value="lodging">有安單需求 (9/15-17)</option>
              <option value="no-lodging">無需安單 / 當日往返</option>
            </select>
          </div>

        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-[#F9F8F5] rounded-xl border border-[#D9D4C7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D9D4C7] text-xs">
            <thead className="bg-[#EBE9E1] text-[#5A6355] font-semibold">
              <tr>
                <th className="py-3 px-3 text-left">#</th>
                <th className="py-3 px-3 text-left">姓名</th>
                <th className="py-3 px-3 text-left">性別</th>
                <th className="py-3 px-3 text-left">合心區</th>
                <th className="py-3 px-3 text-left">功能組</th>
                <th className="py-3 px-3 text-left">演練場次</th>
                <th className="py-3 px-3 text-left">去回程交通</th>
                <th className="py-3 px-3 text-left">安單天數與會場</th>
                <th className="py-3 px-3 text-left">指定室友</th>
                <th className="py-3 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D8] bg-white text-[#2C332B]">
              {filteredParticipants.map((p, index) => {
                const hasLodging = p.stay915 || p.stay916 || p.stay917;

                return (
                  <tr 
                    key={p.id}
                    className="hover:bg-[#F4F1EA]/80 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-[#8C8273] font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#2C332B] flex items-center gap-1.5">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.gender === '女' ? 'bg-[#F4ECE3] text-[#A87B52]' : 'bg-[#E9E6DF] text-[#5A6355]'
                      }`}>
                        {p.gender}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#2C332B]">{p.region}</td>
                    <td className="py-2.5 px-3 text-[#2C332B]">
                      <span className="px-2 py-0.5 rounded bg-[#F0EEE8] text-[#5A6355] text-[11px] border border-[#D9D4C7]">
                        {p.functionalGroup}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.venue.includes('臺東') 
                          ? 'bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]' 
                          : p.venue.includes('花蓮') 
                          ? 'bg-[#F4ECE3] text-[#A87B52] border border-[#D9D4C7]' 
                          : 'bg-[#F0EEE8] text-[#7A7568]'
                      }`}>
                        {p.venue}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[#2C332B]">
                        {p.transport.includes('開車') ? '🚗 自駕' : p.transport.includes('共乘') ? '👥 共乘' : p.transport.includes('臺鐵') ? '🚆 臺鐵' : p.transport}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {hasLodging ? (
                        <div className="flex items-center gap-1 font-mono">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                            p.lodgingVenue === '東' ? 'bg-[#E9E6DF] text-[#5A6355]' : 'bg-[#F4ECE3] text-[#A87B52]'
                          }`}>
                            {p.lodgingVenue === '東' ? '臺東' : '花蓮'}
                          </span>
                          <span className={`px-1 py-0.2 rounded text-[10px] ${p.stay915 ? 'bg-[#5A6355] text-white font-bold' : 'text-[#A6A095]'}`}>
                            15
                          </span>
                          <span className={`px-1 py-0.2 rounded text-[10px] ${p.stay916 ? 'bg-[#5A6355] text-white font-bold' : 'text-[#A6A095]'}`}>
                            16
                          </span>
                          <span className={`px-1 py-0.2 rounded text-[10px] ${p.stay917 ? 'bg-[#5A6355] text-white font-bold' : 'text-[#A6A095]'}`}>
                            17
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#8C8273] text-[11px]">無安單</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#2C332B] font-medium">
                      {p.roommatePreference}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedParticipant(p)}
                        className="px-2.5 py-1 rounded bg-[#E9E6DF] hover:bg-[#5A6355] hover:text-white text-[#5A6355] text-[11px] font-medium transition-colors border border-[#D9D4C7]"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C332B]/60 backdrop-blur-xs">
          <div className="bg-[#F9F8F5] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D9D4C7] space-y-4">
            
            <div className="flex items-start justify-between border-b border-[#E8E4D8] pb-3">
              <div>
                <span className="text-xs font-bold text-[#5A6355] uppercase tracking-wider">防救災團隊人員詳細檔案</span>
                <h3 className="text-xl font-serif font-bold text-[#2C332B] mt-0.5 flex items-center gap-2">
                  {selectedParticipant.name}
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedParticipant.gender === '女' ? 'bg-[#F4ECE3] text-[#A87B52]' : 'bg-[#E9E6DF] text-[#5A6355]'
                  }`}>
                    {selectedParticipant.gender}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#E9E6DF] flex items-center justify-center text-[#7A7568] border border-[#D9D4C7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-[#D9D4C7]">
                <span className="text-[#7A7568] block">所屬合心區</span>
                <strong className="text-[#2C332B] text-sm font-bold mt-0.5 block">{selectedParticipant.region}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#D9D4C7]">
                <span className="text-[#7A7568] block">指派功能組別</span>
                <strong className="text-[#2C332B] text-sm font-bold mt-0.5 block">{selectedParticipant.functionalGroup}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#D9D4C7]">
                <span className="text-[#7A7568] block">國家防災日主活動場次</span>
                <strong className="text-[#2C332B] font-semibold mt-0.5 block">{selectedParticipant.venue}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#D9D4C7]">
                <span className="text-[#7A7568] block">玉里綜合座談意願</span>
                <strong className="text-[#2C332B] font-semibold mt-0.5 block">{selectedParticipant.seminarAttendance}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#D9D4C7]">
                <span className="text-[#7A7568] block">去回程交通調度</span>
                <strong className="text-[#2C332B] font-semibold mt-0.5 block">{selectedParticipant.transport}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#D9D4C7]">
                <span className="text-[#7A7568] block">指定同房室友</span>
                <strong className="text-[#2C332B] font-semibold mt-0.5 block">{selectedParticipant.roommatePreference}</strong>
              </div>
            </div>

            {/* Lodging Days Details */}
            <div className="p-3 rounded-lg bg-[#E9E6DF] border border-[#D9D4C7] text-xs">
              <span className="text-[#5A6355] font-bold block mb-1.5">安單住宿日程安排</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  selectedParticipant.stay915 ? 'bg-[#5A6355] text-white' : 'bg-white text-[#A6A095] line-through border border-[#D9D4C7]'
                }`}>
                  9/15 (二)
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  selectedParticipant.stay916 ? 'bg-[#5A6355] text-white' : 'bg-white text-[#A6A095] line-through border border-[#D9D4C7]'
                }`}>
                  9/16 (三)
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  selectedParticipant.stay917 ? 'bg-[#5A6355] text-white' : 'bg-white text-[#A6A095] line-through border border-[#D9D4C7]'
                }`}>
                  9/17 (四)
                </span>
                {selectedParticipant.lodgingVenue && (
                  <span className="ml-auto text-[#2C332B] font-serif font-bold">
                    宿舍會館: {selectedParticipant.lodgingVenue === '東' ? '臺東場宿舍' : '花蓮場宿舍'}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="px-4 py-2 rounded-lg bg-[#5A6355] hover:bg-[#3F493B] text-white text-xs font-medium transition-colors"
              >
                關閉
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
