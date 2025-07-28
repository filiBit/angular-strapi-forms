import { inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { StrapiResponse } from "../types/strapi-response";

export interface FormTemplateDTO {
    id: number;
    documentId: string;
    templateCode: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    version: number;
    mode: string;
    groupType: {
        documentId: string;
        name: string;
    };
    isActive: boolean;
    validFrom: string;
    validTo: string;
    fields: { [key: string]: unknown };
}

export interface FormTemplate {
    id: number;
    documentId: string;
    templateCode: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    version: number;
    mode: string;
    groupType: string;
    isActive: boolean;
    validFrom: string;
    validTo: string;
    fields: { [key: string]: unknown };
}

@Injectable({
    providedIn: "root",
})
export class FormTemplateService {
    authService = inject(AuthService);

    async getFormTemplates(): Promise<FormTemplate[]> {
        let nextPage = 1;
        const result: FormTemplate[] = [];

        do {
            await fetch(
                `${environment.strapiUrl}/form-templates?populate[groupType][fields][0]=name&pagination[page]=${nextPage}`,
                {
                    headers: [
                        ["Authorization", `Bearer ${this.authService.jwt}`],
                    ],
                },
            ).then((res) =>
                res.json() as unknown as StrapiResponse<FormTemplateDTO[]>
            ).then((b) => {
                result.push(
                    ...b.data.map((ft) => ({
                        ...ft,
                        groupType: ft.groupType.name,
                    })),
                );
                nextPage = b.meta.pagination.page < b.meta.pagination.pageCount
                    ? nextPage + 1
                    : 0;
            });
        } while (nextPage > 0);

        return result;
    }

    async createFormTemplate() {
        await fetch(
            `${environment.strapiUrl}/form-templates`,
            {
                headers: [
                    ["Authorization", `Bearer ${this.authService.jwt}`],
                ],
            },
        );
    }
}
