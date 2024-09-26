import crypto from "crypto";

export default class Player {
    constructor(readonly playerId: string, readonly nickname: string, readonly gold_amount: number,) {
    }

    static create(nickname: string, gold_amount: number) {
        const playerId = crypto.randomUUID();
        return new Player(playerId, nickname, gold_amount);;
    }

    static restore (playerId: string, nickname: string, gold_amount: number) {
		return new Player(playerId, nickname, gold_amount);
	}

    getPlayerId(){
        return this.playerId;
    }

    getNickname(){
        return this.nickname;
    }

    getGoldAmount(){
        return this.gold_amount;
    }
}