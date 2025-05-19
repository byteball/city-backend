import { FastifyReply, FastifyRequest } from 'fastify';
import path from "path";
import fs from "fs/promises";
import { getPageTitle } from '../utils/getPageTitle';
import { getPageDescription } from '../utils/getPageDescription';
import config from '../config';

export const getIndexPageWithSeoTags = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Serve the index.html file from the static directory
    // If the file does not exist, fetch it from the remote URL and cache it
    // If the cached file is older than 5 minutes, fetch it again

    const staticDir = path.resolve('static');
    await fs.mkdir(staticDir, { recursive: true });
    const indexPath = path.resolve(staticDir, 'index.html');

    try {

        const stats = await fs.stat(indexPath).catch(() => null);

        if (stats && (Date.now() - stats.mtimeMs) < 5 * 60 * 1000) {
            console.log('Cached index.html is fresh; skipping remote fetch');
        } else {
            const res = await fetch(process.env.FRONT_END_URL!);

            if (!res.ok) {
                console.error(`Failed to download index.html, status ${res.status}`);
            } else {
                const remoteHtml = await res.text();
                await fs.writeFile(indexPath, remoteHtml, 'utf8');
            }
        }
    } catch (err) {
        console.error('Error fetching remote index.html:', err);
    }

    try {
        let htmlData = await fs.readFile(indexPath, 'utf8');

        // Split originalUrl into path and query string
        const [urlPath, queryString = ""] = request.originalUrl.split('?')

        // Parse query parameters into an object
        const queryParams = Object.fromEntries(new URLSearchParams(queryString))

        // Extract page and the rest of the path segments
        const [_, page, ...rest] = urlPath.split('/')

        const title = await getPageTitle(page, rest, queryParams)
        const description = await getPageDescription(page, rest, queryParams);

        htmlData = htmlData.replaceAll("____META_OG_TITLE____", title);
        htmlData = htmlData.replaceAll("____META_DESCRIPTION____", description);

        htmlData = htmlData.replaceAll("____META_OG_IMAGE_URL____", config.FRONT_END_URL + '/og/' + (page || "unit") + (!page && (queryParams.plot || queryParams.house) ? ('?' + new URLSearchParams(queryParams).toString()) : ''));

        reply.type('text/html').header('Cache-Control', 'public, max-age=300').send(htmlData);  // Cache for 5 minutes
    } catch (error) {
        console.error(`Error reading or sending index.html from ${indexPath}:`, error);
        if (!reply.sent) {
            reply.status(500).send("Internal Server Error: Could not load the page.");
        }
    }
};