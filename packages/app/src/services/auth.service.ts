import { computed, inject, Injectable, Signal } from "@angular/core";
import { environment } from "../environments/environment";
import { StrapiErrorResponse } from "../types/strapi-error-response";
import { UserDto } from "../types/user-dto";
import { User } from "../types/user";
import { UserRole } from "../types/user-role";
import { StateService } from "./state.service";

@Injectable({ providedIn: "root" })
export class AuthService {
    stateService = inject(StateService);

    constructor() {
        const jwt = this.jwt();
        if (!this.isLoggedIn() && !!jwt) {
            this.fetchUser(jwt).then((user) =>
                this.stateService.setAuth({ jwt, user })
            ).catch((err) => console.log(err));
        }
    }

    isLoggedIn: Signal<boolean> = computed(() => !!this.jwt() && !!this.user());

    get isAdmin() {
        return this.user()?.role === UserRole.AUTHENTICATED;
    }

    get user(): Signal<null | User> {
        return computed(() => this.stateService.getAuth()?.user || null);
    }

    jwt: Signal<null | string> = computed(() =>
        this.stateService.getAuth()?.jwt || null
    );

    private async fetchUser(jwt: string): Promise<User> {
        const user = await fetch(
            `${environment.strapiUrl}/users/me?populate=*`,
            {
                headers: [["Authorization", `Bearer ${jwt}`]],
            },
        ).then(
            (res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to fetch user data");
                }
                return res.json() as Promise<UserDto>;
            },
        ).then((body) => {
            return body;
        });

        return { ...user, role: user.role.type as UserRole };
    }

    async login(
        { identifier, password }: { identifier: string; password: string },
    ) {
        this.stateService.setAuth(null);

        const jwt = await fetch(
            `${environment.strapiUrl}/auth/local`,
            {
                method: "post",
                headers: [["content-type", "application/json"]],
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            },
        ).then(async (res) => {
            if (res.status !== 200) {
                throw await res.json();
            }
            return res.json() as Promise<{ jwt: string; user: UserDto }>;
        })
            .then((body) => {
                return body.jwt;
            }).catch((err: StrapiErrorResponse) => {
                throw new Error(
                    err.error.details?.errors?.[0].message || err.error.message,
                );
            });

        const user = await this.fetchUser(jwt);

        this.stateService.setAuth({
            jwt,
            user,
        });
    }

    async logout() {
        this.stateService.setAuth(null);
        this.stateService.setFormTemplates([]);
        this.stateService.setGroupTypes([]);
    }
}
