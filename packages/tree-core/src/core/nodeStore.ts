import { Either } from 'fp-ts/lib/Either';
import { createEnum, EnumValues } from '../utils/createEnum';
import { TreeNode } from '../core/node';

export const PutError = createEnum(
    'AlreadyExists',
    'Unknown',
    'ParentNodeNotFound',
);
export type PutError = EnumValues<typeof PutError>;

export interface NodeStore<T> {
    put(node: TreeNode<T>): Either<PutError, unknown>;
    get(nodeId: string): TreeNode<T> | null;
    getChildren(nodeId: string): Array<TreeNode<T>>;
    getAllRoot(): Array<TreeNode<T>>;
    getAll(): Array<TreeNode<T>>;
}
