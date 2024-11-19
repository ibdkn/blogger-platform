import {app} from './app';
import {SETTINGS} from './settings';
import {runDb} from "./db/db";

const startApp = async() => {
    const res = await runDb(SETTINGS.MONGO_URL);
    if (!res) process.exit(1); // Завершаем процесс, если не удалось подключиться

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT);
    });
}

startApp();