import express from 'express';
import multer from 'multer';
import { handleChat } from '../rag/chat.js';
import { handleIngestion } from '../rag/ingestion.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/chat - Ask a question
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const response = await handleChat(message);
        res.json({ answer: response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/ingest - Upload a file
router.post('/ingest', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        await handleIngestion(req.file.path, req.file.mimetype);
        res.json({ message: 'Ingestion complete' });
    } catch (error) {
        console.error('Ingestion error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
