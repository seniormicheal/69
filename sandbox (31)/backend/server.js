// server.js (Corrected, Final Production Version with Caching)
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Models and Middleware
const User = require('./models/User');
const Order = require('./models/Order');
const { protect } = require('./middleware/auth');

// Data helpers
const countryCodes = require('./country-codes.js');
const countryTranslations = require('./translations.js');
const servicePriority = require('./service-priority.js');

const app = express();
const PORT = process.env.PORT || 3001;
const FIVESIM_API_KEY = process.env.FIVESIM_API_KEY;

// Validate required environment variables
if (!process.env.JWT_SECRET || !FIVESIM_API_KEY) {
  console.error('❌ FATAL ERROR: JWT_SECRET and FIVESIM_API_KEY must be defined in .env file');
  process.exit(1);
}

// --- Middleware ---
app.use(cors({
  origin: [
    'https://cvk33w-5173.csb.app',
    'https://*.csb.app',
    'https://codesandbox.io',
    'http://localhost:3000',
    'http://localhost:5173',
    /^https:\/\/.*\.csb\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// --- 5sim API Client ---
const fiveSimClient = axios.create({
  baseURL: 'https://5sim.net/v1',
  headers: {
    'Authorization': `Bearer ${FIVESIM_API_KEY}`,
    'Accept': 'application/json',
  },
});

// --- Simple In-Memory Cache for Services ---
let servicesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// =================================================================
// --- AUTHENTICATION ROUTES ---
// =================================================================

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'ایمیل یا نام کاربری قبلاً استفاده شده است' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
    const { loginIdentifier, password } = req.body;
    if (!loginIdentifier || !password) {
        return res.status(400).json({ success: false, message: 'Please provide credentials' });
    }

    try {
        const user = await User.findOne({ $or: [{ email: loginIdentifier }, { username: loginIdentifier }] });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            success: true,
            token,
            user: { 
                id: user._id, 
                email: user.email, 
                username: user.username,
                favoriteServices: user.favoriteServices 
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// =================================================================
// --- USER ROUTES (AUTHENTICATED) ---
// =================================================================

app.get('/api/balance', protect, (req, res) => {
    res.json({ success: true, amount: req.user.balance });
});

app.get('/api/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

app.post('/api/user/favorites/toggle', protect, async (req, res) => {
    const { serviceId } = req.body;
    if (!serviceId) {
        return res.status(400).json({ success: false, message: 'Service ID is required' });
    }
    try {
        const user = req.user;
        const index = user.favoriteServices.indexOf(serviceId);
        if (index > -1) {
            user.favoriteServices.splice(index, 1);
        } else {
            user.favoriteServices.push(serviceId);
        }
        await user.save();
        res.json({ success: true, favorites: user.favoriteServices });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/dashboard-stats', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const totalOrders = await Order.countDocuments({ user: userId });
        const spendingAggregation = await Order.aggregate([
            { $match: { user: userId, status: { $in: ['FINISHED', 'RECEIVED', 'ACTIVE', 'PENDING'] } } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const totalSpent = spendingAggregation.length > 0 ? spendingAggregation[0].total : 0;
        const activeOrders = await Order.countDocuments({ user: userId, status: { $in: ['ACTIVE', 'PENDING', 'RECEIVED'] } });
        res.json({
            success: true,
            stats: { balance: req.user.balance, totalOrders, totalSpent, activeOrders, }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server error fetching stats' });
    }
});

app.post('/api/purchase', protect, async (req, res) => {
    const { service_id } = req.body;
    if (!service_id) {
        return res.status(400).json({ message: 'Service ID is required.' });
    }

    const [_, service, country, operator] = service_id.split('_');

    try {
        if (!servicesCache) {
            return res.status(503).json({ message: 'سرویس موقتا در دسترس نیست، لطفا چند لحظه دیگر تلاش کنید' });
        }
        
        const serviceDetails = servicesCache.find(s => s.id === service_id);
        if (!serviceDetails) {
            return res.status(404).json({ message: "سرویس انتخاب شده یافت نشد." });
        }
        const price_toman = serviceDetails.price_toman;

        if (req.user.balance < price_toman) {
            return res.status(402).json({ message: 'اعتبار شما کافی نیست' });
        }

        const purchaseResponse = await fiveSimClient.get(`/user/buy/activation/${country}/${operator}/${service}`);
        const orderData = purchaseResponse.data;

        if (!orderData || !orderData.id) {
            return res.status(409).json({ message: "این سرویس در حال حاضر موجود نیست." });
        }

        // THIS IS THE FIX: Use a direct and atomic database update
        // This is more efficient and avoids the validation error.
        await User.findByIdAndUpdate(req.user.id, { $inc: { balance: -price_toman } });

        await Order.create({
            user: req.user.id,
            orderId_5sim: orderData.id,
            serviceId: service_id,
            service_name: serviceDetails.service_persian,
            country: serviceDetails.country_persian,
            number: orderData.phone,
            price: price_toman,
            status: 'PENDING',
            expiresAt: new Date(orderData.expires)
        });

        res.json({
            order_id: orderData.id,
            number: orderData.phone,
            expiryTimestamp: new Date(orderData.expires).getTime(),
        });

    } catch (error) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('!!! CRITICAL PURCHASE FAILURE !!!');
        console.error('Full Error Details:', error);
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        
        const apiError = error.response?.data;
        if (typeof apiError === 'string' && apiError.toLowerCase().includes('no product')) {
            return res.status(409).json({ message: "این سرویس در حال حاضر موجود نیست. لطفا سرویس دیگری را امتحان کنید." });
        } 
        
        res.status(500).json({ message: "خرید انجام نشد. لطفا دوباره تلاش کنید." });
    }
});

app.post('/api/cancel-order/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        // Step 1: Find the order in our DB to verify ownership and get price for refund
        const internalOrder = await Order.findOne({ orderId_5sim: id, user: req.user.id });
        if (!internalOrder) {
            return res.status(404).json({ message: "سفارش یافت نشد." });
        }
        
        // THE FIX: We have REMOVED the faulty status check.
        // We will now attempt to cancel directly with 5SIM.
        
        // Step 2: Attempt cancellation with 5SIM
        const response = await fiveSimClient.get(`/user/cancel/${id}`);
        
        // Step 3: If 5SIM confirms the cancellation, update our records and refund the user
        if (response.data.status === 'CANCELED') {
            // Only refund if the order wasn't already marked as canceled in our DB
            if (internalOrder.status !== 'CANCELED') {
                await User.findByIdAndUpdate(req.user.id, { $inc: { balance: internalOrder.price } });
                internalOrder.status = 'CANCELED';
                await internalOrder.save();
            }
        }
        
        // Step 4: Send the response from 5SIM back to the user
        res.json(response.data);

    } catch (error) {
        // If 5SIM returns an error (e.g., "order has already been finished"), it will be caught here
        const errorMessage = error.response?.data || 'An unknown error occurred';
        console.error(`Failed to cancel order ${id}:`, errorMessage);
        // We send the actual error message from 5SIM to the frontend
        res.status(400).json({ message: errorMessage });
    }
});

// =================================================================
// --- GUEST ROUTES (UNPROTECTED) ---
// =================================================================
// Note: Guest checkout logic needs to be fully implemented
app.post('/api/purchase-guest', async (req, res) => { res.status(501).json({message: "Not Implemented"}) });
app.get('/api/check-order-guest/:guestId/:id', async (req, res) => { res.status(501).json({message: "Not Implemented"}) });

// =================================================================
// --- PUBLIC ROUTES ---
// =================================================================
app.get('/api/services', async (req, res) => {
    const now = Date.now();
    if (servicesCache && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('Serving services from cache.');
        return res.json(servicesCache);
    }
    try {
        console.log('Fetching fresh services from 5sim...');
        const response = await fiveSimClient.get('/guest/prices');
        const priceData = response.data;
        const RUB_TO_TOMAN_RATE = 1200;
        const allServices = [];
        for (const countryName in priceData) {
            const products = priceData[countryName];
            for (const productName in products) {
                const details = products[productName];
                if (details.cost !== undefined) {
                    allServices.push({ country: countryName, service: productName, operator: 'any', price: details.cost, available: details.count > 0, success_rate: details.rate });
                } else {
                    for (const operatorName in details) {
                        const operatorDetails = details[operatorName];
                        allServices.push({ country: countryName, service: productName, operator: operatorName, price: operatorDetails.cost, available: operatorDetails.count > 0, success_rate: operatorDetails.rate });
                    }
                }
            }
        }
        let formattedServices = allServices.map(s => {
            if (!s) return null;
            const cleanCountry = s.country.toLowerCase();
            const cleanService = s.service.toLowerCase();
            const priorityInfo = servicePriority[cleanService];
            return {
                id: `srv_${cleanService}_${cleanCountry}_${s.operator}`,
                service: s.service,
                service_persian: priorityInfo?.name || s.service,
                country: s.country,
                country_persian: countryTranslations[cleanCountry] || s.country,
                country_code: countryCodes[cleanCountry] || null,
                operator: s.operator,
                price_toman: Math.ceil(s.price * RUB_TO_TOMAN_RATE * 1.2),
                priority: priorityInfo?.priority || 99,
                available: s.available,
                success_rate: s.success_rate || 0,
            };
        }).filter(Boolean);
        formattedServices.sort((a, b) => {
            if (a.available && !b.available) return -1;
            if (!a.available && b.available) return 1;
            if (a.priority !== b.priority) return a.priority - b.priority;
            if (b.success_rate !== a.success_rate) return b.success_rate - a.success_rate;
            return a.price_toman - b.price_toman;
        });
        servicesCache = formattedServices;
        cacheTimestamp = now;
        console.log('Cache updated. Sending fresh services.');
        res.json(formattedServices);
    } catch (error) {
        console.error('Error in /api/services endpoint:', error.message);
        if (servicesCache) {
            console.warn('Serving stale cache due to fetch error.');
            return res.json(servicesCache);
        }
        res.status(500).json({ message: 'Failed to fetch services from provider.' });
    }
});

app.post('/api/cancel-order/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        // Find order by orderId_5sim and user ID
        const internalOrder = await Order.findOne({ orderId_5sim: id, user: req.user.id });
        if (!internalOrder) {
            return res.status(404).json({ message: "سفارش یافت نشد." });
        }
        
        // First, check the actual status from 5sim to ensure we have the latest info
        let currentStatus;
        try {
            const checkResponse = await fiveSimClient.get(`/user/check/${id}`);
            currentStatus = checkResponse.data.status;
            console.log(`Order ${id} - 5sim status: ${currentStatus}, DB status: ${internalOrder.status}`);
        } catch (checkError) {
            console.error(`Failed to check order status from 5sim:`, checkError.response?.data);
            // If we can't check status, use database status as fallback
            currentStatus = internalOrder.status;
        }
        
        // Try to cancel the order with 5sim regardless of local status
        // Let 5sim API decide if cancellation is allowed
        try {
            const response = await fiveSimClient.get(`/user/cancel/${id}`);
            
            if (response.data.status === 'CANCELED') {
                // Refund the user
                if (internalOrder.user) {
                    await User.findByIdAndUpdate(req.user.id, { $inc: { balance: internalOrder.price } });
                }
                
                internalOrder.status = 'CANCELED';
                await internalOrder.save();
                
                res.json({ success: true, status: 'CANCELED', message: 'سفارش با موفقیت لغو شد' });
            } else {
                res.json(response.data);
            }
        } catch (cancelError) {
            // 5sim returned an error when trying to cancel
            const errorData = cancelError.response?.data;
            console.error(`5sim cancel error for order ${id}:`, errorData);
            
            // Return the actual error from 5sim
            if (typeof errorData === 'string') {
                return res.status(400).json({ message: `خطا از سرویس دهنده: ${errorData}` });
            } else {
                return res.status(400).json({ message: 'امکان لغو این سفارش وجود ندارد' });
            }
        }
    } catch (error) {
        console.error(`Failed to cancel order ${id}:`, error);
        res.status(500).json({ message: 'خطا در برقراری ارتباط با سرور' });
    }
});

// =================================================================
// --- START SERVER ---
// =================================================================
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

startServer();

