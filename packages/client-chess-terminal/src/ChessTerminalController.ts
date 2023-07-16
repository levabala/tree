import { ChessTerminal } from './ChessTerminal';
import readline from 'readline';
import { isLeft } from 'fp-ts/lib/These';

export class ChessTerminalController<I extends string[]> {
    private readonly rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    constructor(private readonly chessTerminal: ChessTerminal<I>) {}

    private question(text: string): Promise<string> {
        return new Promise((res) => {
            this.rl.question(text, (answer) => {
                res(answer);
            });
        });
    }

    private async processInput(input: string) {
        switch (input.trim()) {
            case 'back':
                this.chessTerminal.back();
                break;
            case 'forward':
                const moves = this.chessTerminal.getNextMoves();
                if (isLeft(moves)) {
                    return;
                }

                const move = await this.suggestMove(moves.right);
                if (move) {
                    this.chessTerminal.doMove(move);
                }

                break;
            default:
                this.chessTerminal.doMove(input);
                break;
        }
    }

    private async suggestMove(moves: string[]): Promise<string | null> {
        const movesStr = moves.map((move, index) => `${index + 1}. ${move}`).join('  ');
        const index = await this.question(
            `Enter the move index (other to abort):\n${movesStr}\n`,
        );

        return moves[parseInt(index) - 1] ?? null;
    }

    async waitForInput() {
        const input = await this.question(
            'Enter move or command (back/forward): ',
        );
        await this.processInput(input);
    }
}
