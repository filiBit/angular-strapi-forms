import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    RedirectCommand,
    Router,
    RouterStateSnapshot,
    Routes,
} from "@angular/router";
import { HomePage } from "./pages/home/home-page";
import { FormGroupDetails } from "./form-group-details/form-group-details";
import { NotFound } from "./not-found/not-found";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const homePath = router.parseUrl("/");
    return authService.isAdmin() || new RedirectCommand(homePath);
};

export const routes: Routes = [{
    path: "",
    component: HomePage,
}, {
    path: "groups/:id",
    component: FormGroupDetails,
    canActivate: [adminGuard],
}, {
    path: "**",
    component: NotFound,
}];
