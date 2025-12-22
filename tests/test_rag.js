import dotenv from 'dotenv';
import { handleIngestion } from '../src/rag/ingestion.js';
import { handleChat } from '../src/rag/chat.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const runTest = async () => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error("❌ OPENAI_API_KEY is missing in .env");
            return;
        }

        console.log("🚀 Starting RAG Test...");

        // 1. Create a dummy file
        const dummyFile = 'test_doc.txt';
        const content = "The capital of France is Paris. The currency is the Euro.";
        fs.writeFileSync(dummyFile, content);
        console.log("📝 Created test document.");

        // 2. Ingest
        await handleIngestion(dummyFile, 'text/plain');
        console.log("✅ Ingestion successful.");

        // 3. Chat
        const question = "What is the capital of France?";
        console.log(`❓ Asking: ${question}`);
        const answer = await handleChat(question);

        console.log(`💡 Answer: ${answer}`);

        // Cleanup
        fs.unlinkSync(dummyFile);
        console.log("🧹 Cleanup done.");

    } catch (error) {
        console.error("❌ Test failed:", error);
    }
};

runTest();
