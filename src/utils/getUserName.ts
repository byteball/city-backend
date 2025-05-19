import config from "../config";
import store from "../store";
import { getAttestations } from "./getAttestations";

export const getUserName = async (wallet_address: string): Promise<string> => {
    let name = "unknown";

    const state = await store.getActualState();
    interface UserInfo {
        name?: string;
    }

    const userInfo = state?.[`user_${wallet_address}`] as UserInfo | undefined;

    if (userInfo && userInfo.name) {
        name = userInfo.name;
    } else { // try to get from attestation service
        const attestations = await getAttestations(wallet_address);

        const telegramName = attestations.find(att => att.attestor_address === config.TELEGRAM_ATTESTOR)?.profile.username as string | undefined;

        if (telegramName) {
            return telegramName;
        } else {
            const discordName = attestations.find(att => att.attestor_address === config.DISCORD_ATTESTOR)?.profile.username as string | undefined;

            if (discordName) {
                return discordName;
            }
        }
    }

    return name;
}