import HttpServer from "../HttpServer";

export default class PlayerController {
    constructor(readonly httpServer: HttpServer) {
        this.httpServer.registerRoute('post', '/players', async function createPlayer() {
            console.log('Creating player...');

            return null;
        });
    }
}