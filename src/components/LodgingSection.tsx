import React, { useState } from 'react';
import { 
  BedDouble, 
  Calendar, 
  MapPin, 
  Users, 
  UserCheck, 
  Home, 
  Search, 
  Filter, 
  Check, 
  X, 
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { DashboardDataset, RoomRecord, PersonLodgingRecord } from '../types';

interface LodgingSectionProps {
  data: DashboardDataset;
}

export const LodgingSection: React.FC<LodgingSectionProps> = ({ data }) => {
  const [activeDateTab, setActiveDateTab] = useState<'all' | '9/15' | '9/16' | '9/17'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | '男' | '女'>('all');
  const [selectedVenue, setSelectedVenue] = useState<'all' | '東' | '花'>('all');
  const [roomSearchTerm, setRoomSearchTerm] = useState<string>('');

  // Filter room cards
  const filteredRooms = data.roomList.filter((room) => {
    if (selectedGender !== 'all' && room.gender !== selectedGender) return false;
    if (selectedVenue !== 'all' && room.venue !== selectedVenue) return false;
    if (activeDateTab === '9/15' && !room.stay915) return false;
    if (activeDateTab === '9/16' && !room.stay916) return false;
    if (activeDateTab === '9/17' && !room.stay917) return false;

    if (roomSearchTerm.trim() !== '') {
      const term = roomSearchTerm.toLowerCase();
      const matchName = room.roommates.some(r => r.toLowerCase().includes(term)) ||
                        room.person1.toLowerCase().includes(term) ||
                        (room.person2 && room.person2.toLowerCase().includes(term)) ||
                        (room.extraPeople && room.extraPeople.some(p => p.toLowerCase().includes(term))) ||
                        (room.roomNumber && room.roomNumber.toLowerCase().includes(term));
      if (!matchName) return false;
    }

    return true;
  });

  // Get daily list
  const getDailyList = (date: '9/15' | '9/16' | '9/17'): PersonLodgingRecord[] => {
    if (date === '9/15') return data.lodging915;
    if (date === '9/16') return data.lodging916;
    return data.lodging917;
  };

  const currentDailyList = activeDateTab === 'all' 
    ? [...data.lodging915, ...data.lodging916, ...data.lodging917]
    : getDailyList(activeDateTab as '9/15' | '9/16' | '9/17');

  const filteredDailyList = currentDailyList.filter((item) => {
    if (selectedGender !== 'all' && item.gender !== selectedGender) return false;
    if (roomSearchTerm.trim() !== '') {
      const term = roomSearchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.assignedRoommate.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Daily Summary Trend Cards */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
                <BedDouble className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">安單需求統計與每日增量走勢</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              住宿需求隨活動進程遞增：9/15 提前抵達 19人 ➔ 9/16 座談前夕 30人 (+11) ➔ 9/17 演練當夜 32人 (+2)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7] font-semibold">
              <MapPin className="w-3.5 h-3.5" /> 臺東主場宿舍
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F4ECE3] text-[#A87B52] border border-[#D9D4C7] font-semibold">
              <MapPin className="w-3.5 h-3.5" /> 花蓮副場宿舍
            </span>
          </div>
        </div>

        {/* 3 Days Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {data.dailyLodgingStats.map((d, index) => (
            <div 
              key={d.date}
              onClick={() => setActiveDateTab(d.date as any)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeDateTab === d.date 
                  ? 'border-[#5A6355] bg-[#E9E6DF]/70 ring-2 ring-[#5A6355]/20 shadow-xs' 
                  : 'border-[#D9D4C7] bg-white hover:bg-[#F4F1EA]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center font-bold text-xs">
                    {d.date}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#2C332B]">{d.dayName}</h4>
                    <span className="text-[10px] text-[#7A7568]">
                      {index === 0 ? '提前籌備夜' : index === 1 ? '座談綜合夜' : '防災演練夜'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-[#2C332B]">{d.total}</span>
                  <span className="text-xs text-[#7A7568] ml-1">人</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#D9D4C7]/60 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#F9F8F5] border border-[#D9D4C7]">
                  <div className="flex items-center justify-between text-[#7A7568] text-[11px]">
                    <span>臺東場</span>
                    {d.taitungDelta && d.taitungDelta !== '基準日' && (
                      <span className="text-[#5A6355] font-bold">{d.taitungDelta}</span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between">
                    <strong className="text-[#2C332B] font-bold text-sm">{d.taitung}人</strong>
                    <span className="text-[10px] text-[#8C8273]">男{d.taitungMale}/女{d.taitungFemale}</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-[#F9F8F5] border border-[#D9D4C7]">
                  <div className="flex items-center justify-between text-[#7A7568] text-[11px]">
                    <span>花蓮場</span>
                    {d.hualienDelta && d.hualienDelta !== '基準日' && (
                      <span className="text-[#A87B52] font-bold">{d.hualienDelta}</span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between">
                    <strong className="text-[#2C332B] font-bold text-sm">{d.hualien}人</strong>
                    <span className="text-[10px] text-[#8C8273]">男{d.hualienMale}/女{d.hualienFemale}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lodging Matrix Table (Raw table replication) */}
        <div className="overflow-x-auto rounded-lg border border-[#D9D4C7]">
          <table className="min-w-full divide-y divide-[#D9D4C7] text-xs">
            <thead className="bg-[#EBE9E1] text-[#5A6355] font-semibold">
              <tr>
                <th className="py-2.5 px-3 text-left">日期</th>
                <th className="py-2.5 px-3 text-left">說明</th>
                <th className="py-2.5 px-3 text-center bg-[#E9E6DF] text-[#5A6355]">臺東場 (總數)</th>
                <th className="py-2.5 px-3 text-center bg-[#E9E6DF]/60 text-[#5A6355]">臺東 增量</th>
                <th className="py-2.5 px-3 text-center bg-[#F4ECE3] text-[#A87B52]">花蓮場 (總數)</th>
                <th className="py-2.5 px-3 text-center bg-[#F4ECE3]/60 text-[#A87B52]">花蓮 增量</th>
                <th className="py-2.5 px-3 text-right bg-[#EBE9E1] text-[#2C332B] font-bold">全日安單合計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D8] bg-white text-[#2C332B]">
              {data.dailyLodgingStats.map((row) => (
                <tr key={row.date} className="hover:bg-[#F4F1EA]/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2C332B]">{row.date}</td>
                  <td className="py-2.5 px-3 text-[#7A7568]">{row.dayName}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#5A6355] bg-[#E9E6DF]/30">
                    {row.taitung} 人 <span className="text-[10px] text-[#8C8273] font-normal">(男{row.taitungMale}/女{row.taitungFemale})</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-[#5A6355]">
                    {row.taitungDelta || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#A87B52] bg-[#F4ECE3]/30">
                    {row.hualien} 人 <span className="text-[10px] text-[#8C8273] font-normal">(男{row.hualienMale}/女{row.hualienFemale})</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-[#A87B52]">
                    {row.hualienDelta || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-serif font-bold text-[#2C332B] bg-[#E9E6DF]/40 text-sm">
                    {row.total} 人
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Interactive Room Allocation Visualizer & Room Cards */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">房間分配與指定室友矩陣 (女房 9 間 / 男房 13 間)</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              依性別、會場與指定室友精確排房，綠色標記為當日入住
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Filter */}
            <div className="flex rounded-lg border border-[#D9D4C7] p-0.5 bg-[#EBE9E1] text-xs">
              <button
                onClick={() => setActiveDateTab('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDateTab === 'all' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#5A6355] hover:text-[#2C332B]'
                }`}
              >
                全期 (9/15-17)
              </button>
              <button
                onClick={() => setActiveDateTab('9/15')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDateTab === '9/15' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#5A6355] hover:text-[#2C332B]'
                }`}
              >
                9/15 (提前)
              </button>
              <button
                onClick={() => setActiveDateTab('9/16')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDateTab === '9/16' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#5A6355] hover:text-[#2C332B]'
                }`}
              >
                9/16 (座談)
              </button>
              <button
                onClick={() => setActiveDateTab('9/17')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDateTab === '9/17' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#5A6355] hover:text-[#2C332B]'
                }`}
              >
                9/17 (演練)
              </button>
            </div>

            {/* Gender Filter */}
            <div className="flex rounded-lg border border-[#D9D4C7] p-0.5 bg-[#EBE9E1] text-xs">
              <button
                onClick={() => setSelectedGender('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGender === 'all' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#5A6355] hover:text-[#2C332B]'
                }`}
              >
                男女全體
              </button>
              <button
                onClick={() => setSelectedGender('女')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGender === '女' ? 'bg-[#A87B52] text-white font-bold shadow-xs' : 'text-[#A87B52] hover:text-[#7A5636]'
                }`}
              >
                女房 (9間)
              </button>
              <button
                onClick={() => setSelectedGender('男')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGender === '男' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#5A6355] hover:text-[#2C332B]'
                }`}
              >
                男房 (13間)
              </button>
            </div>

            {/* Venue Filter */}
            <div className="flex rounded-lg border border-[#D9D4C7] p-0.5 bg-[#EBE9E1] text-xs">
              <button
                onClick={() => setSelectedVenue('all')}
                className={`px-2 py-1 rounded-md ${selectedVenue === 'all' ? 'bg-[#5A6355] text-white font-bold shadow-xs' : 'text-[#7A7568]'}`}
              >
                全場次
              </button>
              <button
                onClick={() => setSelectedVenue('東')}
                className={`px-2 py-1 rounded-md ${selectedVenue === '東' ? 'bg-[#E9E6DF] text-[#5A6355] font-bold' : 'text-[#7A7568]'}`}
              >
                臺東場
              </button>
              <button
                onClick={() => setSelectedVenue('花')}
                className={`px-2 py-1 rounded-md ${selectedVenue === '花' ? 'bg-[#F4ECE3] text-[#A87B52] font-bold' : 'text-[#7A7568]'}`}
              >
                花蓮場
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋姓名或房號..."
                value={roomSearchTerm}
                onChange={(e) => setRoomSearchTerm(e.target.value)}
                className="pl-7 pr-2.5 py-1.5 rounded-lg border border-[#D9D4C7] bg-white text-xs text-[#2C332B] focus:outline-none focus:ring-2 focus:ring-[#5A6355] w-36 sm:w-44"
              />
              <Search className="w-3.5 h-3.5 text-[#8C8273] absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const isFemale = room.gender === '女';

            return (
              <div 
                key={room.id}
                className={`p-4 rounded-xl border transition-all bg-white ${
                  isFemale 
                    ? 'border-[#D9D4C7] hover:border-[#A87B52]' 
                    : 'border-[#D9D4C7] hover:border-[#5A6355]'
                } hover:shadow-xs`}
              >
                {/* Room Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isFemale ? 'bg-[#F4ECE3] text-[#A87B52] border border-[#D9D4C7]' : 'bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]'
                    }`}>
                      {room.roomNumber}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      room.venue === '東' ? 'bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]' : 'bg-[#F4ECE3] text-[#A87B52] border border-[#D9D4C7]'
                    }`}>
                      {room.venueName}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C8273] font-mono">{room.gender}生房</span>
                </div>

                {/* Roommates Name List */}
                <div className="space-y-1.5 my-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${isFemale ? 'bg-[#A87B52]' : 'bg-[#5A6355]'}`} />
                    <span className="font-bold text-[#2C332B]">{room.person1}</span>
                    {room.person2 && <span className="text-[#8C8273]">搭檔</span>}
                    {room.person2 && (
                      <span className="font-bold text-[#2C332B]">{room.person2}</span>
                    )}
                  </div>

                  {/* Extra Roommates if any */}
                  {room.extraPeople && room.extraPeople.length > 0 && (
                    <div className="pl-4 text-[11px] text-[#7A7568] flex flex-wrap gap-1">
                      <span>協調同住:</span>
                      {room.extraPeople.map(p => (
                        <span key={p} className="px-1.5 py-0.2 rounded bg-[#E9E6DF] text-[#5A6355] font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {!room.person2 && !room.extraPeople && (
                    <div className="pl-4 text-[11px] text-[#8C8273] italic">
                      單人指定 / 待大會視情況安排同住
                    </div>
                  )}
                </div>

                {/* Stay Dates Indicators */}
                <div className="pt-3 border-t border-[#E8E4D8] flex items-center justify-between text-xs">
                  <span className="text-[#7A7568] text-[11px]">入住日期:</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      room.stay915 ? 'bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]' : 'bg-[#F0EEE8] text-[#A6A095] line-through'
                    }`}>
                      9/15
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      room.stay916 ? 'bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]' : 'bg-[#F0EEE8] text-[#A6A095] line-through'
                    }`}>
                      9/16
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      room.stay917 ? 'bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7]' : 'bg-[#F0EEE8] text-[#A6A095] line-through'
                    }`}>
                      9/17
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="p-8 text-center text-[#8C8273] text-xs">
            查無符合篩選條件的房間資料
          </div>
        )}
      </div>

      {/* 3. Detailed Daily Roster & Designated Roommate Roster */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#E8E4D8] pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-[#2C332B] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#5A6355]" />
              安單調查名冊與指定室友互指確認表
            </h3>
            <p className="text-xs text-[#7A7568]">
              顯示人員安單登記、性別、以及指定同房室友配對狀態
            </p>
          </div>
          <span className="text-xs text-[#7A7568] font-mono">
            顯示筆數: {filteredDailyList.length} 筆
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#D9D4C7] max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-[#D9D4C7] text-xs">
            <thead className="bg-[#EBE9E1] text-[#5A6355] font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 text-left">#</th>
                <th className="py-2.5 px-3 text-left">安單日期</th>
                <th className="py-2.5 px-3 text-left">性別</th>
                <th className="py-2.5 px-3 text-left">安單姓名</th>
                <th className="py-2.5 px-3 text-left">指定同房室友</th>
                <th className="py-2.5 px-3 text-left">室友配對狀態</th>
                <th className="py-2.5 px-3 text-right">計數</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D8] bg-white text-[#2C332B]">
              {filteredDailyList.map((item, idx) => {
                const isMutual = 
                  item.assignedRoommate && 
                  item.assignedRoommate !== '(無指定)' && 
                  !item.assignedRoommate.includes('大會安排') &&
                  !item.assignedRoommate.includes('主辦');

                return (
                  <tr key={`${item.date}-${item.name}-${idx}`} className="hover:bg-[#F4F1EA]/80 transition-colors">
                    <td className="py-2 px-3 text-[#8C8273] font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-[#2C332B]">
                      <span className="px-2 py-0.5 rounded bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7] text-[10px]">
                        {item.date}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.gender === '女' ? 'bg-[#F4ECE3] text-[#A87B52]' : 'bg-[#E9E6DF] text-[#5A6355]'
                      }`}>
                        {item.gender}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-[#2C332B]">{item.name}</td>
                    <td className="py-2 px-3 font-medium text-[#2C332B]">
                      {item.assignedRoommate || '(無指定)'}
                    </td>
                    <td className="py-2 px-3">
                      {isMutual ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#5A6355] bg-[#E9E6DF] px-1.5 py-0.5 rounded border border-[#D9D4C7]">
                          <Check className="w-3 h-3" /> 已指定同房
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#8C8273] bg-[#F0EEE8] px-1.5 py-0.5 rounded">
                          大會統籌安排
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-[#8C8273]">1</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
