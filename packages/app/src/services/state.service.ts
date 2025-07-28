import { inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { GroupTypeService } from "./group-type.service";
import { FormTemplate, FormTemplateService } from "./form-template.service";

enum StateKey {
    GROUP_TYPES = "GROUP_TYPES",
    FORM_TEMPLATES = "FORM_TEMPLATES ",
}

@Injectable({ providedIn: "root" })
export class StateService {
    authService = inject(AuthService);
    groupTypeService = inject(GroupTypeService);
    formTemplateService = inject(FormTemplateService);

    private readonly state: Map<string, unknown> = new Map();
    isInitialized: boolean = false;

    get(key: string): unknown {
        return this.state.get(key);
    }

    get formTemplates(): FormTemplate[] {
        return this.state.get(StateKey.FORM_TEMPLATES) as FormTemplate[];
    }

    async initialize(): Promise<void> {
        console.log("initialize");
        if (!this.authService.isLoggedIn) {
            throw new Error("Can't initialize if user is logged out");
        }
        console.log("initialize 2");

        await Promise.all([
            this.groupTypeService.getGroupTypes(),
            this.formTemplateService.getFormTemplates(),
        ]).then(([groupTypes, formTemplates]) => {
            this.state.set(StateKey.GROUP_TYPES, groupTypes);
            this.state.set(StateKey.FORM_TEMPLATES, formTemplates);
        });

        this.isInitialized = true;
    }
}
