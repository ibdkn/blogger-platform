import {req} from "./test-helpers";
import {setBlogDB, setPostDB} from "../src/db/db";
import {SETTINGS} from "../src/settings";

describe('DELETE /testing/all-data', () => {
    // Перед каждым тестом очищаем "базу данных"
    beforeAll(async () => {
        setPostDB();
        setBlogDB();
    })
    it('should delete all data', async () => {

        const res = await req
            .delete(SETTINGS.PATH.TESTING)
            .expect(204);

        console.log(res.body);
    });
});