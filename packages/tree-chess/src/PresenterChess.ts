import { left, right, tryCatch } from 'fp-ts/lib/Either';
import { CalcDataError, PresenterFromGenerator } from '@tree/tree-core';
import { GeneratorChess } from './GeneratorChess';
import { Chess } from 'chess.js';
import { isLeft } from 'fp-ts/lib/These';

export const PresenterChess: PresenterFromGenerator<GeneratorChess, Chess, string> = {
    supportedGenerators: [GeneratorChess.id],
    calcData(store, nodeId) {
        const movesReversed: string[] = [];

        let current = store.get(nodeId);
        if (!current) {
            return left(CalcDataError.NodeIdNotFound);
        }

        while (current) {
            movesReversed.push(current.data);

            if (current.parentId) {
                current = store.get(current.parentId);
            } else {
                current = null;
            }
        }

        const moves = movesReversed.reverse();
        const chess = new Chess();

        for (const m of moves) {
            const result = tryCatch(() => chess.move(m), e => (e as Error).message);
            if (isLeft(result)) {
                return result;
            }
        }

        return right(chess);
    },
};
export type PresenterChess = typeof PresenterChess;
