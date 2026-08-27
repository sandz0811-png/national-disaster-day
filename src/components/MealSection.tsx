import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Coffee, 
  Sun, 
  Moon, 
  Calendar, 
  ChefHat, 
  Printer, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { DashboardDataset } from '../types';

interface MealSectionProps {
  data: DashboardDataset;
}

export const MealSection: React.FC<MealSectionProps> = ({ data }) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const totalBreakfast = data.mealStats.reduce((acc, curr) => acc + curr.breakfast, 0);
  const totalLunch = data.mealStats.reduce((acc, curr) => acc + curr.lunch, 0);
  const totalDinner = data.mealStats.reduce((acc, curr) => acc + curr.dinner, 0);
  const grandTotal = totalBreakfast + totalLunch + totalDinner;

  const chartData = data.mealStats.map(m => ({
    date: `${m.date} (${m.dayOfWeek})`,
    早餐: m.breakfast,
    午餐: m.lunch,
    晚餐: m.dinner,
    總計: m.total,
  }));

  const handlePrintMealSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Meal Stats Header & Summary Tiles */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">活動全程用餐需求統計 (9/15 - 9/18)</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              提供伙食組與大會香積備餐依據，全程預計供應素食齋飯共 <strong className="text-[#5A6355] font-bold">{grandTotal} 餐份</strong>
            </p>
          </div>

          <button
            onClick={handlePrintMealSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9D4C7] bg-white hover:bg-[#F4F1EA] text-[#2C332B] text-xs font-medium transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#5A6355]" />
            列印備餐清單
          </button>
        </div>

        {/* 4 Quick Stat Pills for Meal Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          <div className="p-4 rounded-xl bg-white border border-[#D9D4C7] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#8C8273] flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-[#A87B52]" /> 早餐需求總計
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-[#2C332B]">{totalBreakfast}</span>
                <span className="text-xs text-[#7A7568]">份</span>
              </div>
              <span className="text-[10px] text-[#8C8273]">9/16起連續3天供早齋</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0EEE8] flex items-center justify-center text-[#5A6355] font-serif font-bold text-sm">
              早
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#D9D4C7] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#8C8273] flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-[#5A6355]" /> 午餐需求總計
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-[#2C332B]">{totalLunch}</span>
                <span className="text-xs text-[#7A7568]">份</span>
              </div>
              <span className="text-[10px] text-[#8C8273]">9/17演練日達最高38份</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E9E6DF] flex items-center justify-center text-[#5A6355] font-serif font-bold text-sm">
              午
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#D9D4C7] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#8C8273] flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-[#A87B52]" /> 晚餐需求總計
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-[#2C332B]">{totalDinner}</span>
                <span className="text-xs text-[#7A7568]">份</span>
              </div>
              <span className="text-[10px] text-[#8C8273]">集中於 9/16 (三) 晚餐</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F4ECE3] flex items-center justify-center text-[#A87B52] font-serif font-bold text-sm">
              晚
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#2C332B] text-[#F4F1EA] border border-[#5A6355] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold text-[#D9D4C7] flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-[#A87B52]" /> 四日供餐總量
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-[#F4F1EA]">{grandTotal}</span>
                <span className="text-xs text-[#D9D4C7] font-semibold">人次份數</span>
              </div>
              <span className="text-[10px] text-[#A87B52]">全素食健康膳食供應</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#3F493B] flex items-center justify-center text-[#F4F1EA] font-serif font-bold text-sm border border-[#5A6355]">
              總
            </div>
          </div>

        </div>

        {/* Meal Chart */}
        <div className="h-72 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
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
                }}
                formatter={(val: any, name: any) => [`${val} 份`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="早餐" fill="#8C8273" radius={[0, 0, 0, 0]} />
              <Bar dataKey="午餐" fill="#5A6355" radius={[0, 0, 0, 0]} />
              <Bar dataKey="晚餐" fill="#A87B52" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Meal Detail Table */}
        <div className="overflow-x-auto rounded-lg border border-[#D9D4C7]">
          <table className="min-w-full divide-y divide-[#D9D4C7] text-xs">
            <thead className="bg-[#EBE9E1] text-[#5A6355] font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">活動日期</th>
                <th className="py-3 px-4 text-left">星期</th>
                <th className="py-3 px-4 text-right text-[#8C8273]">早餐 (份)</th>
                <th className="py-3 px-4 text-right text-[#5A6355]">午餐 (份)</th>
                <th className="py-3 px-4 text-right text-[#A87B52]">晚餐 (份)</th>
                <th className="py-3 px-4 text-right font-bold text-[#2C332B] bg-[#E9E6DF]">單日合計</th>
                <th className="py-3 px-4 text-left">備註說明與活動階段</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D8] bg-white text-[#2C332B]">
              {data.mealStats.map((m) => (
                <tr key={m.date} className="hover:bg-[#F4F1EA]/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#2C332B]">{m.date}</td>
                  <td className="py-3 px-4 font-medium text-[#7A7568]">{m.dayOfWeek}</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#8C8273]">{m.breakfast}</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#5A6355]">{m.lunch}</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#A87B52]">{m.dinner}</td>
                  <td className="py-3 px-4 text-right font-serif font-bold text-[#2C332B] bg-[#F9F8F5] text-sm">
                    {m.total}
                  </td>
                  <td className="py-3 px-4 text-[#7A7568]">
                    <span className="inline-flex items-center gap-1">
                      {m.total > 0 ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#5A6355] shrink-0" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-[#8C8273] shrink-0" />
                      )}
                      {m.note}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-[#EBE9E1] font-bold text-[#2C332B] border-t-2 border-[#D9D4C7]">
                <td className="py-3 px-4 font-bold text-[#2C332B]">四日總計</td>
                <td className="py-3 px-4 text-[#5A6355]">全程備餐</td>
                <td className="py-3 px-4 text-right text-[#8C8273] font-bold">{totalBreakfast} 份</td>
                <td className="py-3 px-4 text-right text-[#5A6355] font-bold">{totalLunch} 份</td>
                <td className="py-3 px-4 text-right text-[#A87B52] font-bold">{totalDinner} 份</td>
                <td className="py-3 px-4 text-right font-serif font-bold text-[#2C332B] bg-[#E9E6DF] text-base">
                  {grandTotal} 份
                </td>
                <td className="py-3 px-4 text-[#7A7568] text-xs font-normal">
                  香積志工請依上述數據進行採買備料與保溫發放
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* 2. Kitchen & Catering Operational Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#D9D4C7] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#8C8273] font-bold text-xs">
            <Coffee className="w-4 h-4 text-[#A87B52]" /> 早餐準備指引 (07:00 - 08:00)
          </div>
          <p className="text-xs text-[#7A7568] leading-relaxed">
            9/16 需 12 份，9/17 演練日與 9/18 賦歸日各需 35 份及 34 份。請於每日上午 07:00 前完成保溫便當或饅頭豆漿分裝。
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#D9D4C7] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#5A6355] font-bold text-xs">
            <Sun className="w-4 h-4 text-[#5A6355]" /> 午餐準備指引 (11:30 - 12:30)
          </div>
          <p className="text-xs text-[#7A7568] leading-relaxed">
            午餐為每日核心供餐（9/16 需 35 份、9/17 演練現場需 38 份、9/18 需 32 份）。演練日請配合演習動線裝箱運送至指定休息區。
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#D9D4C7] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#A87B52] font-bold text-xs">
            <Moon className="w-4 h-4 text-[#A87B52]" /> 晚餐準備指引 (18:00 - 19:00)
          </div>
          <p className="text-xs text-[#7A7568] leading-relaxed">
            全期僅 9/16 (週三座談日) 備晚餐 36 份；9/17 與 9/18 晚餐為 0 份（演習結束後同仁解散或自理）。
          </p>
        </div>

      </div>

    </div>
  );
};
