import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from './TransactionForm';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <Card className="finance-gradient-card finance-shadow-medium border-0">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <Receipt className="h-10 w-10 sm:h-12 w-12 text-muted-foreground mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
            No transactions yet
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Add your first transaction to start tracking your finances
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-gradient-card finance-shadow-medium border-0">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Receipt className="h-4 w-4 sm:h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Recent Transactions</span>
          <span className="sm:hidden">Transactions</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {transactions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              'flex items-center justify-between p-3 sm:p-4 rounded-lg border finance-transition',
              'hover:finance-shadow-soft bg-card/50 backdrop-blur-sm'
            )}
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 sm:w-10 h-10 rounded-full shrink-0',
                  transaction.type === 'income' 
                    ? 'bg-finance-income/10 text-finance-income' 
                    : 'bg-finance-expense/10 text-finance-expense'
                )}
              >
                {transaction.type === 'income' ? (
                  <TrendingUp className="h-4 w-4 sm:h-5 w-5" />
                ) : (
                  <TrendingDown className="h-4 w-4 sm:h-5 w-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-card-foreground truncate text-sm sm:text-base">
                  {transaction.description}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                  {transaction.category && (
                    <div className="flex items-center gap-1">
                      <span className="hidden sm:inline">•</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-20 sm:max-w-none">
                        {transaction.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="text-right">
                <p
                  className={cn(
                    'font-semibold text-sm sm:text-lg',
                    transaction.type === 'income' 
                      ? 'text-finance-income' 
                      : 'text-finance-expense'
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </p>
                <Badge
                  variant={transaction.type === 'income' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs hidden sm:inline-flex',
                    transaction.type === 'income' 
                      ? 'bg-finance-income/10 text-finance-income hover:bg-finance-income/20' 
                      : 'bg-finance-expense/10 text-finance-expense hover:bg-finance-expense/20'
                  )}
                >
                  {transaction.type}
                </Badge>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  className="h-7 w-7 sm:h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary finance-transition"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="h-7 w-7 sm:h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive finance-transition"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};