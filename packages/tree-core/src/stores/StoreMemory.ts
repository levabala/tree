import { left, right } from 'fp-ts/lib/Either';
import { TreeNode } from '../core/node';
import { NodeStore, PutError } from '../core/nodeStore';

export class StoreMemory<T extends string | number> implements NodeStore<T> {
    private nodeMap = new Map<string, TreeNode<T>>();
    private rootNodes: Array<TreeNode<T>> = [];
    private rootDataExisting = new Set<T>();

    put(node: TreeNode<T>) {
        if (this.nodeMap.has(node.id)) {
            return left(PutError.AlreadyExists);
        }

        if (!node.parentId) {
            if ( this.rootDataExisting.has(node.data)) {
                return left(PutError.AlreadyExists);
            }

            this.rootNodes.push(node);
            this.rootDataExisting.add(node.data);
        } else if (!this.nodeMap.has(node.parentId)) {
            return left(PutError.ParentNodeNotFound);
        }

        this.nodeMap.set(node.id, node);

        return right(null);
    }

    get(nodeId: string) {
        return this.nodeMap.get(nodeId) || null;
    }

    getAll() {
        return Array.from(this.nodeMap.values());
    }

    getAllRoot() {
        return this.rootNodes;
    }

    getChildren(nodeId: string) {
        // i know..!
        return this.getAll().filter((node) => node.parentId === nodeId);
    }
}
