import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { CATEGORIES } from './TransactionForm';
import { cn } from '@/lib/utils';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
}

interface BudgetManagerProps {
  transactions: any[];
  budgets: Budget[];
  onBudgetChange: (budgets: Budget[]) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  transactions,
  budgets,
  onBudgetChange,
}) => {
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
  });
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Calculate actual spending for each category this month
  const getActualSpending = (category: string) => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category &&
        new Date(t.date).toISOString().slice(0, 7) === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get budget for a category
  const getBudget = (category: string) => {
    return budgets.find(b => b.category === category && b.month === currentMonth);
  };

  // Calculate budget utilization percentage
  const getBudgetUtilization = (category: string) => {
    const budget = getBudget(category);
    const actual = getActualSpending(category);
    if (!budget || budget.amount === 0) return 0;
    return (actual / budget.amount) * 100;
  };

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount || isNaN(Number(newBudget.amount))) {
      return;
    }

    const budgetExists = budgets.some(
      b => b.category === newBudget.category && b.month === currentMonth
    );

    if (budgetExists) {
      // Update existing budget
      const updatedBudgets = budgets.map(b =>
        b.category === newBudget.category && b.month === currentMonth
          ? { ...b, amount: Number(newBudget.amount) }
          : b
      );
      onBudgetChange(updatedBudgets);
    } else {
      // Add new budget
      const newBudgetItem: Budget = {
        id: Date.now().toString(),
        category: newBudget.category,
        amount: Number(newBudget.amount),
        month: currentMonth,
      };
      onBudgetChange([...budgets, newBudgetItem]);
    }

    setNewBudget({ category: '', amount: '' });
  };

  const handleDeleteBudget = (category: string) => {
    const updatedBudgets = budgets.filter(
      b => !(b.category === category && b.month === currentMonth)
    );
    onBudgetChange(updatedBudgets);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      amount: budget.amount.toString(),
    });
  };

  const handleUpdateBudget = () => {
    if (!editingBudget || !newBudget.amount || isNaN(Number(newBudget.amount))) {
      return;
    }

    const updatedBudgets = budgets.map(b =>
      b.id === editingBudget.id
        ? { ...b, amount: Number(newBudget.amount) }
        : b
    );
    onBudgetChange(updatedBudgets);
    setEditingBudget(null);
    setNewBudget({ category: '', amount: '' });
  };

  const currentBudgets = budgets.filter(b => b.month === currentMonth);
  const expenseCategories = CATEGORIES.expense;

  return (
    <Card className="finance-card-premium finance-shadow-premium border-0 rounded-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <div className="p-3 bg-gradient-to-br from-primary to-primary-glow rounded-xl finance-shadow-glow">
            <Target className="h-6 w-6 text-white" />
          </div>
          <span className="finance-text-gradient">Monthly Budgets</span>
        </CardTitle>
        <p className="text-muted-foreground mt-2">Set and manage your spending limits for each category</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add/Edit Budget Form */}
        <div className="space-y-4 p-6 finance-card-glass rounded-2xl border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <Label className="text-lg font-semibold finance-text-gradient">
              {editingBudget ? 'Edit Budget' : 'Set New Budget'}
            </Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select
                value={newBudget.category}
                onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Amount ($)</Label>
              <Input
                id="budget-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newBudget.amount}
                onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end">
              {editingBudget ? (
                <div className="flex gap-3 w-full">
                  <Button 
                    onClick={handleUpdateBudget} 
                    className="flex-1 finance-button-premium"
                  >
                    Update Budget
                  </Button>
                  <Button 
                    variant="outline" 
                    className="finance-card-glass border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      setEditingBudget(null);
                      setNewBudget({ category: '', amount: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleAddBudget} 
                  className="w-full finance-button-premium"
                >
                  Add Budget
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Current Budgets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Month Budgets</h3>
          
          {currentBudgets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No budgets set for this month</h3>
              <p className="text-sm">Set budgets to track your spending goals and stay on track</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentBudgets.map((budget) => {
                const actual = getActualSpending(budget.category);
                const utilization = getBudgetUtilization(budget.category);
                const remaining = budget.amount - actual;
                const isOverBudget = actual > budget.amount;
                const isNearLimit = utilization >= 80 && utilization < 100;

                return (
                  <Card key={budget.id} className="finance-card-elegant finance-hover-lift">
                    <CardContent className="p-6">
                                              <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                              <Target className="h-4 w-4 text-primary" />
                            </div>
                            <h4 className="font-semibold text-lg">{budget.category}</h4>
                            {isOverBudget && (
                              <Badge className="finance-badge-premium bg-gradient-to-r from-destructive to-red-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Over Budget
                              </Badge>
                            )}
                            {isNearLimit && (
                              <Badge className="finance-badge-premium bg-gradient-to-r from-warning to-yellow-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Near Limit
                              </Badge>
                            )}
                            {utilization < 80 && (
                              <Badge className="finance-badge-premium bg-gradient-to-r from-success to-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                On Track
                              </Badge>
                            )}
                          </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="finance-card-glass hover:bg-white/20 text-primary"
                            onClick={() => handleEditBudget(budget)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="finance-card-glass hover:bg-white/20 text-destructive"
                            onClick={() => handleDeleteBudget(budget.category)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Budget</p>
                            <p className="text-xl font-bold text-primary">${budget.amount.toFixed(2)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Spent</p>
                            <p className="text-xl font-bold text-finance-expense">${actual.toFixed(2)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Remaining</p>
                            <p className={cn(
                              "text-xl font-bold",
                              isOverBudget ? "text-destructive" : "text-success"
                            )}>
                              {isOverBudget 
                                ? `-$${Math.abs(remaining).toFixed(2)}` 
                                : `$${remaining.toFixed(2)}`
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Progress</span>
                            <span className="font-bold">{utilization.toFixed(1)}% used</span>
                          </div>
                          <Progress 
                            value={Math.min(utilization, 100)} 
                            className={cn(
                              "h-3 rounded-full",
                              isOverBudget && "bg-destructive/20",
                              isNearLimit && "bg-warning/20",
                              utilization < 80 && "bg-success/20"
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 