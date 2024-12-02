import { Primitives as PrimitivesCodely } from "@codelytv/primitives-type";

export type Primitives<T> = Omit<PrimitivesCodely<T>, "id">;

export type PrimitivesWithId<T> = PrimitivesCodely<T>;
