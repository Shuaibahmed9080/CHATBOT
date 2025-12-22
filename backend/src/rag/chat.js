import { ChatOpenAI } from '@langchain/openai';
import { MockChatOpenAI } from './mock.js';
import { getVectorStore } from './store.js';
import dotenv from 'dotenv';
dotenv.config();

export const handleChat = async (userMessage) => {
    const vectorStore = getVectorStore();

    // 1. Retrieve
    const relevantDocs = await vectorStore.similaritySearch(userMessage, 4);
    console.log(`Retrieved ${relevantDocs.length} relevant docs.`);

    // Fallback if no docs
    const context = relevantDocs.length
        ? relevantDocs.map(doc => doc.pageContent).join("\n\n")
        : "No relevant documents found.";

    // 2. Generate
    let model;
    if (process.env.USE_MOCK === 'true') {
        console.log("⚠️ Using MOCK Chat Model (USE_MOCK=true)");
        model = new MockChatOpenAI({ modelName: "mock-openrouter" });
    } else {
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        const openRouterModel = process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct:free";

        if (!openRouterKey) {
            throw new Error("OPENROUTER_API_KEY is missing in .env");
        }

        console.log(`Using OpenRouter Model: ${openRouterModel}`);

        model = new ChatOpenAI({
            modelName: openRouterModel,
            apiKey: openRouterKey,
            configuration: {
                baseURL: "https://openrouter.ai/api/v1",
                defaultHeaders: {
                    "HTTP-Referer": "http://localhost:3000", // Optional, required by OpenRouter for ranking
                    "X-Title": "NodeRAGChatbot"
                }
            },
            temperature: 0,
        });
    }

    // Simplest: just use string prompt.
    // In a real app we'd build a proper prompt string.
    const prompt = `Answer the question based only on the following context:
${context}

Question: ${userMessage}

Answer:`;

    const response = await model.invoke(prompt);

    return response.content;
};
