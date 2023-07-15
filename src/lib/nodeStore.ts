import { Either } from 'fp-ts/lib/Either';
import { createEnum, EnumValues } from '../utils/createEnum';
import { TreeNode } from './node';

export const PutError = createEnum(
    'AlreadyExists',
    'Unknown',
    'RootNodeAlreadyExists',
    'ParentNodeNotFound',
);
export type PutError = EnumValues<typeof PutError>;

export interface NodeStore<T> {
    put(node: TreeNode<T>): Either<PutError, unknown>;
    // putMany(nodeArray: Array<TreeNode<T>>): Either<PutError, unknown>;
    get(nodeId: string): TreeNode<T> | null;
    getRoot(): TreeNode<T> | null;
    getAll(): Array<TreeNode<T>>;
}
