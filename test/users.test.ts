import Player from "../src/domain/entity/Player";
import User from "../src/domain/entity/User";
import { ImpersonatePlayer } from "../src/application/usecases/ImpersonatePlayer";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { UserRepositoryDatabase } from "../src/infra/repository/UserRepository";
import { PlayerRepositoryDatabase } from "../src/infra/repository/PlayerRepository";

describe('Users tests', () => {

    const connection = new PgPromiseAdapter();
    
    const userRepository = new UserRepositoryDatabase(connection);
    const playerRepository = new PlayerRepositoryDatabase(connection);

    let user = User.create();
    let player = Player.create('Punisher', 0);

    test('User should be able to impersonate a player', async () => {
        
        await userRepository.saveUser(user.getUserId(), user.getCreatedAt());
        await playerRepository.savePlayer(player.getPlayerId(), player.getNickname(), player.getGoldAmount());
            
        const impersonatePlayerUseCase = new ImpersonatePlayer(userRepository, playerRepository);
    
        user = await impersonatePlayerUseCase.execute(user.getUserId(), player.getPlayerId());
    
        const playerId = player.getPlayerId();
    
        expect(user.getImpersonatePlayerId()).toBe(playerId);

    });

    let user2 = User.create();

    test('User should not be able to impersonate more than one player at a time', async () => {

        await userRepository.saveUser(user2.getUserId(), user2.getCreatedAt());

        const impersonatePlayerUseCase = new ImpersonatePlayer(userRepository, playerRepository);

        await expect(() => impersonatePlayerUseCase.execute(user2.getUserId(), player.getPlayerId())).rejects.toThrow('Player is already being impersonated');
    }); 


    afterAll(async () => {
        await userRepository.deleteUserById(user.getUserId());
        await playerRepository.deletePlayerById(player.getPlayerId());

        await connection.close();
    })
});

