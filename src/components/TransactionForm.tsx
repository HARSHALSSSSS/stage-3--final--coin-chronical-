import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Edit3, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
}

export const CATEGORIES = {
  income: [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Rental',
    'Other Income'
  ],
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Housing',
    'Other Expense'
  ]
} as const;

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  editingTransaction?: Transaction;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  editingTransaction,
  onCancel,
}) => {
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState<Date>(editingTransaction?.date || new Date());
  const [type, setType] = useState<'income' | 'expense'>(editingTransaction?.type || 'expense');
  const [category, setCategory] = useState(editingTransaction?.category || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset category when type changes
  useEffect(() => {
    if (!editingTransaction) {
      setCategory('');
    }
  }, [type, editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        amount: Number(amount),
        description: description.trim(),
        date,
        type,
        category,
      });
      
      // Reset form if not editing
      if (!editingTransaction) {
        setAmount('');
        setDescription('');
        setDate(new Date());
        setType('expense');
        setCategory('');
      }
    }
  };

  return (
    <Card className="finance-card-premium finance-shadow-premium border-0 rounded-xl sm:rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-success/10 to-success/5 px-4 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold">
          {editingTransaction ? (
            <>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-primary to-primary-glow rounded-lg sm:rounded-xl finance-shadow-glow">
                <Edit3 className="h-5 w-5 sm:h-6 w-6 text-white" />
              </div>
              <span className="finance-text-gradient">Edit Transaction</span>
            </>
          ) : (
            <>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-success to-green-500 rounded-lg sm:rounded-xl finance-shadow-glow">
                <Plus className="h-5 w-5 sm:h-6 w-6 text-white" />
              </div>
              <span className="finance-text-gradient">Add New Transaction</span>
            </>
          )}
        </CardTitle>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {editingTransaction ? 'Update your transaction details' : 'Track your income and expenses with ease'}
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Transaction Type Toggle */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-base sm:text-lg font-semibold finance-text-gradient">Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className={cn(
                  'h-12 sm:h-16 text-sm sm:text-lg font-semibold finance-transition rounded-lg sm:rounded-xl',
                  type === 'expense' 
                    ? 'finance-gradient-warning-premium text-white shadow-lg' 
                    : 'finance-card-glass hover:bg-white/20 border-white/20 text-finance-expense'
                )}
                onClick={() => setType('expense')}
              >
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-white/20 rounded-md sm:rounded-lg">
                    <TrendingDown className="h-4 w-4 sm:h-5 w-5" />
                  </div>
                  <span>Expense</span>
                </div>
              </Button>
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className={cn(
                  'h-12 sm:h-16 text-sm sm:text-lg font-semibold finance-transition rounded-lg sm:rounded-xl',
                  type === 'income' 
                    ? 'finance-gradient-success-premium text-white shadow-lg' 
                    : 'finance-card-glass hover:bg-white/20 border-white/20 text-finance-income'
                )}
                onClick={() => setType('income')}
              >
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-white/20 rounded-md sm:rounded-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 w-5" />
                  </div>
                  <span>Income</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="amount" className="text-base sm:text-lg font-semibold finance-text-gradient">
              Amount ($)
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  'finance-input-premium text-lg sm:text-xl font-semibold h-12 sm:h-16 text-center pr-12',
                  errors.amount && 'border-destructive focus:ring-destructive'
                )}
              />
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                <DollarSign className="h-5 w-5 sm:h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive font-medium">{errors.amount}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                'finance-transition h-10 sm:h-12',
                errors.description && 'border-destructive focus:ring-destructive'
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={cn(
                'finance-transition h-10 sm:h-12',
                errors.category && 'border-destructive'
              )}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal finance-transition h-10 sm:h-12',
                    !date && 'text-muted-foreground',
                    errors.date && 'border-destructive'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 finance-button-premium h-12 sm:h-16 text-base sm:text-lg font-semibold order-1 sm:order-none"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {editingTransaction ? (
                  <>
                    <Edit3 className="h-4 w-4 sm:h-5 w-5" />
                    <span>Update Transaction</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:h-5 w-5" />
                    <span>Add Transaction</span>
                  </>
                )}
              </div>
            </Button>
            {editingTransaction && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 finance-card-glass border-white/20 text-white hover:bg-white/10 h-12 sm:h-16 text-base sm:text-lg font-semibold order-2 sm:order-none"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};