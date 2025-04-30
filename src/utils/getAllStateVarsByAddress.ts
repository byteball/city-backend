import { getStateVars } from "./getStateVars";

const MAX_ITERATIONS = 100 as const; // Safety limit

interface IAaStateVars {
    [key: string]: string | number | boolean | object;
}

export const getAllStateVarsByAddress = async (address: string) => {
    let aaState: IAaStateVars = {};
    let iteration = 0;

    try {
        let lastKey = "";

        while (true) {
            if (iteration++ > MAX_ITERATIONS) {
                throw new Error(`Reached maximum iterations (${MAX_ITERATIONS}) when fetching AA state vars`);
            }

            let chunkData: IAaStateVars = {};

            chunkData = await getStateVars({ address, var_prefix_from: lastKey ?? "" }) as IAaStateVars;

            const keys = Object.keys(chunkData);

            if (keys.length > 1) {
                aaState = { ...aaState, ...chunkData };
                lastKey = keys[keys.length - 1];
            } else {
                break;
            }
        }
    } catch (e) {
        console.log("Error: ", e);
        throw new Error("Failed to load AA state vars");
    }

    return aaState;
};

