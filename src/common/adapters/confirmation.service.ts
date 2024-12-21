import {randomUUID} from "node:crypto";

export const confirmationService = {
    generateConfirmationCode() {
        const confirmationCode: string = randomUUID();
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        return {confirmationCode, expirationDate};
    }
}