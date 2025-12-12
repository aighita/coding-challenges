import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Environment variables for Keycloak
// In a real app, these should be securely stored
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || "http://localhost:8081";
const KEYCLOAK_REALM = "coding-challenges";
const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || "admin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Get Admin Token
        // trying to authenticate against the same realm to get admin privileges
        // assuming the 'admin' user has permissions to manage users in this realm
        const tokenResponse = await axios.post(
            `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
            new URLSearchParams({
                client_id: "admin-cli", // usually available, or we might need another client
                grant_type: "password",
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const adminAccessToken = tokenResponse.data.access_token;

        // 2. Create User
        await axios.post(
            `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
            {
                username: username,
                email: email,
                enabled: true,
                emailVerified: true,
                firstName: username, // default to username
            },
            {
                headers: {
                    Authorization: `Bearer ${adminAccessToken}`,
                },
            }
        );

        // 3. Get User ID (fetch by username)
        const userListResponse = await axios.get(
            `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
            {
                params: { username: username, exact: true },
                headers: { Authorization: `Bearer ${adminAccessToken}` },
            }
        );

        if (userListResponse.data.length === 0) {
            throw new Error("Failed to retrieve created user");
        }

        const userId = userListResponse.data[0].id;

        // 4. Set Password
        await axios.put(
            `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/reset-password`,
            {
                type: "password",
                value: password,
                temporary: false,
            },
            {
                headers: { Authorization: `Bearer ${adminAccessToken}` },
            }
        );

        // 5. Assign 'student' role
        // First get the role representation
        const roleResponse = await axios.get(
            `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/student`,
            {
                headers: { Authorization: `Bearer ${adminAccessToken}` },
            }
        );
        const studentRole = roleResponse.data;

        // Assign it
        await axios.post(
            `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
            [studentRole],
            {
                headers: { Authorization: `Bearer ${adminAccessToken}` },
            }
        );

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error: any) {
        console.error("Registration error:", error.response?.data || error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.errorMessage || "Internal Server Error";
        return NextResponse.json({ message }, { status });
    }
}
