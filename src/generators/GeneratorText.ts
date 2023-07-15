import { randomUUID } from 'crypto';
import { CreateNodeParams, NodeGenerator } from '../lib/nodeGenerator';

type T = string;
const id = 'simple text generator' as const;

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
