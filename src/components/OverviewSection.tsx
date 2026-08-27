import React from 'react';
import { 
  Users, 
  MapPin, 
  MessagesSquare, 
  Car, 
  UtensilsCrossed, 
  BedDouble, 
  ArrowUpRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend
} from 'recharts';
import { DashboardDataset } from '../types';

interface OverviewSectionProps {
  data: DashboardDataset;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const VENUE_COLORS = ['#5A6355', '#A87B52', '#8C8273'];
const GENDER_COLORS = ['#5A6355', '#A87B52'];

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  data,
  setActiveTab,
}) => {
  const { summary } = data;
  const total = summary.totalParticipants || 1;

  const malePct = ((summary.maleCount / total) * 100).toFixed(1);
  const femalePct = ((summary.femaleCount / total) * 100).toFixed(1);

  const genderPieData = [
    { name: '男師兄', value: summary.maleCount, percentage: malePct },
    { name: '女師姊', value: summary.femaleCount, percentage: femalePct },
  ];

  const venuePieData = data.venueStats.map(v => ({
    name: v.venue,
    value: v.count,
    percentage: v.percentage,
  }));

  // Daily operations summary: Meals vs Lodging (Dynamically computed from data)
  const dailyOperationsData = data.mealStats.map(m => {
    const lodging = data.dailyLodgingStats.find(l => l.date === m.date);
    return {
      date: `${m.date} (${m.dayOfWeek.replace('週', '')})`,
      fullDate: `${m.date} (${m.dayOfWeek})`,
      早餐: m.breakfast,
      午餐: m.lunch,
      晚餐: m.dinner,
      總餐數: m.total,
      安單總數: lodging ? lodging.total : 0,
      臺東安單: lodging ? lodging.taitung : 0,
      花蓮安單: lodging ? lodging.hualien : 0,
    };
  });

  const physicalSeminarCount = data.seminarStats.find(s => s.intention.includes('實體'))?.count || 0;
  const onlineSeminarCount = data.seminarStats.filter(s => s.intention.includes('線上')).reduce((sum, s) => sum + s.count, 0);
  const unableSeminarCount = data.seminarStats.find(s => s.intention.includes('無法'))?.count || 0;

  const selfDrivingCount = data.transportStats.find(t => t.mode.includes('駕駛'))?.count || 0;
  const carpoolCount = data.transportStats.find(t => t.mode.includes('共乘'))?.count || 0;
  const pendingTransportCount = data.transportStats.find(t => t.mode.includes('待確認'))?.count || 0;

  const peakLodgingDay = data.dailyLodgingStats.reduce((max, curr) => (curr.total > max.total ? curr : max), data.dailyLodgingStats[0] || { date: '9/17', total: 0, taitung: 0, hualien: 0 });

  return (
    <div className="space-y-6">
      
      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Total Participants */}
        <div 
          onClick={() => setActiveTab('regions')}
          className="bg-white rounded-xl p-4 border border-[#D9D4C7] hover:border-[#5A6355] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6355] uppercase tracking-wider">參與總人數</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0EEE8] text-[#5A6355] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold text-[#2C332B]">{summary.totalParticipants}</span>
            <span className="text-xs text-[#7A7568]">位菩薩</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs">
            <span className="text-[#5A6355] font-semibold">男 {summary.maleCount} ({malePct}%)</span>
            <span className="text-[#A87B52] font-semibold">女 {summary.femaleCount} ({femalePct}%)</span>
          </div>
        </div>

        {/* Card 2: Main Activity Venues */}
        <div 
          onClick={() => setActiveTab('venues')}
          className="bg-white rounded-xl p-4 border border-[#D9D4C7] hover:border-[#5A6355] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6355] uppercase tracking-wider">主演練主場場次</span>
            <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold text-[#5A6355]">{summary.taitungMainCount}</span>
            <span className="text-xs text-[#7A7568]">人赴臺東主場</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-[#7A7568]">
            <span>花蓮副場: <strong className="text-[#2C332B]">{summary.hualienSubCount}人</strong></span>
            <span>僅座談: <strong className="text-[#2C332B]">{summary.seminarOnlyCount}人</strong></span>
          </div>
        </div>

        {/* Card 3: Seminar Attendance */}
        <div 
          onClick={() => setActiveTab('venues')}
          className="bg-white rounded-xl p-4 border border-[#D9D4C7] hover:border-[#A87B52] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C8273] uppercase tracking-wider">玉里座談意願</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4ECE3] text-[#A87B52] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessagesSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold text-[#A87B52]">{physicalSeminarCount}</span>
            <span className="text-xs text-[#7A7568]">人實體出席</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-[#7A7568]">
            <span>線上: <strong className="text-[#2C332B]">{onlineSeminarCount}人</strong></span>
            <span>無法/未定: <strong className="text-[#2C332B]">{unableSeminarCount}人</strong></span>
          </div>
        </div>

        {/* Card 4: Transport */}
        <div 
          onClick={() => setActiveTab('venues')}
          className="bg-white rounded-xl p-4 border border-[#D9D4C7] hover:border-[#A87B52] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C8273] uppercase tracking-wider">交通車輛調度</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0EEE8] text-[#8C8273] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold text-[#2C332B]">{selfDrivingCount}</span>
            <span className="text-xs text-[#7A7568]">部自駕車輛</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-[#7A7568]">
            <span>共乘: <strong className="text-[#2C332B]">{carpoolCount}人</strong></span>
            <span className="text-[#A87B52] font-semibold">待確認: {pendingTransportCount}人</span>
          </div>
        </div>

        {/* Card 5: Meal Planning */}
        <div 
          onClick={() => setActiveTab('meals')}
          className="bg-white rounded-xl p-4 border border-[#D9D4C7] hover:border-[#5A6355] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6355] uppercase tracking-wider">備餐總餐次</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0EEE8] text-[#5A6355] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold text-[#5A6355]">{summary.totalMealsPlanned}</span>
            <span className="text-xs text-[#7A7568]">人次備餐</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-[#7A7568]">
            <span>9/16: <strong className="text-[#2C332B]">{data.mealStats[1]?.total || 0}餐</strong></span>
            <span>9/17: <strong className="text-[#2C332B]">{data.mealStats[2]?.total || 0}餐</strong></span>
          </div>
        </div>

        {/* Card 6: Lodging Peak */}
        <div 
          onClick={() => setActiveTab('lodging')}
          className="bg-white rounded-xl p-4 border border-[#D9D4C7] hover:border-[#A87B52] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C8273] uppercase tracking-wider">最高安單夜人數</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4ECE3] text-[#A87B52] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold text-[#A87B52]">{summary.maxDailyLodging}</span>
            <span className="text-xs text-[#7A7568]">人 ({peakLodgingDay.date})</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-[#7A7568]">
            <span>臺東: <strong className="text-[#2C332B]">{peakLodgingDay.taitung}人</strong></span>
            <span>花蓮: <strong className="text-[#2C332B]">{peakLodgingDay.hualien}人</strong></span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Daily Operations Trend (Meals & Lodging) */}
        <div className="lg:col-span-2 bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 border-b border-[#E8E4D8] pb-3">
            <div>
              <h2 className="text-base font-serif font-bold text-[#2C332B] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#5A6355]" />
                活動日程後勤需求全景走勢 (9/15 - 9/18)
              </h2>
              <p className="text-xs text-[#7A7568] mt-0.5">每日總供餐數與安單住宿需求對比（9/16、9/17為活動人潮高峰）</p>
            </div>
            <button
              onClick={() => setActiveTab('meals')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A6355] hover:text-[#2C332B] transition-colors"
            >
              檢視膳食詳情 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyOperationsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D8" />
                <XAxis dataKey="date" tick={{ fill: '#5A6355', fontSize: 12 }} />
                <YAxis tick={{ fill: '#7A7568', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C332B',
                    borderRadius: '8px',
                    color: '#F4F1EA',
                    fontSize: '12px',
                    border: '1px solid #5A6355',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: any, name: any) => [`${value} 人/份`, name]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Bar dataKey="早餐" stackId="meals" fill="#C8B195" radius={[0, 0, 0, 0]} />
                <Bar dataKey="午餐" stackId="meals" fill="#5A6355" radius={[0, 0, 0, 0]} />
                <Bar dataKey="晚餐" stackId="meals" fill="#3F493B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="安單總數" fill="#A87B52" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-[#E8E4D8] text-center">
            {dailyOperationsData.map((d) => (
              <div key={d.date} className="p-2.5 rounded-lg bg-[#EBE9E1] border border-[#D9D4C7]">
                <span className="text-xs text-[#7A7568] block">{d.fullDate}</span>
                <span className="text-xs font-bold text-[#2C332B]">
                  安單 <strong className="text-[#A87B52]">{d.安單總數}</strong>人 / 供餐 <strong className="text-[#5A6355]">{d.總餐數}</strong>份
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Distribution Rings */}
        <div className="space-y-6">
          
          {/* Main Activity Venues Pie */}
          <div className="bg-[#F9F8F5] rounded-xl p-5 border border-[#D9D4C7] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-serif font-bold text-[#2C332B] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5A6355]" />
                演練場次分佈 (總和 {summary.totalParticipants})
              </h2>
              <button
                onClick={() => setActiveTab('venues')}
                className="text-xs text-[#5A6355] hover:text-[#2C332B] font-medium"
              >
                詳情
              </button>
            </div>
            
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={venuePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {venuePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={VENUE_COLORS[index % VENUE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} 人 (${((Number(val) / total) * 100).toFixed(1)}%)`, name]}
                    contentStyle={{ backgroundColor: '#2C332B', borderRadius: '8px', color: '#F4F1EA', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-[#7A7568]">總人數</span>
                <span className="text-xl font-serif font-bold text-[#2C332B]">{summary.totalParticipants}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              {data.venueStats.map((v, i) => (
                <div key={v.venue} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#5A6355]">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: VENUE_COLORS[i % VENUE_COLORS.length] }}
                    />
                    {v.venue}
                  </span>
                  <span className="font-bold text-[#2C332B]">{v.count}人 ({v.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Ratio Quick Widget */}
          <div className="bg-[#F9F8F5] rounded-xl p-4 border border-[#D9D4C7] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-serif font-bold text-[#2C332B] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#5A6355]" />
                團隊性別比率
              </h2>
              <span className="text-xs text-[#7A7568]">
                男 : 女 = {summary.femaleCount > 0 ? (summary.maleCount / summary.femaleCount).toFixed(2) : summary.maleCount} : 1
              </span>
            </div>

            <div className="w-full bg-[#E8E4D8] rounded-full h-3 flex overflow-hidden my-2">
              <div className="bg-[#5A6355] h-full transition-all duration-300" style={{ width: `${malePct}%` }} title={`男師兄 ${summary.maleCount}人 (${malePct}%)`}></div>
              <div className="bg-[#A87B52] h-full transition-all duration-300" style={{ width: `${femalePct}%` }} title={`女師姊 ${summary.femaleCount}人 (${femalePct}%)`}></div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5A6355]">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#5A6355]"></span> 男師兄: <strong className="text-[#2C332B]">{summary.maleCount}人 ({malePct}%)</strong>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A87B52]"></span> 女師姊: <strong className="text-[#2C332B]">{summary.femaleCount}人 ({femalePct}%)</strong>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Top 3 Region & Role Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Regions */}
        <div className="bg-white rounded-xl p-5 border border-[#D9D4C7] shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#E8E4D8] pb-2">
            <div>
              <h2 className="text-sm font-serif font-bold text-[#2C332B]">合心區出席人數排行 TOP 5</h2>
              <p className="text-xs text-[#7A7568]">本會/志業體、中區與桃園為參與主力</p>
            </div>
            <button
              onClick={() => setActiveTab('regions')}
              className="text-xs text-[#5A6355] hover:text-[#2C332B] font-semibold inline-flex items-center gap-0.5"
            >
              所有 14 區 <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {data.regionStats.slice(0, 5).map((r, i) => (
              <div key={r.region} className="flex items-center justify-between text-xs">
                <div className="w-28 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-[#2C332B] truncate">{r.region}</span>
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-[#E8E4D8] rounded-full h-2 overflow-hidden flex">
                    <div 
                      className="bg-[#5A6355] h-full" 
                      style={{ width: `${(r.male / summary.totalParticipants) * 100 * 4}%` }} 
                    />
                    <div 
                      className="bg-[#A87B52] h-full" 
                      style={{ width: `${(r.female / summary.totalParticipants) * 100 * 4}%` }} 
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="font-bold text-[#2C332B]">{r.total}人</span>
                  <span className="text-[10px] text-[#7A7568] ml-1">(男{r.male}/女{r.female})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Functional Groups Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-[#D9D4C7] shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#E8E4D8] pb-2">
            <div>
              <h2 className="text-sm font-serif font-bold text-[#2C332B]">功能組別主力分佈</h2>
              <p className="text-xs text-[#7A7568]">急難救助隊佔比逾 51%，召集協調組達 10人</p>
            </div>
            <button
              onClick={() => setActiveTab('regions')}
              className="text-xs text-[#5A6355] hover:text-[#2C332B] font-semibold inline-flex items-center gap-0.5"
            >
              所有組別 <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {data.functionStats.map((f, i) => (
              <div key={f.group} className="flex items-center justify-between text-xs">
                <div className="w-28 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-[#2C332B] truncate">{f.group}</span>
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-[#E8E4D8] rounded-full h-2 overflow-hidden flex">
                    <div 
                      className="bg-[#5A6355] h-full" 
                      style={{ width: `${(f.total / summary.totalParticipants) * 100}%` }} 
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="font-bold text-[#2C332B]">{f.total}人</span>
                  <span className="text-[10px] text-[#7A7568] ml-1">({((f.total / summary.totalParticipants) * 100).toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
