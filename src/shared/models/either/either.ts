type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: U[P];
};

export type Either<T, U> = Only<T, U> | Only<U, T>;