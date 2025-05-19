import description from "../local/description";
import store from "../store";
import { getAddressFromNearestRoad } from "./getAddress";
import { getUserName } from "./getUserName";

export const getPageDescription = async (page: string, params: string[], queryParams?: object): Promise<string> => {
    const pageDescriptionTemplate: string | undefined = description[page];
    let descriptionTemplate = pageDescriptionTemplate || description.default;

    if (page === "" || page === "/") {
        if (queryParams && ("house" in queryParams || "plot" in queryParams)) {
            const roads = await store.getRoads();
            const qp = queryParams as { house?: string; plot?: string };

            const type = qp.house ? "house" : "plot";

            if (qp[type] === undefined || isNaN(Number(qp[type]))) return description.default;

            const unitData = await store.getMapUnit(type, Number(qp[type]));

            if (!unitData) {
                console.log("Unit data not found for", type, qp[type]);
                return description.default;
            }
           
            const address = getAddressFromNearestRoad(roads, unitData);
            const typeView = type === "house" ? "House" : "Plot";

            descriptionTemplate = description.main_with_unit.replaceAll("{address}", address);
            descriptionTemplate = descriptionTemplate.replaceAll("{type}", typeView);
            descriptionTemplate = descriptionTemplate.replaceAll("{name}", unitData.owner ? await getUserName(unitData.owner) : "unknown");

            return descriptionTemplate;
        } else {
            return description.main_empty;
        }
    } else if (page === "user") {
        const wallet_address = params[0];

        if (!wallet_address) return description.default;

        const name = await getUserName(wallet_address);

        descriptionTemplate = descriptionTemplate.replaceAll("{wallet_address}", wallet_address);
        descriptionTemplate = descriptionTemplate.replaceAll("{name}", name);

        return descriptionTemplate;
    } else {
        return descriptionTemplate;
    }
};
