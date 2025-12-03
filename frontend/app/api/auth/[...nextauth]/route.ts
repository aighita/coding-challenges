import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID || "frontend-client",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
            issuer: process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges",
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
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
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
