import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class Main {
    login({ identifier, password }: { identifier: string; password: string }) {
        return true;
    }
}
