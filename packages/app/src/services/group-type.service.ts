import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class GroupTypeService {
    getGroupTypes() {
        return fetch(
            `${environment.strapiUrl}/group-types`,
        ).then((res) => res.json()).then((b) => b.data);
    }
}
