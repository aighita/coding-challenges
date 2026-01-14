import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

// Mock users for demo mode when services are offline
const MOCK_USERS = {
    student: {
        id: 'demo-student-1',
        name: 'Demo Student',
        email: 'student@demo.com',
        roles: ['student'],
    },
    editor: {
        id: 'demo-editor-1',
        name: 'Demo Editor',
        email: 'editor@demo.com',
        roles: ['student', 'editor'],
    },
    admin: {
        id: 'demo-admin-1',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        roles: ['student', 'editor', 'admin'],
    },
};

// Build providers list - only add Keycloak if configured
const providers = [];

// Only add Keycloak provider if client secret is configured
if (process.env.KEYCLOAK_CLIENT_SECRET) {
    providers.push(
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID || "frontend-client",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges",
            authorization: {
                params: {
                    scope: "openid email profile",
                },
                url: `${process.env.KEYCLOAK_EXTERNAL_ISSUER || "http://localhost:8081/realms/coding-challenges"}/protocol/openid-connect/auth`,
            },
        })
    );
}

// Always add credentials provider for demo login
providers.push(
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) return null;

            // Check for demo mode logins (username: student/editor/admin, password: demo)
            const username = credentials.username.toLowerCase();
            if (credentials.password === 'demo' && username in MOCK_USERS) {
                const mockUser = MOCK_USERS[username as keyof typeof MOCK_USERS];
                return {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email,
                    accessToken: 'demo-token',
                    idToken: 'demo-id-token',
                    refreshToken: 'demo-refresh-token',
                    roles: mockUser.roles,
                } as any;
            }

            // Only try Keycloak if configured
            if (!process.env.KEYCLOAK_CLIENT_SECRET) {
                return null;
            }

            try {
                const issuer = process.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/coding-challenges";
                const tokenUrl = `${issuer}/protocol/openid-connect/token`;

                const params = new URLSearchParams();
                params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || "frontend-client");
                params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
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
);

export const authOptions: AuthOptions = {
    providers,
    secret: process.env.NEXTAUTH_SECRET || "demo-secret-for-development-only",
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
