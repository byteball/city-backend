import config from "../config";


interface IAttestation {
    unit: string;
    attestor_address: string;
    profile: {
        [key: string]: string | number | boolean;
    }
}

export const getAttestations = async (address: string): Promise<IAttestation[]> => {
    const response = await fetch(
        `https://${config.TESTNET ? 'testnet.' : ''}obyte.org/api/get_attestations`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
        }
    );
    const data = await response.json() as { data: IAttestation[] };
    return data.data || [];
}