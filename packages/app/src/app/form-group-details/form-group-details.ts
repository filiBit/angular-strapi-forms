import { Component, computed, inject, Signal, signal } from "@angular/core";
import {
    FormTemplate,
    FormTemplateService,
} from "../../services/form-template.service";
import { StateService } from "../../services/state.service";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { GroupType } from "../../types/group-type";
import { NotFound } from "../not-found/not-found";
import { Breadcrumbs } from "../components/breadcrumps/breadcrumbs";

@Component({
    selector: "form-group-details",
    templateUrl: "./form-group-details.html",
    imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class FormGroupDetails {
    formTemplateService = inject(FormTemplateService);
    stateService = inject(StateService);
    router = inject(Router);

    formGroupId = signal("");

    private activatedRoute = inject(ActivatedRoute);

    constructor() {
        this.activatedRoute.params.subscribe((params) => {
            this.formGroupId.set(params["id"]);
        });
    }

    formGroup: Signal<null | GroupType> = computed(() => {
        return this.stateService.groupTypes().find((el) =>
            el.documentId === this.formGroupId()
        ) || null;
    });

    formTemplates: Signal<FormTemplate[]> = computed(() => {
        return this.stateService.formTemplates().filter((el) =>
            el.groupType === this.formGroupId()
        );
    });

    openDialog() {}
}
