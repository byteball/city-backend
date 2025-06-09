import { FastifyReply, FastifyRequest } from 'fastify';
import path from "path";
import fs from "fs/promises";
import { getPageTitle } from '../utils/getPageTitle';
import { getPageDescription } from '../utils/getPageDescription';
import config from '../config';

const OG_IMAGE_VERSION = 'v2' as const; // version for OG image URL

export const getIndexPageWithSeoTags = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {

    if (!config.FRONT_DIST_PATH) {
        console.error('FRONT_DIST_PATH is not configured');
        reply.status(500).send("Internal Server Error: Frontend path not configured.");
        return;
    }

    try {

        const indexPath = path.resolve(config.FRONT_DIST_PATH!, 'index.html');

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

        htmlData = htmlData.replaceAll("____META_OG_IMAGE_URL____", config.FRONT_END_URL + '/og/' + (page || "unit") + (!page && (queryParams.plot || queryParams.house) ? ('?' + new URLSearchParams(queryParams).toString()) + `&${OG_IMAGE_VERSION}`: `?${OG_IMAGE_VERSION}`));

        reply.type('text/html').header('Cache-Control', 'public, max-age=300').send(htmlData);  // Cache for 5 minutes
    } catch (error) {
        if (!reply.sent) {
            reply.status(500).send("Internal Server Error: Could not load the page.");
        }
    }
};