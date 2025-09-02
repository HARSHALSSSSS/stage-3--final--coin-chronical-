import React, { useState, useEffect } from 'react';
import { TransactionForm, Transaction } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { FinancialSummary } from '@/components/FinancialSummary';
import { CategoryChart } from '@/components/CategoryChart';
import { BudgetManager, Budget } from '@/components/BudgetManager';
import { BudgetChart } from '@/components/BudgetChart';
import { SpendingInsights } from '@/components/SpendingInsights';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { PiggyBank, Plus, BarChart3, List, Home, Target, Lightbulb } from 'lucide-react';
import heroImage from '@/assets/finance-hero.jpg';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [activeTab, setActiveTab] = useState('overview');

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financeTransactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        // Convert date strings back to Date objects
        const transactionsWithDates = parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(transactionsWithDates);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  }, []);

  // Load budgets from localStorage on component mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem('financeBudgets');
    if (savedBudgets) {
      try {
        const parsed = JSON.parse(savedBudgets);
        setBudgets(parsed);
      } catch (error) {
        console.error('Error loading budgets:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem('financeBudgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    
    setTransactions((prev) => [...prev, newTransaction]);
    toast({
      title: 'Transaction Added',
      description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount.toFixed(2)} has been added.`,
    });
  };

  const handleEditTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id
          ? { ...transactionData, id: editingTransaction.id }
          : t
      )
    );
    
    setEditingTransaction(undefined);
    toast({
      title: 'Transaction Updated',
      description: 'Transaction has been successfully updated.',
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: 'Transaction Deleted',
      description: 'Transaction has been successfully deleted.',
      variant: 'destructive',
    });
  };

  const startEditingTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  const cancelEditing = () => {
    setEditingTransaction(undefined);
  };

  const handleBudgetChange = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    toast({
      title: 'Budget Updated',
      description: 'Your budget settings have been saved.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 finance-gradient-premium opacity-90" />
        </div>
        
        {/* Animated background elements - responsive positioning */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-white/10 rounded-full finance-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-20 sm:top-40 right-8 sm:right-32 w-12 sm:w-20 lg:w-24 h-12 sm:h-20 lg:h-24 bg-white/10 rounded-full finance-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-8 sm:w-16 lg:w-20 h-8 sm:h-16 lg:h-20 bg-white/10 rounded-full finance-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-14 sm:w-24 lg:w-28 h-14 sm:h-24 lg:h-28 bg-white/10 rounded-full finance-float" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center text-white z-10">
          <div className="finance-slide-in">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-full finance-shadow-glow">
                <PiggyBank className="h-8 w-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-lg">
                Coin Chronicle
              </h1>
            </div>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Master your financial destiny with AI-powered insights, intelligent budgeting, and stunning visualizations
            </p>
            
            {/* Premium stats cards - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
              <div className="finance-card-glass-enhanced p-4 sm:p-6 rounded-2xl finance-hover-lift">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 sm:mb-3 finance-text-enhanced text-center">
                  ${(transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)).toFixed(2)}
                </div>
                <p className="text-white font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 text-center drop-shadow-lg">Net Balance</p>
                <div className="w-full h-1.5 sm:h-2 bg-white/40 rounded-full">
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="finance-card-glass-enhanced p-4 sm:p-6 rounded-2xl finance-hover-lift">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 sm:mb-3 finance-text-enhanced text-center">
                  {transactions.length}
                </div>
                <p className="text-white font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 text-center drop-shadow-lg">Transactions</p>
                <div className="w-full h-1.5 sm:h-2 bg-white/40 rounded-full">
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="finance-card-glass-enhanced p-4 sm:p-6 rounded-2xl finance-hover-lift sm:col-span-2 lg:col-span-1">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 sm:mb-3 finance-text-enhanced text-center">
                  {budgets.length}
                </div>
                <p className="text-white font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 text-center drop-shadow-lg">Active Budgets</p>
                <div className="w-full h-1.5 sm:h-2 bg-white/40 rounded-full">
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - responsive layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <button 
                onClick={() => setActiveTab('add')}
                className="finance-button-premium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto max-w-xs"
              >
                Start Tracking
              </button>
              <button 
                onClick={() => setActiveTab('budgets')}
                className="finance-card-glass px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto max-w-xs"
              >
                Set Budgets
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="finance-card-premium p-1 sm:p-2 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 finance-shadow-premium">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-transparent border-0 gap-1 sm:gap-2 h-auto">
              <TabsTrigger 
                value="overview" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium p-2 sm:p-3 text-xs sm:text-sm"
              >
                <Home className="h-3 w-3 sm:h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium p-2 sm:p-3 text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 w-4" />
                <span className="hidden sm:inline">{editingTransaction ? 'Edit' : 'Add'}</span>
                <span className="sm:hidden">Add</span>
              </TabsTrigger>
              <TabsTrigger 
                value="budgets" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium p-2 sm:p-3 text-xs sm:text-sm"
              >
                <Target className="h-3 w-3 sm:h-4 w-4" />
                <span className="hidden sm:inline">Budgets</span>
                <span className="sm:hidden">Budget</span>
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium p-2 sm:p-3 text-xs sm:text-sm col-span-3 sm:col-span-1"
              >
                <List className="h-3 w-3 sm:h-4 w-4" />
                <span className="hidden sm:inline">Transactions</span>
                <span className="sm:hidden">List</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="hidden sm:flex flex-col sm:flex-row items-center gap-1 sm:gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium p-2 sm:p-3 text-xs sm:text-sm"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="hidden sm:flex flex-col sm:flex-row items-center gap-1 sm:gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium p-2 sm:p-3 text-xs sm:text-sm"
              >
                <Lightbulb className="h-3 w-3 sm:h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            <FinancialSummary transactions={transactions} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <MonthlyChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
            {budgets.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <BudgetChart
                  transactions={transactions}
                  budgets={budgets}
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <TransactionList
                transactions={transactions.slice(-5)} // Show only last 5
                onEdit={startEditingTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </TabsContent>

          <TabsContent value="add" className="max-w-full sm:max-w-2xl mx-auto px-2 sm:px-0">
            <TransactionForm
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              editingTransaction={editingTransaction}
              onCancel={editingTransaction ? cancelEditing : undefined}
            />
          </TabsContent>

          <TabsContent value="budgets">
            <div className="space-y-6 sm:space-y-8">
              <BudgetManager
                transactions={transactions}
                budgets={budgets}
                onBudgetChange={handleBudgetChange}
              />
              <BudgetChart
                transactions={transactions}
                budgets={budgets}
              />
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList
              transactions={transactions}
              onEdit={startEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6 sm:space-y-8">
              <FinancialSummary transactions={transactions} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <MonthlyChart transactions={transactions} />
                <CategoryChart transactions={transactions} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <SpendingInsights
              transactions={transactions}
              budgets={budgets}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
