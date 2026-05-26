import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { CreateMediaBody, HealthStatus, MediaItem, RequestUploadUrlBody, RequestUploadUrlResponse, UpdateMediaBody } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRequestUploadUrlUrl: () => string;
/**
 * @summary Request a presigned upload URL
 */
export declare const requestUploadUrl: (requestUploadUrlBody: RequestUploadUrlBody, options?: RequestInit) => Promise<RequestUploadUrlResponse>;
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<RequestUploadUrlBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<RequestUploadUrlBody>;
}, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<RequestUploadUrlBody>;
export type RequestUploadUrlMutationError = ErrorType<unknown>;
/**
* @summary Request a presigned upload URL
*/
export declare const useRequestUploadUrl: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<RequestUploadUrlBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<RequestUploadUrlBody>;
}, TContext>;
export declare const getGetObjectUrl: (objectPath: string) => string;
export declare const getObject: (objectPath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetObjectQueryKey: (objectPath: string) => readonly [`/api/storage/objects/${string}`];
export declare const getGetObjectQueryOptions: <TData = Awaited<ReturnType<typeof getObject>>, TError = ErrorType<unknown>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getObject>>>;
export type GetObjectQueryError = ErrorType<unknown>;
export declare function useGetObject<TData = Awaited<ReturnType<typeof getObject>>, TError = ErrorType<unknown>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListMediaUrl: () => string;
/**
 * @summary List all media items
 */
export declare const listMedia: (options?: RequestInit) => Promise<MediaItem[]>;
export declare const getListMediaQueryKey: () => readonly ["/api/media"];
export declare const getListMediaQueryOptions: <TData = Awaited<ReturnType<typeof listMedia>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMedia>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMedia>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMediaQueryResult = NonNullable<Awaited<ReturnType<typeof listMedia>>>;
export type ListMediaQueryError = ErrorType<unknown>;
/**
 * @summary List all media items
 */
export declare function useListMedia<TData = Awaited<ReturnType<typeof listMedia>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMedia>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateMediaUrl: () => string;
/**
 * @summary Create a media record
 */
export declare const createMedia: (createMediaBody: CreateMediaBody, options?: RequestInit) => Promise<MediaItem>;
export declare const getCreateMediaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedia>>, TError, {
        data: BodyType<CreateMediaBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMedia>>, TError, {
    data: BodyType<CreateMediaBody>;
}, TContext>;
export type CreateMediaMutationResult = NonNullable<Awaited<ReturnType<typeof createMedia>>>;
export type CreateMediaMutationBody = BodyType<CreateMediaBody>;
export type CreateMediaMutationError = ErrorType<unknown>;
/**
* @summary Create a media record
*/
export declare const useCreateMedia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedia>>, TError, {
        data: BodyType<CreateMediaBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMedia>>, TError, {
    data: BodyType<CreateMediaBody>;
}, TContext>;
export declare const getUpdateMediaUrl: (id: string) => string;
/**
 * @summary Update a media item
 */
export declare const updateMedia: (id: string, updateMediaBody: UpdateMediaBody, options?: RequestInit) => Promise<MediaItem>;
export declare const getUpdateMediaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedia>>, TError, {
        id: string;
        data: BodyType<UpdateMediaBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMedia>>, TError, {
    id: string;
    data: BodyType<UpdateMediaBody>;
}, TContext>;
export type UpdateMediaMutationResult = NonNullable<Awaited<ReturnType<typeof updateMedia>>>;
export type UpdateMediaMutationBody = BodyType<UpdateMediaBody>;
export type UpdateMediaMutationError = ErrorType<unknown>;
/**
* @summary Update a media item
*/
export declare const useUpdateMedia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedia>>, TError, {
        id: string;
        data: BodyType<UpdateMediaBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMedia>>, TError, {
    id: string;
    data: BodyType<UpdateMediaBody>;
}, TContext>;
export declare const getDeleteMediaUrl: (id: string) => string;
/**
 * @summary Delete a media item
 */
export declare const deleteMedia: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteMediaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMedia>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMedia>>, TError, {
    id: string;
}, TContext>;
export type DeleteMediaMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMedia>>>;
export type DeleteMediaMutationError = ErrorType<unknown>;
/**
* @summary Delete a media item
*/
export declare const useDeleteMedia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMedia>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMedia>>, TError, {
    id: string;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map