import { inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root",
})
export class FormTemplateService {
    authService = inject(AuthService);

    getFormTemplates() {
        return fetch(`${environment.strapiUrl}/form-templates`, {
            headers: [
                ["Authorization", `Bearer ${this.authService.jwt}`],
            ],
        }).then((res) => res.json());
    }
}
