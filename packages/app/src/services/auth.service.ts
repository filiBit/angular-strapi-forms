import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { User } from "../app/types/user";
import { StrapiErrorResponse } from "../app/types/strapi-error-response";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly http = inject(HttpClient);

    jwt: null | string = null;
    user: null | User = null;

    get isLoggedIn(): boolean {
        return !!this.jwt && !!this.user;
    }

    login(
        { identifier, password }: { identifier: string; password: string },
    ) {
        this.jwt = null;
        this.user = null;

        return fetch(
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
            return res.json() as Promise<{ jwt: string; user: User }>;
        })
            .then((body) => {
                this.jwt = body.jwt;
                this.user = body.user;
                return null;
            }).catch((err: StrapiErrorResponse) => {
                throw new Error(
                    err.error.details?.errors?.[0].message || err.error.message,
                );
            });
    }
}
