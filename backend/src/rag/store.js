import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { MockEmbeddings } from './mock.js';
import dotenv from 'dotenv';
dotenv.config();

// Custom Simple Vector Store to avoid LangChain dependency hell
class SimpleVectorStore {
    constructor(embeddings) {
        this.embeddings = embeddings;
        this.documents = []; // { pageContent, metadata, vector }
    }

    async addDocuments(docs) {
        if (!docs.length) return;
        const texts = docs.map(d => d.pageContent);
        const vectors = await this.embeddings.embedDocuments(texts);

        docs.forEach((doc, i) => {
            this.documents.push({
                ...doc,
                vector: vectors[i]
            });
        });
    }

    async similaritySearch(query, k = 4) {
        const queryVector = await this.embeddings.embedQuery(query);

        // Calculate Cosine Similarity
        const similarity = (vecA, vecB) => {
            let dot = 0;
            let magA = 0;
            let magB = 0;
            for (let i = 0; i < vecA.length; i++) {
                dot += vecA[i] * vecB[i];
                magA += vecA[i] * vecA[i];
                magB += vecB[i] * vecB[i];
            }
            return dot / (Math.sqrt(magA) * Math.sqrt(magB));
        };

        const scores = this.documents.map(doc => ({
            doc,
            score: similarity(queryVector, doc.vector)
        }));

        // Sort descending
        scores.sort((a, b) => b.score - a.score);

        // Return top k
        return scores.slice(0, k).map(s => s.doc);
    }
}

let vectorStore = null;

export const getVectorStore = () => {
    if (!vectorStore) {
        const useMock = process.env.USE_MOCK === 'true';

        if (useMock) {
            console.log("⚠️ Using MOCK Embeddings (USE_MOCK=true)");
            vectorStore = new SimpleVectorStore(new MockEmbeddings());
        } else {
            console.log("Initializing Local Embeddings (HuggingFace Transformers)...");
            // Uses Xenova/all-MiniLM-L6-v2 by default (small, fast, runs on CPU)
            vectorStore = new SimpleVectorStore(new HuggingFaceTransformersEmbeddings());
        }
    }
    return vectorStore;
};
