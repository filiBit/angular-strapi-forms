import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { StateService } from "../../services/state.service";
import { AuthService } from "../../services/auth.service";
import { GroupTypeService } from "../../services/group-type.service";
import { FormTemplateService } from "../../services/form-template.service";

@Component({
    selector: "login-form",
    imports: [FormsModule, MatFormField, MatInputModule, MatButtonModule],
    templateUrl: "./login-form.html",
})
export class LoginForm {
    stateService = inject(StateService);
    groupTypeService = inject(GroupTypeService);
    formTemplateService = inject(FormTemplateService);
    authService = inject(AuthService);

    identifier = "";
    password = "";
    errorMessage: null | string = null;

    async login(event: Event) {
        event.preventDefault();
        this.errorMessage = null;
        await this.authService.login({
            identifier: this.identifier,
            password: this.password,
        }).catch((err: Error) => {
            console.log(err.message);
            this.errorMessage = err.message;
        });

        await Promise.all([
            this.groupTypeService.getGroupTypes(),
            this.formTemplateService.getFormTemplates(),
        ]).then(([groupTypes, formTemplates]) => {
            this.stateService.setGroupTypes(groupTypes);
            this.stateService.setFormTemplates(formTemplates);
        });

        this.stateService.initialize();
    }
}
