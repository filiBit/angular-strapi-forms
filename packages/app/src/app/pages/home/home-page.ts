import { Component, inject } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { LoginForm } from "../../login-form/login-form";
import { StateService } from "../../../services/state.service";

@Component({
    selector: "home-page",
    templateUrl: "./home-page.html",
    imports: [LoginForm],
})
export class HomePage {
    authService = inject(AuthService);
    stateService = inject(StateService);
}
