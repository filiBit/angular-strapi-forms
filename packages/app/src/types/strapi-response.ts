import { StrapiResponseMeta } from "./strapi-response-meta";

export interface StrapiResponse<T> {
    data: T;
    meta: StrapiResponseMeta;
}
