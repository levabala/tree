import * as uuid from 'uuid';
import { CreateNodeParams, NodeGenerator } from '@tree/tree-core';

type T = string;
const id = 'chess generator' as const;

export const GeneratorChess: NodeGenerator<T, typeof id> = {
    id,
    createNode(params: CreateNodeParams<T>) {
        return {
            nodeVersion: '1' as const,
            generatorId: this.id,
            id: uuid.v4(),
            timestamp: Date.now(),
            ...params,
        };
    },
};
export type GeneratorChess = typeof GeneratorChess;
