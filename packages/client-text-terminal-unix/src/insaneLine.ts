import blessed from 'blessed';
import { left, right } from 'fp-ts/lib/Either';

export interface InsaneLine {
    segments: number;
    linesHorizontal: blessed.Widgets.LineElement[];
    linesVertical: blessed.Widgets.LineElement[];
}

export function createInsaneLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    segments: number,
) {
    if (segments <= 0) {
        return left('segments must be greater than zero');
    }

    const widthTotal = x2 - x1;
    const heightTotal = y2 - y1;

    const linesHorizontal = [];
    const linesVertical = [];
    for (let i = 0; i < segments; i++) {
        const perc = i / segments;
        const percN = (i + 1) / segments;

        const top = Math.round(y1 + heightTotal * perc);
        const topNext = Math.round(y1 + heightTotal * percN);
        const left = Math.round(x1 + widthTotal * perc);
        const height = topNext - top;
        const isInverted = topNext < top;
        const lineV = blessed.line({
            top: isInverted ? topNext : top,
            left,
            height: Math.abs(height),
            orientation: 'vertical',
            style: { type: 'line' },
        });
        linesVertical.push(lineV);

        const isLast = i === segments - 1;
        if (!isLast) {
            const leftNext = Math.round(x1 + widthTotal * percN);
            const width = leftNext - left;
            const isInverted = leftNext < left;
            const lineH = blessed.line({
                orientation: 'horizontal',
                top: topNext - 1,
                left: isInverted ? leftNext : left,
                width: Math.abs(width),
            });
            linesHorizontal.push(lineH);
        }
    }

    return right({ linesHorizontal, linesVertical, segments });
}

export function updateInsaneLine(
    { linesVertical, linesHorizontal, segments }: InsaneLine,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
): void {
    const widthTotal = x2 - x1;
    const heightTotal = y2 - y1;

    let linesVerticalCounter = 0;
    let linesHorizontalCounter = 0;
    for (let i = 0; i < segments; i++) {
        const perc = i / segments;
        const percN = (i + 1) / segments;

        const top = Math.round(y1 + heightTotal * perc);
        const topNext = Math.round(y1 + heightTotal * percN);
        const left = Math.round(x1 + widthTotal * perc);
        const height = topNext - top;
        const isInverted = topNext < top;
        const lineV = linesVertical[linesVerticalCounter++];
        lineV.top = isInverted ? topNext + 1 : top;
        lineV.left = left;
        lineV.height = Math.abs(height);

        const isLast = i === segments - 1;
        if (!isLast) {
            const leftNext = Math.round(x1 + widthTotal * percN);
            const width = leftNext - left;
            const isInverted = leftNext < left;
            const lineH = linesHorizontal[linesHorizontalCounter++];
            lineH.top = isInverted ? topNext : topNext - 1;
            lineH.left = isInverted ? leftNext : left;
            lineH.width = Math.abs(width);
        }
    }
}
