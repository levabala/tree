import { left, right } from 'fp-ts/lib/Either';
import { GeneratorText } from '../generators/GeneratorText';
import { CalcDataError, PresenterFromGenerator } from '../core/nodePresenter';

export const PresenterText: PresenterFromGenerator<GeneratorText, string> = {
    supportedGenerators: [GeneratorText.id],
    calcData(store, nodeId) {
        const chunks: string[] = [];

        let current = store.get(nodeId);
        if (!current) {
            return left(CalcDataError.NodeIdNotFound);
        }

        while (current) {
            chunks.push(current.data);

            if (current.parentId) {
                current = store.get(current.parentId);
            } else {
                current = null;
            }
        }

        return right(chunks.reverse().join(''));
    },
};
export type PresenterText = typeof PresenterText;
