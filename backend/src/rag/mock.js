export class MockEmbeddings {
    async embedDocuments(documents) {
        console.log("⚠️ [MOCK] Generating dummy embeddings for documents...");
        // Return random vectors of size 1536 (OpenAI standard)
        return documents.map(() => Array(1536).fill(0).map(() => Math.random()));
    }

    async embedQuery(text) {
        console.log("⚠️ [MOCK] Generating dummy embedding for query...");
        return Array(1536).fill(0).map(() => Math.random());
    }
}

export class MockChatOpenAI {
    constructor(config) {
        this.modelName = config.modelName;
    }

    async invoke(prompt) {
        console.log("⚠️ [MOCK] Generating dummy chat response...");
        return {
            content: "This is a MOCK response. Your OpenAI API quota is exceeded, so we are providing this placeholder answer to demonstrate that the RAG pipeline flow is functioning correctly. If you were using a valid API key, this would be an intelligent answer based on your documents."
        };
    }
}
