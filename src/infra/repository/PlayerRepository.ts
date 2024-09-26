import Player from "../../domain/entity/Player";
import DatabaseConnection from "../database/DatabaseConnection";

export interface PlayerRepository {
    savePlayer(playerId: string, nickname: string, gold_amount: number): Promise<void>;
    findPlayerById(playerId: string): Promise<Player>;
    deletePlayerById(playerId: string): Promise<void>;
}

export class PlayerRepositoryDatabase implements PlayerRepository {

    constructor(readonly connection: DatabaseConnection) {}

    async savePlayer(playerId: string, nickname: string, gold_amount: number): Promise<void> {
        const [statement, params] = await this.connection.query('INSERT INTO players (id, nickname, gold_amount) VALUES ($1, $2, $3)', [playerId, nickname, gold_amount]);
        console.log(`Player ${playerId} created with nickname ${nickname} and gold amount ${gold_amount}`);
    }

    async findPlayerById(playerId: string): Promise<Player> {
        const [playerData] = await this.connection.query('SELECT * FROM players WHERE id = $1', [playerId]);
        const player = Player.restore(playerData.id, playerData.nickname, playerData.gold_amount);
        return player;
    }

    async deletePlayerById(playerId: string): Promise<void> {
        const [statement, params] = await this.connection.query('DELETE FROM players WHERE id = $1', [playerId]);
    }
}