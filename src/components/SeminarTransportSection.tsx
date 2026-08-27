import React from 'react';
import { 
  Compass, 
  Car, 
  MapPin, 
  Train, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  Radio, 
  Clock,
  Navigation
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { DashboardDataset } from '../types';

interface SeminarTransportSectionProps {
  data: DashboardDataset;
  onFilterRoster?: (filterType: string, value: string) => void;
}

const VENUE_COLORS = ['#5A6355', '#A87B52', '#8C8273'];
const TRANSPORT_COLORS = ['#5A6355', '#A87B52', '#8C8273', '#73836E', '#C8B195', '#6A5D54'];

export const SeminarTransportSection: React.FC<SeminarTransportSectionProps> = ({ 
  data,
}) => {
  return (
    <div className="space-y-8">
      
      {/* 1. Activity Venues & Seminar Survey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Main Activity Venue Survey */}
        <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-[#E8E4D8] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2C332B]">國家防災日主活動 - 參與場次調查</h3>
              <p className="text-xs text-[#7A7568]">
                主場臺東 {data.summary.taitungMainCount}人、副場花蓮 {data.summary.hualienSubCount}人、僅座談 {data.summary.seminarOnlyCount}人 (總計 {data.summary.totalParticipants}人)
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.venueStats}
                  dataKey="count"
                  nameKey="venue"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  label={({ name, percent }: any) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {data.venueStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={VENUE_COLORS[index % VENUE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} 位 (${((Number(val) / (data.summary.totalParticipants || 1)) * 100).toFixed(1)}%)`, name]}
                  contentStyle={{ backgroundColor: '#2C332B', borderRadius: '8px', color: '#F4F1EA', fontSize: '12px', border: '1px solid #5A6355' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {data.venueStats.map((v, i) => (
              <div 
                key={v.venue}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#D9D4C7] text-xs"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: VENUE_COLORS[i % VENUE_COLORS.length] }} 
                  />
                  <span className="font-semibold text-[#2C332B]">{v.venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#2C332B]">{v.count} 人</span>
                  <span className="text-[#7A7568] font-mono w-12 text-right">({v.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seminar Attendance Breakdown */}
        <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-[#E8E4D8] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F4ECE3] text-[#A87B52] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2C332B]">「慈濟全台防救災團隊綜合座談」意願</h3>
              <p className="text-xs text-[#7A7568]">玉里靜思堂實體座談 34人，線上轉實體 9人</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.seminarStats.map((s, idx) => {
              const colors = [
                'bg-[#E9E6DF] text-[#2C332B] border-[#D9D4C7]',
                'bg-[#F0EEE8] text-[#7A7568] border-[#D9D4C7]',
                'bg-[#F4ECE3] text-[#A87B52] border-[#D9D4C7]',
                'bg-[#EBE9E1] text-[#8C8273] border-[#D9D4C7]',
                'bg-[#E9E6DF] text-[#5A6355] border-[#D9D4C7]',
              ];

              return (
                <div 
                  key={s.intention}
                  className={`p-3 rounded-lg border ${colors[idx % colors.length]} transition-all`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {idx === 0 && <CheckCircle2 className="w-4 h-4 text-[#5A6355]" />}
                        {idx === 1 && <Clock className="w-4 h-4 text-[#8C8273]" />}
                        {idx === 2 && <Radio className="w-4 h-4 text-[#A87B52]" />}
                        {idx >= 3 && <Navigation className="w-4 h-4 text-[#7A7568]" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight text-[#2C332B]">{s.intention}</h4>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-serif font-bold text-[#2C332B]">{s.count}人</span>
                      <span className="text-[10px] text-[#7A7568] block font-mono">({s.percentage}%)</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#D9D4C7]/60 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-[#5A6355] h-full" 
                      style={{ width: `${s.percentage}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Transportation Matrix */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">去回程交通方式統計與車輛調度</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              共有 14 位駕駛開車（可提供共乘載位）、15 位搭乘共乘車輛、10 位搭乘臺鐵、12 位尚待確認
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#E9E6DF] text-[#5A6355] border border-[#D9D4C7] text-xs font-semibold">
              🚗 開車駕駛 : 14 部
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F4ECE3] text-[#A87B52] border border-[#D9D4C7] text-xs font-semibold">
              👥 共乘人數 : 15 位
            </span>
          </div>
        </div>

        {/* Transportation Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {data.transportStats.map((t, idx) => {
            const icons = [
              <Users className="w-5 h-5 text-[#5A6355]" />,
              <Car className="w-5 h-5 text-[#A87B52]" />,
              <HelpCircle className="w-5 h-5 text-[#8C8273]" />,
              <Train className="w-5 h-5 text-[#73836E]" />,
              <Navigation className="w-5 h-5 text-[#6A5D54]" />,
              <Clock className="w-5 h-5 text-[#A87B52]" />,
            ];

            return (
              <div 
                key={t.mode}
                className="p-4 rounded-xl border border-[#D9D4C7] bg-white hover:border-[#5A6355] hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#F0EEE8] shadow-2xs flex items-center justify-center">
                      {icons[idx % icons.length]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2C332B]">{t.mode}</h4>
                      <span className="text-[11px] text-[#7A7568]">{t.percentage}% 比例</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[#2C332B]">{t.count}</span>
                    <span className="text-xs text-[#7A7568] ml-1">人</span>
                  </div>
                </div>

                <div className="w-full bg-[#E8E4D8] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${t.percentage}%`,
                      backgroundColor: TRANSPORT_COLORS[idx % TRANSPORT_COLORS.length]
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Driver vs Passenger Fleet Overview */}
        <div className="p-5 rounded-xl bg-[#2C332B] text-[#F4F1EA] border border-[#5A6355] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-sm font-serif font-bold text-[#F4ECE3] flex items-center gap-1.5">
              <Car className="w-4 h-4 text-[#A87B52]" />
              交通後勤車隊調度提示
            </h4>
            <p className="text-xs text-[#D9D4C7] leading-relaxed">
              自駕 14 位師兄姊平均可乘載 3-4 人，總承載運能約 42~56 人次，足以覆蓋共乘 15 人與大會裝備運輸需求。請後勤交通組於 9/12 前完成 12 位「待確認」同仁之搭車班次調查。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#3F493B] px-3.5 py-2 rounded-lg border border-[#5A6355] text-center">
              <span className="text-[10px] text-[#D9D4C7] block uppercase">自駕車隊運能</span>
              <span className="text-base font-serif font-bold text-[#F4F1EA]">14 車 ~50座</span>
            </div>
            <div className="bg-[#3F493B] px-3.5 py-2 rounded-lg border border-[#5A6355] text-center">
              <span className="text-[10px] text-[#A87B52] block uppercase">待確認班次</span>
              <span className="text-base font-serif font-bold text-[#A87B52]">12 位</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
