import User from "../../domain/entity/User";
import DatabaseConnection from "../database/DatabaseConnection";

export interface UserRepository {
    saveUser(userId: string, createdAt: Date): Promise<void>;
    findUserById(userId: string): Promise<User>;
    findByPlayerId(playerId: string): Promise<User | null>;
    deleteUserById(userId: string): Promise<void>;
    updateUserImpersonatePlayer(user: User): Promise<User>;
}

export class UserRepositoryDatabase implements UserRepository {

    constructor(readonly connection: DatabaseConnection) {}

    async saveUser(userId: string, createdAt: Date): Promise<void> {
        const [statement, params] = await this.connection.query('INSERT INTO users (id, created_at) VALUES ($1, $2)', [userId, createdAt]);
        console.log(`User ${userId} created at ${createdAt}`);
    }

    async findUserById(userId: string): Promise<User> {
        const [userData] = await this.connection.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = User.restore(userData.id, userData.created_at, userData.impersonate_player);
        return user;
    }

    async findByPlayerId(playerId: string): Promise<User | null> {
        const [userData] = await this.connection.query('SELECT * FROM users WHERE impersonate_player = $1', [playerId]);
        if(userData) {
            const user = User.restore(userData.id, userData.created_at, userData.impersonate_player);
            return user;
        }

        return null
    }

    async deleteUserById(userId: string): Promise<void> {
        const [statement, params] = await this.connection.query('DELETE FROM users WHERE id = $1', [userId]);
    }

    async updateUserImpersonatePlayer(user: User): Promise<User> {
        const query = await this.connection.query('UPDATE users SET impersonate_player = $1, created_at = $2 WHERE id = $3', [user.getImpersonatePlayerId(), user.getCreatedAt(), user.getUserId()]);
        console.log('User updated', query);
        console.log(`User ${user.getUserId()} updated at ${user.getCreatedAt()} with impersonate player ${user.getImpersonatePlayerId()}`);
        //const userUpdated = User.restore(updatedUser.id, updatedUser.created_at, updatedUser.impersonate_player);

        return user;;
    }
}