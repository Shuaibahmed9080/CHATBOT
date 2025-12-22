import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getVectorStore } from './store.js';
import { Document } from '@langchain/core/documents';

export const handleIngestion = async (filePath, mimeType) => {
    console.log(`Ingesting file: ${filePath} (${mimeType})`);

    let docs = [];

    try {
        if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            // pdf-parse returns .text
            docs = [new Document({ pageContent: data.text, metadata: { source: filePath } })];
        } else if (mimeType === 'application/json') {
            const content = fs.readFileSync(filePath, 'utf-8');
            docs = [new Document({ pageContent: content, metadata: { source: filePath } })];
        } else {
            // Text fallback
            const content = fs.readFileSync(filePath, 'utf-8');
            docs = [new Document({ pageContent: content, metadata: { source: filePath } })];
        }

        console.log(`Loaded ${docs.length} documents from file.`);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await splitter.splitDocuments(docs);
        console.log(`Split into ${splitDocs.length} chunks.`);

        const vectorStore = getVectorStore();
        await vectorStore.addDocuments(splitDocs);
        console.log("Added documents to vector store.");

    } catch (err) {
        console.error("Error during ingestion:", err);
        throw err;
    } finally {
        // Optional: delete file after ingestion
        // fs.unlinkSync(filePath);
    }
};
