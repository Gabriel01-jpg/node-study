import crypto from "crypto";

export default class User {
    constructor(readonly userId: string, readonly createdAt: Date, private impersonate_player_id: string | null = null) {
    }

    static create() {
        const userId = crypto.randomUUID();
        const createdAt = new Date();
        return new User(userId, createdAt);
    }

    static restore(userId: string, createdAt: Date, impersonate_player_id: string | null) {
        return new User(userId, createdAt, impersonate_player_id);
    }

    impersonate(playerId: string) {
        this.impersonate_player_id = playerId;
    }

    getImpersonatePlayerId() {
        return this.impersonate_player_id;
    }

    getUserId() {
        return this.userId;
    }

    getCreatedAt() {
        return this.createdAt;
    }
}