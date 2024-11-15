import {db} from "../db/db";

export const testingRepository = {
    deleteAllData() {
        db.blogs = [];
        db.posts = [];
    }
}