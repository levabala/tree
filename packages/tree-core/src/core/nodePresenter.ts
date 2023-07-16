import { Either } from 'fp-ts/lib/Either';
import { NodeGenerator } from '../core/nodeGenerator';
import { NodeStore } from './nodeStore';
import { EnumValues, createEnum } from '../utils/createEnum';

export const CalcDataError = createEnum('NodeIdNotFound');
export type CalcDataError = EnumValues<typeof CalcDataError>;
export type CalcDataErrorMap = typeof CalcDataError;

export interface NodePresenter<T, I extends string[], R, E = unknown> {
    supportedGenerators: I;
    calcData(store: NodeStore<T>, nodeId: string): Either<CalcDataError | E, R>;
}

export type PresenterFromGenerator<
    G extends object,
    R,
    E = unknown,
> = G extends NodeGenerator<infer T, infer I>
    ? NodePresenter<T, [I], R, E>
    : never;
