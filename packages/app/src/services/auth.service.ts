import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { StrapiErrorResponse } from "../types/strapi-error-response";
import { UserDto } from "../types/user-dto";
import { User } from "../types/user";
import { UserRole } from "../types/user-role";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly http = inject(HttpClient);

    jwt: null | string = null;
    user: null | User = null;

    get isLoggedIn(): boolean {
        return !!this.jwt && !!this.user;
    }

    get isAdmin() {
        return this.user?.role === UserRole.AUTHENTICATED;
    }

    async login(
        { identifier, password }: { identifier: string; password: string },
    ) {
        this.jwt = null;
        this.user = null;

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
                this.jwt = null;
                this.user = null;
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

        const user = await fetch(
            `${environment.strapiUrl}/users/me?populate=*`,
            {
                headers: [["Authorization", `Bearer ${jwt}`]],
            },
        ).then(
            (res) => res.json() as Promise<UserDto>,
        ).then((body) => {
            return body;
        });

        this.jwt = jwt;
        this.user = { ...user, role: user.role.type as UserRole };
    }
}
