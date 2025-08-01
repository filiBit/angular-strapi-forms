import { Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LoginForm } from "../login-form/login-form";
import { StateService } from "../../services/state.service";
import { FormGroups } from "../form-groups/form-groups";
import { LayoutNarrow } from "../layout-narrow/layout-narrow";

@Component({
    selector: "home-page",
    templateUrl: "./home-page.html",
    imports: [LoginForm, FormGroups, LayoutNarrow],
    styles:
        `:host {width: 100%; display: flex; flex-direction: column; align-items: center;}`,
})
export class HomePage {
    authService = inject(AuthService);
    stateService = inject(StateService);
}
