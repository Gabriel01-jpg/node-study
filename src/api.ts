//import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import PlayerController from "./infra/http/PlayerController";

const httpServer = new ExpressAdapter();
//const connection = new PgPromiseAdapter();

new PlayerController(httpServer)

httpServer.listen(3000);