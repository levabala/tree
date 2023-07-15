import {
    CalcDataError,
    CalcDataErrorMap,
    NodePresenter,
} from '../../lib/nodePresenter';
import { NodeStore } from '../../lib/nodeStore';

import blessed from 'blessed';
import { EnumValues, createEnum } from '../../utils/createEnum';
import { Either, Right, isLeft, left, right } from 'fp-ts/lib/Either';
import { TreeNode } from '../../lib/node';
import { InsaneLine, createInsaneLine, updateInsaneLine } from './insaneLine';

const DisplayMode = createEnum('Diff', 'Raw');
type DisplayMode = EnumValues<typeof DisplayMode>;

type R = string;
export class ViewerTextTerminalUnix<T, I extends string[]> {
    private readonly screen;
    private readonly infoBox: blessed.Widgets.BoxElement;
    private mode: DisplayMode = DisplayMode.Diff;
    private nodeToBox = new Map<TreeNode<T>, blessed.Widgets.BoxElement>();
    private parentChildToLine = new Map<string, InsaneLine>();

    constructor(
        private readonly store: NodeStore<T>,
        private readonly presenter: NodePresenter<T, I, R>,
    ) {
        this.screen = blessed.screen();
        this.screen.title = 'Text node viewer';

        this.infoBox = this.createLogBox();
        this.screen.append(this.infoBox);

        this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

        this.log('init');

        this.render();
    }

    private logsCount = 0;
    private log(...args: Array<string | number>) {
        this.infoBox.setContent(
            this.infoBox.content + `\n${++this.logsCount}. ` + args.join(' '),
        );
        this.infoBox.setScroll(this.infoBox.getScrollHeight());
        this.screen.render();
    }

    private createLogBox() {
        return blessed.box({
            border: 'line',
            right: 0,
            bottom: 0,
            width: 40,
            height: 10,
            scrollable: true,
            scrollbar: { style: { bg: 'blue' } },
            mouse: true,
        });
    }

    // setMode(mode: DisplayMode) {
    //     this.mode = mode;

    //     this.render();
    // }

    private render() {
        this.nodeToBox.clear();
        this.drawTree();

        this.screen.render();

        this.createLineElementForNodes(this.store.getAll());
        this.screen.render();
    }

    private drawTree() {
        for (const node of this.store.getAll()) {
            const box = this.drawNode(node.id);
            if (isLeft(box)) {
                this.panic(box.left);
            }

            this.nodeToBox.set(node, box.right);
        }
    }

    private panic(error: string): never {
        console.trace(error);
        process.exit(1);
    }

    private createLineElementForNodes(nodes: Array<TreeNode<T>>) {
        for (const node of nodes) {
            if (node.parentId) {
                const parent = this.store.get(node.parentId);
                if (!parent) {
                    this.panic("I wanted a node but got no node. I'm sad");
                }

                const line = this.createLineElement(parent, node);
                // const line = (createInsaneLine(4, 4, 60, 20, 6) as Right<InsaneLine>).right;
                this.parentChildToLine.set(parent.id + node.id, line);

                for (const l of line.linesVertical) {
                    this.screen.append(l);
                }
                for (const l of line.linesHorizontal) {
                    this.screen.append(l);
                }
            }
        }
    }

    private updateLineElementForNodes(nodes: Array<TreeNode<T>>) {
        for (const node of nodes) {
            if (node.parentId) {
                const parent = this.store.get(node.parentId);
                if (!parent) {
                    this.panic("I wanted a node but got no node. I'm sad");
                }

                const line = this.parentChildToLine.get(parent.id + node.id);
                if (!line) {
                    this.panic('No line to update');
                }
                this.updateLineElement(line, parent, node);
            }
        }
    }

    private getBoxPosition({
        left,
        right,
        bottom,
        top,
    }: blessed.Widgets.BoxElement): blessed.Widgets.Position {
        return { left, right, bottom, top };
    }

    private createLineElement(parent: TreeNode<T>, child: TreeNode<T>) {
        const boxParent = this.nodeToBox.get(parent);
        const boxChild = this.nodeToBox.get(child);

        if (!boxParent || !boxChild) {
            this.panic('No such nodes');
        }

        const x11 = boxParent.lpos.xi;
        const x21 = boxParent.lpos.xl;
        const y11 = boxParent.lpos.yi;
        const y21 = boxParent.lpos.yl;

        const x12 = boxChild.lpos.xi;
        const x22 = boxChild.lpos.xl;
        const y12 = boxChild.lpos.yi;
        const y22 = boxChild.lpos.yl;

        const width1 = x21 - x11;
        const height1 = y21 - y11;

        const width2 = x22 - x12;
        const height2 = y22 - y12;

        const line = createInsaneLine(
            // TODO: fix types
            x11 + Math.ceil(width1 / 2),
            y11 + height1,
            x12 + Math.ceil(width2 / 2),
            y12,
            5,
        );
        if (isLeft(line)) {
            this.panic('Failed to create a line');
        }

        return line.right;
    }

    private updateLineElement(
        line: InsaneLine,
        parent: TreeNode<T>,
        child: TreeNode<T>,
    ) {
        const boxParent = this.nodeToBox.get(parent);
        const boxChild = this.nodeToBox.get(child);

        if (!boxParent || !boxChild) {
            this.panic('No such nodes');
        }

        const x11 = boxParent.lpos.xi;
        const x21 = boxParent.lpos.xl;
        const y11 = boxParent.lpos.yi;
        const y21 = boxParent.lpos.yl;

        const x12 = boxChild.lpos.xi;
        const x22 = boxChild.lpos.xl;
        const y12 = boxChild.lpos.yi;
        const y22 = boxChild.lpos.yl;

        const width1 = x21 - x11;
        const height1 = y21 - y11;

        const width2 = x22 - x12;
        const height2 = y22 - y12;

        updateInsaneLine(
            line,
            // TODO: fix types
            x11 + Math.ceil(width1 / 2),
            y11 + height1,
            x12 + Math.ceil(width2 / 2),
            y12,
        );
    }

    private drawNode(
        nodeId: string,
    ): Either<CalcDataErrorMap['NodeIdNotFound'], blessed.Widgets.BoxElement> {
        const result = this.presenter.calcData(this.store, nodeId);

        if (isLeft(result)) {
            return result;
        }

        const box = blessed.box({
            draggable: true,
            shrink: true,
            align: 'center',
            valign: 'middle',
            border: 'line',
            content: result.right,
            left: result.right === 'start text' ? 5 : 18,
            top: result.right === 'start text' ? 5 : 20,
        });
        box.on('move', () => {
            this.log(box.lpos.xi);
            this.updateLineElementForNodes(this.store.getAll());
        });

        this.screen.append(box);

        return right(box);
    }
}
