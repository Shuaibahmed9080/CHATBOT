import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
console.log(
  "OPENROUTER KEY LOADED:",
  !!process.env.OPENROUTER_API_KEY
);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins for now
app.use(express.json());


// Routes
app.use('/api', apiRoutes);



// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
