import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Calendar,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction } from './TransactionForm';
import { Budget } from './BudgetManager';
import { cn } from '@/lib/utils';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const SpendingInsights: React.FC<SpendingInsightsProps> = ({ 
  transactions, 
  budgets 
}) => {
  const insights = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);

    // Current month data
    const currentMonthTransactions = transactions.filter(t => 
      new Date(t.date).toISOString().slice(0, 7) === currentMonth
    );
    
    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Last month data
    const lastMonthTransactions = transactions.filter(t => 
      new Date(t.date).toISOString().slice(0, 7) === lastMonthStr
    );
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Spending change
    const spendingChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Top spending categories this month
    const categorySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Budget analysis
    const currentBudgets = budgets.filter(b => b.month === currentMonth);
    const budgetAnalysis = currentBudgets.map(budget => {
      const actual = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        variance: actual - budget.amount,
        percentage: (actual / budget.amount) * 100
      };
    });

    const overBudgetCategories = budgetAnalysis.filter(b => b.actual > b.budget);
    const underBudgetCategories = budgetAnalysis.filter(b => b.actual < b.budget * 0.8);

    // Daily spending pattern
    const dailySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const day = new Date(t.date).getDate();
        acc[day] = (acc[day] || 0) + t.amount;
        return acc;
      }, {} as Record<number, number>);

    const averageDailySpending = Object.values(dailySpending).length > 0
      ? Object.values(dailySpending).reduce((sum, amount) => sum + amount, 0) / Object.values(dailySpending).length
      : 0;

    // Generate insights
    const insightsList = [];

    // Spending trend insight
    if (spendingChange > 10) {
      insightsList.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Spending Increased',
        description: `Your spending is ${Math.abs(spendingChange).toFixed(1)}% higher than last month.`,
        action: 'Consider reviewing your recent expenses.'
      });
    } else if (spendingChange < -10) {
      insightsList.push({
        type: 'success',
        icon: TrendingDown,
        title: 'Spending Decreased',
        description: `Great job! Your spending is ${Math.abs(spendingChange).toFixed(1)}% lower than last month.`,
        action: 'Keep up the good financial habits!'
      });
    }

    // Budget insights
    if (overBudgetCategories.length > 0) {
      insightsList.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Over Budget Categories',
        description: `${overBudgetCategories.length} category${overBudgetCategories.length > 1 ? 'ies' : 'y'} over budget.`,
        action: 'Review spending in these categories and adjust if needed.'
      });
    }

    if (underBudgetCategories.length > 0) {
      insightsList.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Under Budget Categories',
        description: `${underBudgetCategories.length} category${underBudgetCategories.length > 1 ? 'ies' : 'y'} under budget.`,
        action: 'Consider reallocating unused budget to other areas.'
      });
    }

    // Top spending category insight
    if (topCategories.length > 0) {
      const [topCategory, topAmount] = topCategories[0];
      const topPercentage = (topAmount / currentMonthExpenses) * 100;
      
      if (topPercentage > 40) {
        insightsList.push({
          type: 'warning',
          icon: Target,
          title: 'High Category Concentration',
          description: `${topCategory} represents ${topPercentage.toFixed(1)}% of your spending.`,
          action: 'Consider diversifying your spending across categories.'
        });
      }
    }

    // Daily spending insight
    if (averageDailySpending > 100) {
      insightsList.push({
        type: 'warning',
        icon: Calendar,
        title: 'High Daily Spending',
        description: `You're averaging $${averageDailySpending.toFixed(2)} per day this month.`,
        action: 'Track daily spending to identify unnecessary expenses.'
      });
    }

    return {
      spendingChange,
      topCategories,
      budgetAnalysis,
      overBudgetCategories: overBudgetCategories.length,
      underBudgetCategories: underBudgetCategories.length,
      averageDailySpending,
      insights: insightsList
    };
  }, [transactions, budgets]);

  return (
    <Card className="finance-card-premium finance-shadow-premium border-0 rounded-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-warning/10 to-warning/5">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <div className="p-3 bg-gradient-to-br from-warning to-yellow-500 rounded-xl finance-shadow-glow">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <span className="finance-text-gradient">AI-Powered Insights</span>
        </CardTitle>
        <p className="text-muted-foreground mt-2">Personalized recommendations to improve your financial health</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="finance-card-elegant p-6 text-center finance-hover-lift">
            <div className="flex items-center justify-center gap-2 mb-3">
              {insights.spendingChange > 0 ? (
                <div className="p-2 bg-gradient-to-br from-destructive/20 to-red-500/10 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-destructive" />
                </div>
              ) : (
                <div className="p-2 bg-gradient-to-br from-success/20 to-green-500/10 rounded-lg">
                  <ArrowDownRight className="h-5 w-5 text-success" />
                </div>
              )}
              <span className="text-sm font-medium text-muted-foreground">vs Last Month</span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              insights.spendingChange > 0 ? "text-destructive" : "text-success"
            )}>
              {insights.spendingChange > 0 ? '+' : ''}{insights.spendingChange.toFixed(1)}%
            </p>
          </div>

          <div className="finance-card-elegant p-6 text-center finance-hover-lift">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Over Budget</span>
            </div>
            <p className="text-2xl font-bold text-destructive">
              {insights.overBudgetCategories}
            </p>
          </div>

          <div className="finance-card-elegant p-6 text-center finance-hover-lift">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-success/20 to-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Under Budget</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {insights.underBudgetCategories}
            </p>
          </div>

          <div className="finance-card-elegant p-6 text-center finance-hover-lift">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-warning/20 to-yellow-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Daily Average</span>
            </div>
            <p className="text-2xl font-bold text-warning">
              ${insights.averageDailySpending.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Top Spending Categories */}
        {insights.topCategories.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold finance-text-gradient">Top Spending Categories</h3>
            <div className="grid gap-4">
              {insights.topCategories.map(([category, amount], index) => (
                <div key={category} className="finance-card-elegant p-4 finance-hover-lift">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>
                      <span className="font-semibold text-lg">{category}</span>
                    </div>
                    <span className="font-bold text-2xl text-finance-expense">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.insights.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold finance-text-gradient">AI Recommendations</h3>
            <div className="grid gap-4">
              {insights.insights.map((insight, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "finance-card-elegant p-6 border-l-4 finance-hover-lift",
                    insight.type === 'warning' && "border-warning",
                    insight.type === 'success' && "border-success"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      insight.type === 'warning' && "bg-gradient-to-br from-warning/20 to-yellow-500/10",
                      insight.type === 'success' && "bg-gradient-to-br from-success/20 to-green-500/10"
                    )}>
                      <insight.icon className={cn(
                        "h-6 w-6",
                        insight.type === 'warning' && "text-warning",
                        insight.type === 'success' && "text-success"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">{insight.title}</h4>
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <span className="text-lg">💡</span>
                        <span>{insight.action}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Lightbulb className="h-12 w-12 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No insights available yet</h3>
            <p className="text-sm">Add more transactions and budgets to get personalized AI recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 