import {
    computed,
    effect,
    Injectable,
    Signal,
    signal,
    WritableSignal,
} from "@angular/core";
import { FormTemplate } from "./form-template.service";
import { GroupType } from "../types/group-type";
import { User } from "../types/user";

enum StateKey {
    GROUP_TYPES = "GROUP_TYPES",
    FORM_TEMPLATES = "FORM_TEMPLATES ",
    AUTH = "AUTH",
}

enum PersistKey {
    JWT = "JWT",
}

interface State {
    [StateKey.AUTH]: null;
    [StateKey.FORM_TEMPLATES]: FormTemplate[];
    [StateKey.GROUP_TYPES]: GroupType[];
}

const initialState: State = {
    [StateKey.AUTH]: null,
    [StateKey.FORM_TEMPLATES]: [],
    [StateKey.GROUP_TYPES]: [],
};

@Injectable({ providedIn: "root" })
export class StateService {
    private readonly state: WritableSignal<State> = signal(initialState);
    isInitialized: Signal<boolean> = signal(false);

    constructor() {
        this.hydrate();
        effect(() => {
            console.log("persist");
            this.persist();
        });
    }

    get(key: StateKey): unknown {
        return this.state()[key];
    }

    private set(key: StateKey, value: unknown) {
        this.state.set({ ...this.state(), [key]: value });
    }

    get formTemplates(): Signal<FormTemplate[]> {
        return computed(() =>
            this.get(StateKey.FORM_TEMPLATES) as FormTemplate[]
        );
    }

    get groupTypes(): Signal<GroupType[]> {
        return computed(() => this.get(StateKey.GROUP_TYPES) as GroupType[]);
    }

    setGroupTypes(groupTypes: GroupType[]) {
        this.set(StateKey.GROUP_TYPES, groupTypes);
    }

    setFormTemplates(formTemplates: FormTemplate[]) {
        this.set(StateKey.FORM_TEMPLATES, formTemplates);
    }

    addGroupType(groupType: GroupType) {
        this.set(
            StateKey.GROUP_TYPES,
            (this.get(StateKey.GROUP_TYPES) as GroupType[]).concat(groupType),
        );
    }

    deleteGroupType(id: string) {
        this.set(
            StateKey.GROUP_TYPES,
            (this.get(StateKey.GROUP_TYPES) as GroupType[]).filter((el) =>
                el.documentId !== id
            ),
        );
    }

    setAuth(authData: null | { jwt: string; user: null | User }) {
        this.set(StateKey.AUTH, authData);
    }

    getAuth(): null | { jwt: string; user: null | User } {
        return (this.get(StateKey.AUTH) || null) as null | {
            jwt: string;
            user: User;
        };
    }

    hydrate() {
        const jwt = localStorage.getItem(PersistKey.JWT);

        if (jwt?.length) {
            this.setAuth({ jwt, user: null });
        }
    }

    persist(): void {
        const authData = this.getAuth();

        if (authData?.jwt) {
            localStorage.setItem(
                PersistKey.JWT,
                authData.jwt,
            );
            return;
        }

        localStorage.removeItem(PersistKey.JWT);
    }
}
