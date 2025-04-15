export interface AsyncError {
    message: string;
}

export type AsyncResponse<T> = {
    data?: T;
    error?: AsyncError;
}

export type ThrowablePromise<T> = Promise<AsyncResponse<T>>;