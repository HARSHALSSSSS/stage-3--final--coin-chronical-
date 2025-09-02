# 🚀 MongoDB Setup Guide for Coin Chronicle

## Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)
4. Select your preferred cloud provider and region
5. Click "Create Cluster"

### Step 2: Get Your Connection String

1. In your cluster, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

### Step 3: Configure Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create environment file:
   ```bash
   copy env.example .env
   ```

3. Edit `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/coin-chronicle?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:8081
   ```

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see: `🚀 Coin Chronicle API Server running on port 5000`

### Step 5: Test Connection

Visit: `http://localhost:5000/api/health`

You should see: `{"status":"OK","message":"Coin Chronicle API is running"}`

## 🎉 You're Done!

Your Coin Chronicle app now has:
- ✅ **MongoDB Atlas** cloud database
- ✅ **RESTful API** backend
- ✅ **Real-time data** persistence
- ✅ **Professional setup** ready for production

## Next Steps

1. **Frontend Integration**: The frontend is already configured to use the API
2. **Data Migration**: Your existing localStorage data can be migrated
3. **Production**: Deploy to platforms like Heroku, Vercel, or Railway

## Troubleshooting

- **Connection Error**: Check your MongoDB connection string
- **CORS Error**: Ensure frontend is running on port 8081
- **Port Busy**: Change PORT in .env file

## Benefits of MongoDB

- 🌐 **Cloud Storage** - Data accessible from anywhere
- 🔄 **Real-time Sync** - Multiple devices stay in sync
- 📊 **Scalable** - Handles growing data needs
- 🔒 **Secure** - Built-in security features
- 💰 **Free Tier** - 512MB storage, perfect for personal use 