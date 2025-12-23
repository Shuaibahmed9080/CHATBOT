import express from 'express';
import multer from 'multer';
import { handleChat } from '../rag/chat.js';
import { handleIngestion } from '../rag/ingestion.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Predefined topic → prompt mapping
const PREDEFINED_PROMPTS = {
    "5G": "Explain 5G technology in simple terms using exactly 2 numbered points (1, 2).",

  "AI": "Explain Artificial Intelligence in simple terms using exactly 3 numbered points (1, 2, 3).",

  "Network Issue": "Explain network issues in simple words using exactly 3 numbered points (1, 2, 3).",

  "Slow Internet": "Explain slow internet problems in simple words using exactly 3 numbered points (1, 2, 3).",

  "Mobile Settings": "Explain mobile settings issues for non-technical users using exactly 3 numbered points (1, 2, 3).",

  "App Problem": "Explain common app problems in simple terms using exactly 3 numbered points (1, 2, 3).",

  "Password Issue": "Explain password-related issues and basic solutions using exactly 3 numbered points (1, 2, 3).",

  "Email Problem": "Explain common email problems in simple language using exactly 3 numbered points (1, 2, 3).",

  "Online Payment Issue": "Explain online payment issues safely for beginners using exactly 3 numbered points (1, 2, 3).",

  "Security Issue": "Explain device security issues for non-technical users using exactly 3 numbered points (1, 2, 3)."
};

// POST /api/chat - Ask a question OR use predefined topic
router.post('/chat', async (req, res) => {
    try {
        let { message, topic } = req.body;

        // If topic is provided, convert it to a prompt
        if (topic) {
            message = PREDEFINED_PROMPTS[topic];
        }

        if (!message) {
            return res.status(400).json({ error: 'Message or topic is required' });
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

// import express from 'express';
// import multer from 'multer';
// import { handleChat } from '../rag/chat.js';
// import { handleIngestion } from '../rag/ingestion.js';

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// // POST /api/chat - Ask a question
// router.post('/chat', async (req, res) => {
//     try {
//         const { message } = req.body;
//         if (!message) {
//             return res.status(400).json({ error: 'Message is required' });
//         }
//         const response = await handleChat(message);
//         res.json({ answer: response });
//     } catch (error) {
//         console.error('Chat error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // POST /api/ingest - Upload a file
// router.post('/ingest', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         await handleIngestion(req.file.path, req.file.mimetype);
//         res.json({ message: 'Ingestion complete' });
//     } catch (error) {
//         console.error('Ingestion error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// export default router;
