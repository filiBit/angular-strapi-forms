import { Routes } from "@angular/router";
import { HomePage } from "./pages/home/home-page";
import { NotFound } from "./not-found/not-found";

export const routes: Routes = [{
    path: "",
    component: HomePage,
}, {
    path: "**",
    component: NotFound,
}];
