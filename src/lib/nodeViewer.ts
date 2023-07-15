import { NodePresenter } from './nodePresenter';
import { NodeStore } from './nodeStore';

export interface TreeViewer<T, I extends string[], R> {
    new (
        store: NodeStore<T>,
        presenter: NodePresenter<T, I, R>,
        nodeId: string,
    ): any;
}
