# 🪙 Coin Chronicle Tracker

A modern, full-stack financial tracking application built with React, Node.js, and MongoDB. Track your income, expenses, set budgets, and gain insights into your spending patterns with beautiful visualizations and AI-powered analytics.

![Coin Chronicle Tracker](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 💰 Financial Management
- **Transaction Tracking**: Add, edit, and delete income and expense transactions
- **Category Management**: Organize transactions by custom categories
- **Budget Planning**: Set monthly, weekly, or yearly budgets for different categories
- **Real-time Balance**: Track your net balance with live updates

### 📊 Analytics & Insights
- **Monthly Charts**: Visualize your spending trends over time
- **Category Breakdown**: See where your money goes with pie charts
- **Budget Progress**: Monitor budget utilization with progress indicators
- **Spending Insights**: AI-powered recommendations for better financial habits

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Beautiful, accessible interface with theme support
- **Interactive Charts**: Engaging data visualizations using Recharts
- **Toast Notifications**: Real-time feedback for user actions
- **Smooth Animations**: Polished user experience with CSS animations

### 🔧 Technical Features
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **MongoDB Database**: Scalable NoSQL database for data persistence
- **RESTful API**: Clean, well-documented API endpoints
- **TypeScript**: Type-safe development for better code quality
- **Local Storage**: Offline capability with browser storage
- **CORS Support**: Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Unstyled, accessible UI primitives
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Recharts** - Composable charting library
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variable management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coin-chronicle-tracker-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your MongoDB connection string
   # MONGODB_URI=mongodb://localhost:27017/coin-chronicle
   # PORT=5000
   # CORS_ORIGIN=http://localhost:8081
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   # In a new terminal
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:8081` to see the application

## 📁 Project Structure

```
coin-chronicle-tracker-main/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/ui components
│   │   ├── TransactionForm.tsx   # Transaction input form
│   │   ├── TransactionList.tsx   # Transaction display
│   │   ├── BudgetManager.tsx     # Budget management
│   │   ├── MonthlyChart.tsx      # Monthly spending chart
│   │   ├── CategoryChart.tsx     # Category breakdown
│   │   ├── FinancialSummary.tsx  # Financial overview
│   │   ├── BudgetChart.tsx       # Budget visualization
│   │   └── SpendingInsights.tsx  # AI insights
│   ├── pages/                    # Page components
│   ├── services/                 # API services
│   ├── hooks/                    # Custom React hooks
│   └── lib/                      # Utility functions
├── backend/                      # Backend source code
│   ├── config/                   # Configuration files
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   └── server.js                 # Express server
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## 🔌 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Health Check
- `GET /api/health` - API health status

## 💡 Usage Guide

### Adding Transactions
1. Click "Start Tracking" or navigate to the "Add Transaction" tab
2. Fill in the transaction details:
   - Description
   - Amount
   - Type (Income/Expense)
   - Category
   - Date
   - Optional notes
3. Click "Add Transaction" to save

### Setting Budgets
1. Navigate to the "Budgets" tab
2. Click "Add Budget" to create a new budget
3. Set the category, amount, and period
4. Your budget progress will be tracked automatically

### Viewing Analytics
- **Overview Tab**: See your net balance, transaction count, and active budgets
- **Charts Tab**: Explore monthly spending trends and category breakdowns
- **Insights Tab**: Get AI-powered financial recommendations

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/coin-chronicle
PORT=5000
CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

## 🚀 Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
1. Set up your MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for data visualizations
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ by the Coin Chronicle Team**
