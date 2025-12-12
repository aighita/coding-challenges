import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID || "frontend-client",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
            issuer: process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges",
            authorization: {
                params: {
                    scope: "openid email profile",
                },
                url: `${process.env.KEYCLOAK_EXTERNAL_ISSUER || "http://localhost:8081/realms/coding-challenges"}/protocol/openid-connect/auth`,
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    const issuer = process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges";
                    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

                    const params = new URLSearchParams();
                    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || "frontend-client");
                    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET || "");
                    params.append('grant_type', 'password');
                    params.append('username', credentials.username);
                    params.append('password', credentials.password);
                    params.append('scope', 'openid email profile');

                    const response = await fetch(tokenUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("Keycloak login failed:", data);
                        return null;
                    }

                    const decoded: any = jwtDecode(data.access_token);

                    return {
                        id: decoded.sub,
                        name: decoded.name || decoded.preferred_username,
                        email: decoded.email,
                        accessToken: data.access_token,
                        idToken: data.id_token,
                        refreshToken: data.refresh_token,
                        roles: decoded.realm_access?.roles || [],
                    } as any;

                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;

                try {
                    if (account.access_token) {
                        const decoded: any = jwtDecode(account.access_token);
                        token.roles = decoded.realm_access?.roles || [];
                    }
                } catch (error) {
                    console.error("Error decoding token for roles", error);
                }
            }
            // Handle CredentialsProvider login
            if (user) {
                const u = user as any;
                token.accessToken = u.accessToken;
                token.idToken = u.idToken;
                token.roles = u.roles;
                token.sub = u.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.roles = token.roles;
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
    },
    events: {
        async signOut({ token }: { token: JWT }) {
            if (token.idToken) {
                const issuerUrl = process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges";
                const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);
                logOutUrl.searchParams.set("id_token_hint", token.idToken);
                try {
                    await fetch(logOutUrl.toString());
                } catch (error) {
                    console.error("Error logging out from Keycloak", error);
                }
            }
        }
    },
    pages: {
        signIn: '/login',
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
