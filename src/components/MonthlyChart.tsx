import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { Transaction } from './TransactionForm';
import { BarChart3 } from 'lucide-react';

interface MonthlyChartProps {
  transactions: Transaction[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        expenses,
        income,
        net: income - expenses,
      };
    });
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 finance-shadow-medium">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.dataKey}:</span>
              <span className="font-medium">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <Card className="finance-gradient-card finance-shadow-medium border-0">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <BarChart3 className="h-10 w-10 sm:h-12 w-12 text-muted-foreground mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
            No data to display
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Add some transactions to see your monthly spending trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-gradient-card finance-shadow-medium border-0">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <BarChart3 className="h-4 w-4 sm:h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Monthly Overview</span>
          <span className="sm:hidden">Monthly</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `$${value}`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="income"
                fill="hsl(var(--finance-income))"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="hsl(var(--finance-expense))"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};