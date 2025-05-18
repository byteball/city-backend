import config from "./config";
import { IHouse, IPlot, IRoad } from "./global";
import { getAllStateVarsByAddress } from "./utils/getAllStateVarsByAddress";

const DATA_LIFETIME = 1000 * 60 * 15; // 15 minutes

interface IState {
    [key: string]: string | number | boolean | object;
}

class Store {
    private last_update_ts: number = 0; // Initialize to 0 to force initial load
    private state: IState | null = null;
    private roads: IRoad[] = [];
    private units: (IPlot | IHouse)[] = [];
    private mayor: string | null = null;

    constructor() {
        // Properties are initialized at their declaration
    }

    private _updateUnitsFromState() {
        if (!this.state) {
            this.units = [];
            return;
        }

        this.units = Object.entries(this.state)
            .filter(([key, value]) => key.startsWith("plot_") || (key.startsWith("house_") && typeof value === "object"))
            .map(([key, unitData]) => {
                const [type, idStr] = key.split("_");
                const id = Number(idStr);

                const mapUnit = unitData as (IHouse | IPlot);
                
                let processedInfo = mapUnit.info;
                if (processedInfo && typeof processedInfo === "string") {
                    try {
                        processedInfo = JSON.parse(processedInfo);
                    } catch { 
                        // Keep original string info if JSON parsing fails
                    }
                }

                if (type === "plot") {
                    return {
                        ...(mapUnit as IPlot),
                        info: processedInfo,
                        type,
                        plot_num: id,
                    } as IPlot;
                } else if (type === "house") {
                    return {
                        ...(mapUnit as IHouse),
                        info: processedInfo,
                        type,
                        house_num: id,
                    } as IHouse;
                }
                console.error(`Unexpected map unit type: ${type} for key ${key}`);
                return null; 
            }).filter(unit => unit !== null) as (IPlot | IHouse)[];
    }

    private _updateMayorFromState() {
        if (!this.state) {
            this.mayor = config.initMayor !== undefined ? config.initMayor : null;
            return;
        }
        // Assuming 'state' key within this.state holds the relevant city state, as per original logic
        const nestedAppState = this.state.state as any; 
        if (nestedAppState && nestedAppState.city_city && nestedAppState.city_city.mayor) {
            this.mayor = nestedAppState.city_city.mayor;
        } else {
            this.mayor = config.initMayor !== undefined ? config.initMayor : null;
        }
    }

    private _updateRoadsFromUnits() {
        if (this.units.length === 0) {
            this.roads = [];
            return;
        }

        this.roads = this.units
            .filter((unit) => (unit.owner === this.mayor || !unit.owner) && unit.type === "house" && unit.info && typeof unit.info === "object")
            .flatMap((unit) => {
                const unitInfo = unit.info as { name?: string }; // Type assertion for info
                const name: string | undefined = unitInfo?.name;

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

    async getActualState(): Promise<IState | null> {
        if (this.state !== null && this.last_update_ts + DATA_LIFETIME >= Date.now()) {
            return this.state;
        } else {
            try {
                this.state = await getAllStateVarsByAddress(config.address!);
                this.last_update_ts = Date.now();
                
                this._updateMayorFromState(); 
                this._updateUnitsFromState();
                this._updateRoadsFromUnits(); 
                
                return this.state;
            } catch (error) {
                console.error("Failed to get actual state:", error);
                this.state = null; 
                this.last_update_ts = 0; 
                this.units = [];
                this.roads = [];
                this.mayor = config.initMayor !== undefined ? config.initMayor : null; // Reset to initial/default
                return null;
            }
        }
    }
    
    async getMapUnits(): Promise<(IPlot | IHouse)[]> {
        await this.getActualState();
        return this.units;
    }

    async getRoads(): Promise<IRoad[]> {
        await this.getActualState();
        return this.roads;
    }

    async getMayor(): Promise<string | null> {
        await this.getActualState();
        return this.mayor;
    }

    async getMapUnit(type: "plot" | "house", number: number): Promise<IPlot | IHouse | null> {
        const currentState = await this.getActualState(); 
        if (!currentState) return null;

        const unitKey = `${type}_${number}`;
        const unitData = currentState[unitKey] as IHouse | IPlot | undefined; // More specific type

        if (unitData && typeof unitData === 'object') {
            let processedInfo = unitData.info;
            if (processedInfo && typeof processedInfo === 'string') {
                try {
                    processedInfo = JSON.parse(processedInfo);
                } catch { /* ignore, keep as string */ }
            }

            // Create a new object with potentially processed info
            const baseUnit = { ...unitData, info: processedInfo };

            if (type === "plot") {
                return {
                    ...baseUnit, // Already has plot properties
                    type, // Ensure type is set
                    plot_num: number, // Ensure plot_num is set
                } as IPlot;
            } else { // house
                return {
                    ...baseUnit, // Already has house properties
                    type, // Ensure type is set
                    house_num: number, // Ensure house_num is set
                } as IHouse;
            }
        } else {
            return null;
        }
    }
}

export default new Store();