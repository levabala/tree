import { GeneratorText } from './generators/GeneratorText';
import { StoreMemory } from './stores/StoreMemory';
import { PresenterText } from './presenters/PresenterText';
import { TreeNodeData } from './lib/node';
import { ViewerTextTerminalUnix } from './viewers/ViewerTextTerminalUnix';
import { isLeft } from 'fp-ts/lib/Either';

const node1 = GeneratorText.createNode({
    author: 'levabala',
    data: 'start text',
});

const node2 = GeneratorText.createNode({
    author: 'levabala',
    data: ' second text',
    parentId: node1.id,
});

const store = new StoreMemory<TreeNodeData<typeof node1>>();
const r1 = store.put(node1);
const r2 = store.put(node2);
if (isLeft(r1) || isLeft(r2)) {
    console.log({ r1, r2, store, node1, node2 });
    throw new Error('loh');
}

new ViewerTextTerminalUnix(store, PresenterText);
