import { Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Main } from "../services/main.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, MatSlideToggleModule],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {
    protected readonly title = signal("app");
    main = inject(Main);
    didInject = this.main.login({ identifier: "asd", password: "asf" });
}
