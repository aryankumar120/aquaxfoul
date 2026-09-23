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
      formatter: '{b}: <b>{c}</b> ({d}%)',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#ffffff', fontSize: 12 },
    },
    series: [
      {
        name: 'Vessel Distribution',
        type: 'pie',
        radius: ['58%', '82%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => `{val|${totalVessels}}\n{label|Vessels}`,
          rich: {
            val: {
              fontSize: 22,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 26,
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
            fontSize: 18,
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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 h-full">
      <div className="w-48 h-48 sm:w-52 sm:h-52 relative shrink-0">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Legend Column matching Reference Image */}
      <div className="grid grid-cols-1 gap-2.5 w-full text-xs pr-2">
        {data.map((item) => (
          <div key={item.type} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-medium">{item.type}</span>
            </div>
            <div className="text-slate-900 font-semibold">
              {item.count}{' '}
              <span className="text-slate-400 font-normal">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
