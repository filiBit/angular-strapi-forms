import { Component, inject } from "@angular/core";
import {
    FormTemplate,
    FormTemplateService,
} from "../../services/form-template.service";
import { AuthService } from "../../services/auth.service";
import { MatCardModule } from "@angular/material/card";
import { StateService } from "../../services/state.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
    selector: "form-templates",
    templateUrl: "./form-templates.html",
    imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
})
export class FormTemplates {
    authService = inject(AuthService);
    stateService = inject(StateService);
    formTemplateService = inject(FormTemplateService);
    groupTypes: (FormTemplate & { size: number })[] = [];

    constructor() {
        if (!this.authService.isLoggedIn) {
            throw new Error("Can't render when logged out.");
        }
    }

    ngOnInit() {
        this.groupTypes = this.stateService.formTemplates.map(
            (ft) => (
                {
                    ...ft,
                    size:
                        this.stateService.formTemplates.filter((ftInner) =>
                            ft.groupType === ftInner.groupType
                        ).length,
                }
            ),
        );
    }
}
