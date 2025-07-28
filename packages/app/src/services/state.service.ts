import {
    computed,
    inject,
    Injectable,
    Signal,
    signal,
    WritableSignal,
} from "@angular/core";
import { AuthService } from "./auth.service";
import { GroupTypeService } from "./group-type.service";
import { FormTemplate, FormTemplateService } from "./form-template.service";
import { GroupType } from "../types/group-type";

enum StateKey {
    GROUP_TYPES = "GROUP_TYPES",
    FORM_TEMPLATES = "FORM_TEMPLATES ",
}

@Injectable({ providedIn: "root" })
export class StateService {
    authService = inject(AuthService);
    groupTypeService = inject(GroupTypeService);
    formTemplateService = inject(FormTemplateService);

    private readonly state: WritableSignal<[string, unknown][]> = signal([]);
    isInitialized: boolean = false;

    get(key: string): unknown {
        return this.state().find((el) => el[0] === key)?.[1];
    }

    private set(key: string, value: unknown) {
        this.state.set([...this.state().filter((el) => el[0] !== key), [
            key,
            value,
        ]]);
    }

    get formTemplates(): Signal<FormTemplate[]> {
        return computed(() =>
            this.get(StateKey.FORM_TEMPLATES) as FormTemplate[]
        );
    }

    get groupTypes(): Signal<GroupType[]> {
        return computed(() => this.get(StateKey.GROUP_TYPES) as GroupType[]);
    }

    async initialize(): Promise<void> {
        if (!this.authService.isLoggedIn) {
            throw new Error("Can't initialize if user is logged out");
        }

        this.isInitialized = true;
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
}
