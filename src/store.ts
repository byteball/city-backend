import config from "./config";
import { IHouse, IPlot, IRoad } from "./global";
import { getAllStateVarsByAddress } from "./utils/getAllStateVarsByAddress";

const DATA_LIFETIME = 1000 * 60 * 15; // 15 minutes


interface IState {
    [key: string]: string | number | boolean | object;
}



class Store {
    private last_update_ts: number = 0;
    private state: IState | null = null;
    private roads: IRoad[] = [];
    private units: (IPlot | IHouse)[] = [];
    private mayor: string | null = null;

    constructor() {
        this.last_update_ts = Date.now();
        this.state = null;
        this.mayor = null;
    }

    async updateMapUnits() {
        const state = await this.getActualState();

        this.units = Object.entries(state || {})
            .filter(([key, unit]) => key.startsWith("plot_") || (key.startsWith("house_") && typeof unit === "object"))
            .map(([key, unit]) => {
                const [type, idStr] = key.split("_");
                const id = Number(idStr)

                const mapUnit = unit as (IHouse | IPlot);
                const unitInfo = mapUnit.info;

                if (unitInfo && typeof unitInfo === "string") {
                    try {
                        const infoJSON = JSON.parse(unitInfo);
                        mapUnit.info = infoJSON;
                    } catch { }
                }

                if (type === "plot") {
                    const plotUnit = mapUnit as IPlot;
                    return {
                        ...plotUnit,
                        type,
                        plot_num: id,
                    } as IPlot;
                } else if (type === "house") {
                    const houseUnit = mapUnit as IHouse;

                    return {
                        ...houseUnit,
                        type,
                        house_num: id,
                        amount: houseUnit.amount,
                    } as IHouse;
                }

                throw new Error(`Unexpected map unit type: ${type}`);
            });

        this.updateMapRoads();
    }

    async updateMayor() {
        const state = await this.getActualState();

        // @ts-ignore
        this.mayor = state.state?.city_city?.mayor! || config.initMayor
    }

    async updateMapRoads() {
        if (this.units.length === 0) {
            await this.updateMapUnits();
        }

        this.roads = this.units
            .filter((unit) => (unit.owner === this.mayor || !unit.owner) && unit.type === "house" && unit.info && typeof unit.info === "object")
            .flatMap((unit) => {
                const name: string | undefined = typeof unit?.info === "object" && "name" in unit?.info ? unit?.info?.name as string : undefined;

                if (name && typeof name === "string") {
                    return [
                        {
                            x: unit.x,
                            y: unit.y,
                            name: `${name} Street`,
                            orientation: "horizontal",
                        },
                        {
                            x: unit.x,
                            y: unit.y,
                            name: `${name} Avenue`,
                            orientation: "vertical",
                        },
                    ];
                } else {
                    return [];
                }
            });
    }

    getMapUnits() {
        return this.units;
    }

    async getRoads() {
        if (this.roads.length === 0) {
            await this.updateMapRoads();
        }

        return this.roads;
    }

    async getMapUnit(type: "plot" | "house", number: number): Promise<IPlot | IHouse | null> {
        const state = await this.getActualState();
        const unit = state[`${type}_${number}`];

        if (unit) {
            if (type === "plot") {
                return unit as IPlot;
            } else {
                return unit as IHouse;
            }
        } else {
            return null;
        }
    }

    async getActualState() {
        if (this.state !== null && this.last_update_ts + DATA_LIFETIME >= Date.now()) { // data is still fresh
            return this.state;
        } else { // update data
            this.state = await getAllStateVarsByAddress(config.address!);
            this.last_update_ts = Date.now();
            await this.updateMapUnits();
            await this.updateMayor();
          
            return this.state;
        }
    }

}

export default new Store();