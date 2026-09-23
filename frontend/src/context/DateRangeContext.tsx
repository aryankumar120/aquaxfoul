import React, { createContext, useContext, useState } from 'react';

export interface DateRangeContextType {
  period: string;
  setPeriod: (period: string) => void;
  periods: string[];
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [period, setPeriod] = useState<string>('Last 6 months');
  const periods = ['Last 30 days', 'Last 3 months', 'Last 6 months', 'Last 12 months', 'Year to Date'];

  return (
    <DateRangeContext.Provider value={{ period, setPeriod, periods }}>
      {children}
    </DateRangeContext.Provider>
  );
};

const defaultPeriods = ['Last 30 days', 'Last 3 months', 'Last 6 months', 'Last 12 months', 'Year to Date'];

export const useDateRange = (): DateRangeContextType => {
  const context = useContext(DateRangeContext);
  if (!context) {
    return {
      period: 'Last 6 months',
      setPeriod: () => {},
      periods: defaultPeriods,
    };
  }
  return context;
};
