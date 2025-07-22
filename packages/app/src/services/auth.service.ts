import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { User } from "../app/types/user";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly http = inject(HttpClient);

    jwt: null | string = null;
    user: null | User = null;

    async login(
        { identifier, password }: { identifier: string; password: string },
    ) {
        return this.http.post<{ jwt: string; user: User }>(
            `${environment.strapiUrl}/auth/local`,
            {
                identifier,
                password,
            },
        ).subscribe((b) => {
            this.jwt = b.jwt;
            this.user = b.user;
        });
    }
}
