"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const db_js_1 = require("./config/db.js");
async function start() {
    try {
        await (0, db_js_1.connectDB)();
        app_js_1.app.listen(env_js_1.env.port, () => {
            console.log(`[server] API listening on http://localhost:${env_js_1.env.port}/api/v1`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
void start();
//# sourceMappingURL=server.js.map