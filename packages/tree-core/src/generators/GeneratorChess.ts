import { randomUUID } from 'crypto';
import { CreateNodeParams, NodeGenerator } from '../core/nodeGenerator';

export interface ChessPosition {
    x: number;
    y: number;
}

export interface ChessMove {
    from: ChessPosition;
    to: ChessPosition;
}

type T = ChessMove;
const id = 'chess generator' as const;

export const GeneratorText: NodeGenerator<T, typeof id> = {
    id,
    createNode(params: CreateNodeParams<T>) {
        return {
            nodeVersion: '1' as const,
            generatorId: this.id,
            id: randomUUID(),
            timestamp: Date.now(),
            ...params,
        };
    },
};
export type GeneratorText = typeof GeneratorText;
