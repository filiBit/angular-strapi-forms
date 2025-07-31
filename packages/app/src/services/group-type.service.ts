import { effect, inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { GroupType } from "../types/group-type";
import { StrapiResponse } from "../types/strapi-response";
import { AuthService } from "./auth.service";
import { StateService } from "./state.service";

@Injectable({
    providedIn: "root",
})
export class GroupTypeService {
    authService = inject(AuthService);
    stateService = inject(StateService);

    constructor() {
        effect(() => {
            if (this.authService.isLoggedIn()) {
                this.getGroupTypes().then((res) =>
                    this.stateService.setGroupTypes(res)
                );
            }
        });
    }

    getGroupTypes(): Promise<GroupType[]> {
        return fetch(
            `${environment.strapiUrl}/group-types`,
        ).then((res) => res.json() as Promise<StrapiResponse<GroupType[]>>)
            .then((b) => b.data);
    }

    async createGroupType(
        { name }: { name: string },
    ): Promise<GroupType> {
        return await fetch(
            `${environment.strapiUrl}/group-types`,
            {
                method: "post",
                body: JSON.stringify({ data: { name } }),
                headers: [
                    ["Authorization", `Bearer ${this.authService.jwt}`],
                    ["Content-type", "application/json"],
                ],
            },
        ).then((res) => res.json() as Promise<StrapiResponse<GroupType>>).then((
            b,
        ) => b.data);
    }

    async deleteGroupType(id: string): Promise<void> {
        return fetch(`${environment.strapiUrl}/group-types/${id}`, {
            method: "delete",
        }).then((res) => {
            if (res.status !== 200) {
                throw new Error(
                    `Failed to delete a GroupType with id of ${id}`,
                );
            }
        });
    }
}
