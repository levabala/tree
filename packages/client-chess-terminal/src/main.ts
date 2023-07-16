import { StoreMemory } from '@tree/tree-core';
import { PresenterChess, GeneratorChess } from '@tree/tree-chess';
import { ChessTerminal } from './ChessTerminal';
import { ChessTerminalController } from './ChessTerminalController';

const chess = new ChessTerminal(
    PresenterChess,
    GeneratorChess,
    new StoreMemory(),
);
const controller = new ChessTerminalController(chess);

chess.printBoard();

async function loop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await controller.waitForInput();
        chess.printBoard();
    }
}
loop();
