import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FoulingRiskLevel } from '../../types';

interface RiskItem {
  level: FoulingRiskLevel;
  count: number;
  color: string;
}

interface FoulingRiskBarChartProps {
  data: RiskItem[];
}

export const FoulingRiskBarChart: React.FC<FoulingRiskBarChartProps> = ({ data }) => {
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#ffffff', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        return `${item.name}: <b>${item.value} Vessels</b>`;
      },
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
      data: data.map((d) => d.level),
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
      max: 50,
      interval: 10,
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
        name: 'Vessels',
        type: 'bar',
        barWidth: '42%',
        borderRadius: [4, 4, 0, 0],
        data: data.map((d) => ({
          value: d.count,
          itemStyle: {
            color: d.color,
          },
        })),
      },
    ],
  };

  return (
    <div className="w-full h-56">
      <ReactECharts
        option={chartOption}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};
