import { Component, inject } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { LoginForm } from "../../login-form/login-form";
import { StateService } from "../../../services/state.service";
import { FormGroups } from "../../form-groups/form-groups";

@Component({
    selector: "home-page",
    templateUrl: "./home-page.html",
    imports: [LoginForm, FormGroups],
    styles:
        `:host {width: 100%; display: flex; flex-direction: column; align-items: center;}`,
})
export class HomePage {
    authService = inject(AuthService);
    stateService = inject(StateService);
}
