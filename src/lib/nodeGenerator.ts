import { TreeNode } from './node';

export type CreateNodeParams<T> = Omit<
    TreeNode<T>,
    'generatorId' | 'nodeVersion' | 'timestamp' | 'id'
>;

export interface NodeGenerator<T, I extends string> {
    id: I;
    createNode(params: CreateNodeParams<T>): TreeNode<T>;
}
