import React from 'react';
import ReactECharts from 'echarts-for-react';

interface DistributionItem {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface VesselDistributionChartProps {
  data: DistributionItem[];
  totalVessels?: number;
}

export const VesselDistributionChart: React.FC<VesselDistributionChartProps> = ({
  data,
  totalVessels = 142,
}) => {
  const chartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: <b>{c} vessels</b> ({d}%)',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#ffffff', fontSize: 12 },
    },
    series: [
      {
        name: 'Vessel Distribution',
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => `{val|${totalVessels}}\n{label|Vessels}`,
          rich: {
            val: {
              fontSize: 24,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 28,
            },
            label: {
              fontSize: 12,
              fontWeight: 500,
              color: '#64748b',
              lineHeight: 18,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((item) => ({
          name: item.type,
          value: item.count,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  return (
    <div className="w-full h-56 flex items-center justify-center">
      <ReactECharts
        option={chartOption}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};
