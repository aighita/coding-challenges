import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
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
            session.user.id = token.sub;
            return session;
        },
    },
    events: {
        async signOut({ token }) {
            if (token.idToken) {
                const issuerUrl = process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges";
                const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);
                logOutUrl.searchParams.set("id_token_hint", token.idToken);
                await fetch(logOutUrl);
            }
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
