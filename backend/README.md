# Coin Chronicle Backend API

This is the backend API for the Coin Chronicle Tracker application, built with Node.js, Express, and MongoDB.

## Features

- **RESTful API** for transactions and budgets
- **MongoDB Atlas** cloud database integration
- **Real-time data** with proper indexing
- **Error handling** and validation
- **CORS support** for frontend integration
- **Security middleware** (Helmet, Morgan)

## Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with read/write permissions
5. Get your connection string

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit `.env` with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/coin-chronicle?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/category/:category` - Get by category
- `GET /api/transactions/type/:type` - Get by type (income/expense)
- `GET /api/transactions/summary/monthly` - Get monthly summary

### Budgets

- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get budget by ID
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `PATCH /api/budgets/:id/toggle` - Toggle active status
- `GET /api/budgets/active/only` - Get active budgets only
- `GET /api/budgets/category/:category` - Get by category

### Health Check

- `GET /api/health` - API health status

## Database Schema

### Transaction Model

```javascript
{
  description: String (required),
  amount: Number (required, min: 0),
  type: String (required, enum: ['income', 'expense']),
  category: String (required),
  date: Date (required, default: now),
  notes: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Budget Model

```javascript
{
  category: String (required, unique),
  amount: Number (required, min: 0),
  period: String (required, enum: ['monthly', 'weekly', 'yearly']),
  color: String (default: '#3B82F6'),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Development

### Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection
├── models/
│   ├── Transaction.js   # Transaction schema
│   └── Budget.js        # Budget schema
├── routes/
│   ├── transactions.js  # Transaction routes
│   └── budgets.js       # Budget routes
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify database user credentials

2. **CORS Error**
   - Check `CORS_ORIGIN` in `.env` matches your frontend URL
   - Default: `http://localhost:8081`

3. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

### Health Check

Visit `http://localhost:5000/api/health` to verify the API is running.

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB cluster
3. Set up proper CORS origins
4. Use environment variables for sensitive data
5. Consider using PM2 for process management

## Security Notes

- API uses Helmet for security headers
- CORS is configured for specific origins
- Input validation on all endpoints
- Error messages are sanitized in production 