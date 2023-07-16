import {
    TreeNodeData,
    PresenterText,
    StoreMemory,
    GeneratorText,
} from '@tree/tree-core';
import { isLeft } from 'fp-ts/lib/Either';
import { ViewerTextTerminalUnix } from './ViewerTextTerminalUnix';

const node1 = GeneratorText.createNode({
    author: 'levabala',
    data: 'start text',
});

const node2 = GeneratorText.createNode({
    author: 'levabala',
    data: ' second text',
    parentId: node1.id,
});

const node3 = GeneratorText.createNode({
    author: 'levabala',
    data: '\n newline',
    parentId: node1.id,
});

const node4 = GeneratorText.createNode({
    author: 'levabala',
    data: '\n newline2',
    parentId: node3.id,
});

const nodes = [node1, node2, node3, node4];

const store = new StoreMemory<TreeNodeData<typeof node1>>();

for (const node of nodes) {
    const r = store.put(node);
    if (isLeft(r)) {
        console.log({ node, r });
        throw new Error('node put to store error');
    }
}

new ViewerTextTerminalUnix(store, PresenterText);
