import { left, right } from 'fp-ts/lib/Either';
import { TreeNode } from '../lib/node';
import { NodeStore, PutError } from '../lib/nodeStore';

export class StoreMemory<T extends string | number> implements NodeStore<T> {
    private nodeMap = new Map<string, TreeNode<T>>();
    private nodeRoot: TreeNode<T> | null = null;

    put(node: TreeNode<T>) {
        if (this.nodeMap.has(node.id)) {
            return left(PutError.AlreadyExists);
        }

        if (!node.parentId) {
            if (this.nodeRoot) {
                return left(PutError.RootNodeAlreadyExists);
            }

            this.nodeRoot = node;
        } else if (!this.nodeMap.has(node.parentId)) {
            return left(PutError.ParentNodeNotFound);
        }

        this.nodeMap.set(node.id, node);

        return right(null);
    }

    get(nodeId: string) {
        return this.nodeMap.get(nodeId) || null;
    }

    getRoot() {
        return this.nodeRoot;
    }

    getAll() {
        return Array.from(this.nodeMap.values());
    }
}
