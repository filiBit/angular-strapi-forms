import { StrapiResponseMeta } from "./strapi-response-meta";

export interface StrapiResponse<T> {
    data: Array<T>;
    meta: StrapiResponseMeta;
}
