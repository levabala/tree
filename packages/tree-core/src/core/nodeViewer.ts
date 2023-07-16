import { NodePresenter } from '../core/nodePresenter';
import { NodeStore } from '../core/nodeStore';

export interface TreeViewer<T, I extends string[], R> {
    new (
        store: NodeStore<T>,
        presenter: NodePresenter<T, I, R>,
        nodeId: string,
    ): any;
}
