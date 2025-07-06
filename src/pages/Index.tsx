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
      <header className="relative overflow-hidden min-h-[500px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 finance-gradient-premium opacity-90" />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full finance-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full finance-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-white/10 rounded-full finance-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full finance-float" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 text-center text-white z-10">
          <div className="finance-slide-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full finance-shadow-glow">
                <PiggyBank className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                Coin Chronicle
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Master your financial destiny with AI-powered insights, intelligent budgeting, and stunning visualizations
            </p>
            
            {/* Premium stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="finance-card-glass-enhanced p-6 rounded-2xl finance-hover-lift">
                <div className="finance-text-responsive font-black mb-3 finance-text-enhanced text-center">
                  ${(transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)).toFixed(2)}
                </div>
                <p className="text-white font-bold text-lg mb-4 text-center drop-shadow-lg">Net Balance</p>
                <div className="w-full h-2 bg-white/40 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="finance-card-glass-enhanced p-6 rounded-2xl finance-hover-lift">
                <div className="finance-text-responsive font-black mb-3 finance-text-enhanced text-center">
                  {transactions.length}
                </div>
                <p className="text-white font-bold text-lg mb-4 text-center drop-shadow-lg">Transactions</p>
                <div className="w-full h-2 bg-white/40 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="finance-card-glass-enhanced p-6 rounded-2xl finance-hover-lift">
                <div className="finance-text-responsive font-black mb-3 finance-text-enhanced text-center">
                  {budgets.length}
                </div>
                <p className="text-white font-bold text-lg mb-4 text-center drop-shadow-lg">Active Budgets</p>
                <div className="w-full h-2 bg-white/40 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setActiveTab('add')}
                className="finance-button-premium px-8 py-4 text-lg font-semibold"
              >
                Start Tracking
              </button>
              <button 
                onClick={() => setActiveTab('budgets')}
                className="finance-card-glass px-8 py-4 text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Set Budgets
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="finance-card-premium p-2 rounded-2xl mb-8 finance-shadow-premium">
          <TabsList className="grid w-full grid-cols-6 bg-transparent border-0 gap-2">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium"
            >
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="add" 
              className="flex items-center gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium"
            >
              <Plus className="h-4 w-4" />
              {editingTransaction ? 'Edit' : 'Add'}
            </TabsTrigger>
            <TabsTrigger 
              value="budgets" 
              className="flex items-center gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium"
            >
              <Target className="h-4 w-4" />
              Budgets
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="flex items-center gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium"
            >
              <List className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center gap-2 finance-tab-premium data-[state=active]:finance-gradient-premium"
            >
              <Lightbulb className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
        </div>

          <TabsContent value="overview" className="space-y-8">
            <FinancialSummary transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MonthlyChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
            {budgets.length > 0 && (
              <div className="grid grid-cols-1 gap-8">
                <BudgetChart
                  transactions={transactions}
                  budgets={budgets}
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-8">
              <TransactionList
                transactions={transactions.slice(-5)} // Show only last 5
                onEdit={startEditingTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </TabsContent>

          <TabsContent value="add" className="max-w-2xl mx-auto">
            <TransactionForm
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              editingTransaction={editingTransaction}
              onCancel={editingTransaction ? cancelEditing : undefined}
            />
          </TabsContent>

          <TabsContent value="budgets">
            <div className="space-y-8">
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
            <div className="space-y-8">
              <FinancialSummary transactions={transactions} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
