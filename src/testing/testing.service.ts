import {testingRepository} from "./testing.repository";

export const testingService = {
    async deleteAllData() {
        await testingRepository.deleteAllData();
    }
}