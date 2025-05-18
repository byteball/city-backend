import { FastifyReply, FastifyRequest } from 'fastify';
import path from "path";
import fs from "fs/promises";

export const getIndexPageWithSeoTags = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const indexPath = path.resolve('/app', 'static', 'index.html');
    
    try {
        const htmlData = await fs.readFile(indexPath, 'utf8');
        reply.type('text/html').send(htmlData);
    } catch (error) {
        console.error(`Error reading or sending index.html from ${indexPath}:`, error);
        if (!reply.sent) {
            reply.status(500).send("Internal Server Error: Could not load the page.");
        }
    }
};