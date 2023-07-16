export interface TreeNodeBase {
    nodeVersion: string;
}

export interface TreeNode<T> extends TreeNodeBase {
    nodeVersion: '1';
    id: string;
    author: string;
    generatorId: string;
    data: T;
    timestamp: number;
    parentId?: string;
}

export type TreeNodeData<N extends object> = N extends TreeNode<infer T>
    ? T
    : never;
