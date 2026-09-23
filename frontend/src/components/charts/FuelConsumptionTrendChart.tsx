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

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#ffffff', fontSize: 12 },
      formatter: '{b}: <b>{c} t/day</b>',
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
      name: 'Fuel Consumption (t/day)',
      nameTextStyle: {
        color: '#94a3b8',
        fontSize: 10,
        align: 'left',
        padding: [0, 0, 8, -25],
      },
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
    <div className="w-full flex flex-col h-full">
      {/* Header controls matching reference */}
      <div className="flex items-center justify-end space-x-2 mb-2">
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span>↓ -12%</span>
          <span className="font-normal text-slate-500">vs. previous period</span>
        </span>

        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <span>{selectedFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>
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
