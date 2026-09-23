import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronDown } from 'lucide-react';

interface TrendItem {
  month: string;
  value: number;
}

interface FuelConsumptionTrendChartProps {
  data: TrendItem[];
}

export const FuelConsumptionTrendChart: React.FC<FuelConsumptionTrendChartProps> = ({ data }) => {
  const [selectedFilter, setSelectedFilter] = useState('All Vessels');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filters = ['All Vessels', 'Container Ships', 'Bulk Carriers', 'LNG Carriers'];

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#ffffff', fontSize: 12 },
      formatter: '{b}: <b>{c} t/day</b> (Fuel Consumption)',
    },
    grid: {
      top: '12%',
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.month),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: 500,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 200,
      interval: 50,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          type: 'solid',
        },
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
      },
    },
    series: [
      {
        name: 'Fuel Consumption',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#10b981',
          borderColor: '#ffffff',
          borderWidth: 1.5,
        },
        lineStyle: {
          width: 2.5,
          color: '#10b981',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.28)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.01)' },
            ],
          },
        },
        data: data.map((d) => d.value),
      },
    ],
  };

  return (
    <div className="w-full flex flex-col h-full justify-between">
      {/* Card Header matching visual reference */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Fuel Consumption Trend
        </h2>

        {/* Dropdown filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <span>{selectedFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-dropdown border border-slate-200 py-1 z-30">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setSelectedFilter(f);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    f === selectedFilter ? 'bg-aqua-50 text-aqua-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sub-header badge */}
      <div className="flex justify-end mb-1">
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span>↓ -12%</span>
          <span className="font-normal text-slate-500 text-[11px]">vs. previous period</span>
        </span>
      </div>

      <div className="w-full h-52">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};
