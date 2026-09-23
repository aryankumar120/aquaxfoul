import React from 'react';
import ReactECharts from 'echarts-for-react';
import { VesselProjections } from '../../types';

interface ProjectionComparisonChartProps {
  projections: VesselProjections;
  activeScenario?: 'all' | 'no-cleaning' | 'clean-now' | 'clean-later';
}

export const ProjectionComparisonChart: React.FC<ProjectionComparisonChartProps> = ({
  projections,
  activeScenario = 'all',
}) => {
  const { scenarios } = projections;
  const months = scenarios.noCleaning.series.map((s) => s.month);

  // Historical data series (solid curve)
  const historicalData = scenarios.noCleaning.series.map((s) => s.historical ?? null);

  // Scenario A (No Cleaning) projected (dashed red)
  const scenarioAData = scenarios.noCleaning.series.map((s, idx) =>
    idx >= 5 ? s.projected : null
  );

  // Scenario B (Clean Now) projected (dashed green)
  const scenarioBData = scenarios.cleanNow.series.map((s, idx) =>
    idx >= 5 ? s.projected : null
  );

  // Scenario C (Clean Later) projected (dashed blue)
  const scenarioCData = scenarios.cleanLater.series.map((s, idx) =>
    idx >= 5 ? s.projected : null
  );

  const series = [
    {
      name: 'Historical Baseline',
      type: 'line',
      smooth: true,
      data: historicalData,
      itemStyle: { color: '#0f172a' },
      lineStyle: { width: 3, type: 'solid' },
      symbol: 'circle',
      symbolSize: 6,
    },
  ];

  if (activeScenario === 'all' || activeScenario === 'no-cleaning') {
    series.push({
      name: 'Scenario A: No Cleaning',
      type: 'line',
      smooth: true,
      data: scenarioAData,
      itemStyle: { color: '#ef4444' },
      lineStyle: { width: 2.5, type: 'dashed' },
      symbol: 'emptyCircle',
      symbolSize: 5,
    });
  }

  if (activeScenario === 'all' || activeScenario === 'clean-now') {
    series.push({
      name: 'Scenario B: Clean Now',
      type: 'line',
      smooth: true,
      data: scenarioBData,
      itemStyle: { color: '#10b981' },
      lineStyle: { width: 2.5, type: 'dashed' },
      symbol: 'emptyCircle',
      symbolSize: 5,
    });
  }

  if (activeScenario === 'all' || activeScenario === 'clean-later') {
    series.push({
      name: 'Scenario C: Clean Later',
      type: 'line',
      smooth: true,
      data: scenarioCData,
      itemStyle: { color: '#3b82f6' },
      lineStyle: { width: 2.5, type: 'dashed' },
      symbol: 'emptyCircle',
      symbolSize: 5,
    });
  }

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#ffffff', fontSize: 12 },
      formatter: (params: any) => {
        let content = `<div class="font-semibold mb-1">${params[0]?.name || ''}</div>`;
        params.forEach((p: any) => {
          if (p.value !== null && p.value !== undefined) {
            content += `<div class="flex items-center justify-between gap-4 text-xs">
              <span style="color: ${p.color}">${p.seriesName}</span>
              <b>${p.value} t/day</b>
            </div>`;
          }
        });
        return content;
      },
    },
    legend: {
      data: series.map((s) => s.name),
      top: '0%',
      textStyle: { color: '#64748b', fontSize: 11 },
    },
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: 'Fuel Consumption (t/day)',
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      min: 45,
      max: 85,
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series,
  };

  return (
    <div className="w-full h-80">
      <ReactECharts
        option={chartOption}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};
