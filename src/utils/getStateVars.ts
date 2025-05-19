import config from "../config";

interface IGetStateVarsProps {
    address: string,
    var_prefix?: string
    var_prefix_from?: string,
    var_prefix_to?: string
}

export const getStateVars = async (body: IGetStateVarsProps): Promise<object> => {
    const response = await fetch(
        `https://${config.TESTNET ? 'testnet.' : ''}obyte.org/api/get_aa_state_vars`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );
    const data = await response.json() as { data: object };
    return data.data || {};
}
