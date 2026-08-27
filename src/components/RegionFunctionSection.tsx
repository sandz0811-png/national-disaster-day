import React, { useState } from 'react';
import { 
  Building2, 
  Users2, 
  ArrowUpDown, 
  Filter, 
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import { DashboardDataset, RegionData, FunctionalGroupData } from '../types';

interface RegionFunctionSectionProps {
  data: DashboardDataset;
}

export const RegionFunctionSection: React.FC<RegionFunctionSectionProps> = ({ data }) => {
  const [regionSortBy, setRegionSortBy] = useState<'total' | 'region' | 'male' | 'female'>('total');
  const [regionSortAsc, setRegionSortAsc] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const sortedRegions = [...data.regionStats]
    .filter(r => r.region.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (regionSortBy === 'total') {
        return regionSortAsc ? a.total - b.total : b.total - a.total;
      }
      if (regionSortBy === 'male') {
        return regionSortAsc ? a.male - b.male : b.male - a.male;
      }
      if (regionSortBy === 'female') {
        return regionSortAsc ? a.female - b.female : b.female - a.female;
      }
      return regionSortAsc ? a.region.localeCompare(b.region) : b.region.localeCompare(a.region);
    });

  const handleSort = (field: 'total' | 'region' | 'male' | 'female') => {
    if (regionSortBy === field) {
      setRegionSortAsc(!regionSortAsc);
    } else {
      setRegionSortBy(field);
      setRegionSortAsc(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Region Section */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9E6DF] text-[#5A6355] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">合心區分佈與性別交叉統計</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              全台共計 {data.regionStats.length} 個合心區及志業體單位出席，參與人員共計 {data.summary.totalParticipants} 位
            </p>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="搜尋合心區..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#D9D4C7] bg-white text-xs text-[#2C332B] focus:outline-none focus:ring-2 focus:ring-[#5A6355] w-40"
            />
          </div>
        </div>

        {/* Region Chart */}
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedRegions}
              margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D8" />
              <XAxis 
                dataKey="region" 
                tick={{ fill: '#5A6355', fontSize: 12 }} 
                angle={-25}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: '#7A7568', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2C332B',
                  borderRadius: '8px',
                  color: '#F4F1EA',
                  fontSize: '12px',
                  border: '1px solid #5A6355',
                }}
                formatter={(val: any, name: any) => [`${val} 位`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
              <Bar dataKey="male" name="男師兄" stackId="gender" fill="#5A6355" />
              <Bar dataKey="female" name="女師姊" stackId="gender" fill="#A87B52" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region Data Table */}
        <div className="overflow-x-auto rounded-lg border border-[#D9D4C7]">
          <table className="min-w-full divide-y divide-[#D9D4C7] text-xs">
            <thead className="bg-[#EBE9E1] text-[#5A6355] font-semibold">
              <tr>
                <th className="py-2.5 px-3 text-left">#</th>
                <th 
                  onClick={() => handleSort('region')}
                  className="py-2.5 px-3 text-left cursor-pointer hover:text-[#2C332B]"
                >
                  <div className="flex items-center gap-1">
                    <span>合心區名稱</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8C8273]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('female')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#2C332B]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[#A87B52]">女師姊</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8C8273]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('male')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#2C332B]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[#5A6355]">男師兄</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8C8273]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('total')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#2C332B]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-bold text-[#2C332B]">總和人數</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8C8273]" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-left">總佔比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D8] bg-white text-[#2C332B]">
              {sortedRegions.map((r, index) => {
                const percent = ((r.total / data.summary.totalParticipants) * 100).toFixed(1);
                return (
                  <tr key={r.region} className="hover:bg-[#F4F1EA]/80 transition-colors">
                    <td className="py-2 px-3 text-[#8C8273] font-mono">{index + 1}</td>
                    <td className="py-2 px-3 font-semibold text-[#2C332B] flex items-center gap-1.5">
                      {r.region}
                      {r.total >= 8 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#E9E6DF] text-[#5A6355] text-[10px] font-normal border border-[#D9D4C7]">
                          主力代表
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-[#A87B52]">{r.female || '-'}</td>
                    <td className="py-2 px-3 text-right font-medium text-[#5A6355]">{r.male || '-'}</td>
                    <td className="py-2 px-3 text-right font-bold text-[#2C332B]">{r.total}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#E8E4D8] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#5A6355] h-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-[11px] text-[#7A7568]">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Total Footer Row */}
              <tr className="bg-[#EBE9E1] font-bold text-[#2C332B] border-t-2 border-[#D9D4C7]">
                <td className="py-2.5 px-3 text-center">-</td>
                <td className="py-2.5 px-3">全台總和 ({data.regionStats.length} 單位)</td>
                <td className="py-2.5 px-3 text-right text-[#A87B52] font-extrabold">{data.summary.femaleCount}</td>
                <td className="py-2.5 px-3 text-right text-[#5A6355] font-extrabold">{data.summary.maleCount}</td>
                <td className="py-2.5 px-3 text-right font-extrabold text-[#2C332B] text-sm">{data.summary.totalParticipants}</td>
                <td className="py-2.5 px-3 text-[#7A7568]">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Functional Groups Section */}
      <div className="bg-[#F9F8F5] rounded-xl p-6 border border-[#D9D4C7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#E8E4D8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F4ECE3] text-[#A87B52] flex items-center justify-center">
                <Users2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2C332B]">功能組別職責與性別分佈</h2>
            </div>
            <p className="text-xs text-[#7A7568] mt-1">
              涵蓋 {data.functionStats.length} 大功能組別，共計 {data.summary.totalParticipants} 位志工夥伴與同仁投入演習任務
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Functional Bar Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.functionStats}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 35, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E4D8" />
                <XAxis type="number" tick={{ fill: '#7A7568', fontSize: 11 }} />
                <YAxis 
                  dataKey="group" 
                  type="category" 
                  tick={{ fill: '#2C332B', fontSize: 12, fontWeight: 500 }} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C332B',
                    borderRadius: '8px',
                    color: '#F4F1EA',
                    fontSize: '12px',
                    border: '1px solid #5A6355',
                  }}
                  formatter={(val: any, name: any) => [`${val} 位`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="male" name="男師兄" stackId="gender" fill="#5A6355" />
                <Bar dataKey="female" name="女師姊" stackId="gender" fill="#A87B52" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table & Cards */}
          <div className="space-y-2.5">
            {data.functionStats.map((f) => {
              const percent = ((f.total / data.summary.totalParticipants) * 100).toFixed(1);
              return (
                <div 
                  key={f.group}
                  className="p-3 rounded-lg border border-[#D9D4C7] bg-white hover:border-[#5A6355] hover:bg-[#F4F1EA]/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E9E6DF] flex items-center justify-center font-bold text-[#5A6355] text-xs">
                      {f.total}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2C332B]">{f.group}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7A7568]">
                        <span className="text-[#5A6355] font-semibold">男: {f.male}</span>
                        <span>•</span>
                        <span className="text-[#A87B52] font-semibold">女: {f.female}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#2C332B]">{percent}%</span>
                    <div className="w-20 bg-[#E8E4D8] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#5A6355] h-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
