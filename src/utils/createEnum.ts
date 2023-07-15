export type Enum<V extends string> = { [key in V]: key };
export type EnumValues<E> = E extends Enum<infer V> ? V : never;

export function createEnum<V extends string>(...values: V[]): Enum<V> {
    return values.reduce<Partial<Enum<V>>>((acc, val) => {
        acc[val] = val;

        return acc;
    }, {}) as Enum<V>;
}
