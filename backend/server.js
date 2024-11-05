import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust to your frontend URL without trailing slash
    credentials: true // Allow credentials for session handling
}));
app.use(express.json()); // Parse JSON bodies

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true in production for HTTPS, false in dev
        httpOnly: true, // Prevents JavaScript access to cookies
        sameSite: 'lax' // Cross-origin access within the same site
    }
}));

// Use imageRoutes for handling registration and image upload
app.use('/api', imageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Serve client build files (if using React or another frontend framework)
app.use(express.static(path.join(__dirname, "/virtualPhotobooth/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "virtualPhotobooth", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});
