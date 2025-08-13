import config from "../config";
import { getDailyTs } from "./getDailyTs";

const OG_IMAGE_VERSION = '3' as const; // version for OG image URL

export const getOgImageUrl = (pagePath: string = "unit", queryParams: Record<string, any>, secondParam?: string) => {
    const page = pagePath.toLowerCase() || "unit";

    let url = config.FRONT_END_URL + '/og/' + page;
    const { plot, house } = queryParams;
    const cacheTs = getDailyTs();

    if (page === "unit") {
        if (plot !== undefined || house !== undefined) {
            url = url + '?' + new URLSearchParams(queryParams).toString()+ `&v=${OG_IMAGE_VERSION}&ts=${cacheTs}`;
        } else {
            url = url + `?v=${OG_IMAGE_VERSION}`;
        }
    } else if (page === "user" && secondParam !== undefined) {
        url = url + `?address=${secondParam}&v=${OG_IMAGE_VERSION}&ts=${cacheTs}`;
    } else {
        url = url + `?v=${OG_IMAGE_VERSION}`;
    }

    return url;
}
