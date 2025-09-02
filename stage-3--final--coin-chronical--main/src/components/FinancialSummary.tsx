import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, Target } from 'lucide-react';
import { Transaction } from './TransactionForm';
import { cn } from '@/lib/utils';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    // Calculate this month's data
    const now = new Date();
    const thisMonth = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    });
    
    const thisMonthIncome = thisMonth
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const thisMonthExpenses = thisMonth
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Top spending category
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      thisMonthIncome,
      thisMonthExpenses,
      transactionCount: transactions.length,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    };
  }, [transactions]);

  const summaryCards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-finance-income',
      bgColor: 'bg-finance-income/10',
      prefix: '+$',
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-finance-expense',
      bgColor: 'bg-finance-expense/10',
      prefix: '-$',
    },
    {
      title: 'Net Balance',
      value: summary.netBalance,
      icon: DollarSign,
      color: summary.netBalance >= 0 ? 'text-finance-income' : 'text-finance-expense',
      bgColor: summary.netBalance >= 0 ? 'bg-finance-income/10' : 'bg-finance-expense/10',
      prefix: summary.netBalance >= 0 ? '+$' : '-$',
      showAbsolute: true,
    },
    {
      title: 'Transactions',
      value: summary.transactionCount,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      prefix: '',
      suffix: ' total',
    },
    {
      title: 'Top Category',
      value: summary.topCategory?.amount || 0,
      icon: Target,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      prefix: '$',
      customSuffix: summary.topCategory?.name || 'None',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {summaryCards.map((card, index) => (
        <Card
          key={index}
          className="finance-card-elegant finance-hover-lift"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-4">
            <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 sm:p-3 rounded-xl', card.bgColor)}>
              <card.icon className={cn('h-4 w-4 sm:h-5 w-5', card.color)} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={cn('text-lg sm:text-2xl lg:text-3xl font-black mb-1 sm:mb-2 drop-shadow-sm break-all', card.color)}>
              {card.prefix}
              {card.showAbsolute ? Math.abs(card.value).toFixed(2) : card.value}
              {card.suffix}
            </div>
            {card.customSuffix && (
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 truncate">
                {card.customSuffix}
              </p>
            )}
            {(card.title === 'Total Income' || card.title === 'Total Expenses') && (
              <div className="p-2 sm:p-3 bg-muted/30 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  This month: $
                  {card.title === 'Total Income' 
                    ? summary.thisMonthIncome.toFixed(2)
                    : summary.thisMonthExpenses.toFixed(2)
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};