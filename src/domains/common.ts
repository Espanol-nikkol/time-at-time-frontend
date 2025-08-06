export type Iso<A, B> = {
    get: (a: A) => B;
    from: (b: B) => A;
};
