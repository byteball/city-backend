import { IPlot } from "../global";
import titles from "../local/titles";
import store from "../store";
import { getAddressFromNearestRoad } from "./getAddress";
import { getUserName } from "./getUserName";

export const getPageTitle = async (page: string, params: string[], queryParams?: object): Promise<string> => {
    const pageTitleTemplate: string | undefined = titles[page];
    let titleTemplate = pageTitleTemplate || "Obyte City";

    if (page === "claim") {
        const [plot1, plot2] = params[0]?.split("-") || [];

        if (plot1 && plot2) {
            const state = await store.getActualState();

            const plot1Data = state?.[`plot_${plot1}`] as IPlot | undefined;
            const plot2Data = state?.[`plot_${plot2}`] as IPlot | undefined;

            if (plot1Data && plot2Data) {
                const plot1Owner = plot1Data.owner;
                const plot2Owner = plot2Data.owner;

                const name1 = plot1Owner ? await getUserName(plot1Owner) : "unknown";
                const name2 = plot2Owner ? await getUserName(plot2Owner) : "unknown";
                titleTemplate = titleTemplate.replaceAll("{name1}", name1);
                titleTemplate = titleTemplate.replaceAll("{name2}", name2);

                return titleTemplate;
            }
        }

        return titles.default;
    } else if (page === "" || page === "/") {
        if (queryParams && ("house" in queryParams || "plot" in queryParams)) {
            const roads = await store.getRoads();
            const qp = queryParams as { house?: string; plot?: string };

            const type = qp.house ? "house" : "plot";

            if (qp[type] === undefined) return titles.default;

            const unitData = await store.getMapUnit(type, Number(qp[type]));

            if (!unitData) {
                console.log("Unit data not found for", type, qp[type]);
                return titles.default;
            }
           
            const address = getAddressFromNearestRoad(roads, unitData);

            titleTemplate = titles.main_with_unit.replaceAll("{address}", address);

            return titleTemplate;
        } else {
            return titles.main_empty;
        }
    } else if (page === "user") {
        const wallet_address = params[0];

        if (!wallet_address) return titles.default;

        const name = await getUserName(wallet_address);

        titleTemplate = titleTemplate.replaceAll("{wallet_address}", wallet_address);
        titleTemplate = titleTemplate.replaceAll("{name}", name);

        return titleTemplate;
    } else {
        return titleTemplate;
    }
};
