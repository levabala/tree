import {
    NodeGenerator,
    NodePresenter,
    NodeStore,
    TreeNode,
} from '@tree/tree-core';
import { isLeft, left, right, tryCatch } from 'fp-ts/lib/Either';
import { Chess } from 'chess.js';

type T = string;
type R = Chess;
export class ChessTerminal<I extends string[]> {
    private currentNode: TreeNode<T> | null = null;

    constructor(
        private readonly presenter: NodePresenter<T, I, R>,
        private readonly generator: NodeGenerator<T, I[number]>,
        private readonly store: NodeStore<T>,
    ) {}

    private getCurrentChess() {
        if (this.currentNode === null) {
            return right(new Chess());
        }

        return this.presenter.calcData(this.store, this.currentNode.id);
    }

    printBoard() {
        const chess = this.getCurrentChess();
        if (isLeft(chess)) {
            this.error('Error while printing the board:', chess.left);
            return;
        }


        this.printSpecialStates(chess.right);
        this.log(chess.right.ascii());
    }

    printSpecialStates(chess: Chess) {
        if (chess.isCheck()) {
            this.warn("Check!");
        }
        if (chess.isDraw()) {
            this.warn("Draw!");
        }
        if (chess.isCheckmate()) {
            this.warn("Checkmate!");
        }
        if (chess.isStalemate()) {
            this.warn("Stalemate!");
        }
        if (chess.isThreefoldRepetition()) {
            this.warn("Threefold repetition!");
        }
    }

    back() {
        if (!this.currentNode) {
            const error = 'Can not go back - already at the root';
            this.error(error);

            return left(error);
        }

        if (!this.currentNode.parentId) {
            this.currentNode = null;
            return;
        }

        const previous = this.store.get(this.currentNode.parentId);
        if (!previous) {
            const error = 'Node not found';
            this.error(error);

            return left(error);
        }

        this.currentNode = previous;
    }

    doMove(data: T): void {
        const nodeAlreadyExisting =
            (this.currentNode &&
                this.store
                    .getChildren(this.currentNode.id)
                    .find((node) => node.data === data)) ||
            (!this.currentNode &&
                this.store.getAllRoot().find((node) => node.data === data));

        if (nodeAlreadyExisting) {
            this.log('Go to existing move');
            this.currentNode = nodeAlreadyExisting;
            return;
        }

        const chess = this.getCurrentChess();
        if (isLeft(chess)) {
            this.error('Unexpected error:', chess.left);
            return;
        }

        const moveResult = tryCatch(
            () => chess.right.move(data),
            (e) => (e as Error).message,
        );
        if (isLeft(moveResult)) {
            this.error('Error while doing a move:', moveResult.left);
            return;
        }

        const node = this.generator.createNode({
            author: 'unknown',
            data,
            parentId: this.currentNode?.id,
        });

        const result = this.store.put(node);

        if (isLeft(result)) {
            this.error('Error while doing a move:', result.left);
            return;
        }

        this.currentNode = node;

        this.log('Move', data, 'is done');
    }

    getNextMoves() {
        let children: TreeNode<T>[];
        if (!this.currentNode) {
            children = this.store.getAllRoot();
        } else {
            children = this.store.getChildren(this.currentNode.id);
        }

        const moves = children
            .map((node) => {
                const board = this.presenter.calcData(this.store, node.id);
                if (isLeft(board)) {
                    return null;
                }

                const moves = board.right.history();
                return moves[moves.length - 1];
            })
            .filter(
                (move): move is Exclude<typeof move, null> => move !== null,
            );

        if (!moves.length) {
            const error =
                "No move ahead is available. sadj. but you're at the edge!";
            this.error(error);

            return left(error);
        }

        return right(moves);
    }

    log(...args: unknown[]) {
        console.log(...args);
    }

    error(...args: unknown[]) {
        console.error(...args);
    }

    warn(...args: unknown[]) {
        console.warn(...args);
    }
}
