import User from "../../domain/entity/User";
import { PlayerRepository } from "../../infra/repository/PlayerRepository";
import { UserRepository } from "../../infra/repository/UserRepository";

export class ImpersonatePlayer {
    constructor(readonly userRepository: UserRepository, readonly player: PlayerRepository){}

    async execute(userId: string, playerId: string): Promise<User> {
        let user = await this.userRepository.findUserById(userId);
        const player = await this.player.findPlayerById(playerId);

        const alreadyImpersonating = await this.userRepository.findByPlayerId(player.getPlayerId());

        if(alreadyImpersonating) {
            throw new Error('Player is already being impersonated');
        }

        user.impersonate(player.playerId);
        user = await this.userRepository.updateUserImpersonatePlayer(user);

        return user;
    }
}