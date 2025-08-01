import { Component, computed, inject } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { StateService } from "../services/state.service";
import { AuthService } from "../services/auth.service";

@Component({
    selector: "app-root",
    imports: [
        RouterOutlet,
        MatButtonModule,
        MatIconModule,
        RouterLink,
    ],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {
    stateService = inject(StateService);
    authService = inject(AuthService);
    router = inject(Router);

    user = computed(() => this.stateService.getAuth()?.user);

    logout() {
        this.authService.logout();
        this.router.navigate(["/"]);
    }
}
