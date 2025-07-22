import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StateService {
    state: any = {};

    set(key: string, value: any): any {
        this.state[key] = value;
    }

    get(key: string): any {
        return this.state[key];
    }
}
