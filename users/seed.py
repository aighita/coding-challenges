import asyncio
import os
from keycloak import KeycloakAdmin
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import SessionLocal, engine, Base
from models import User

# Configuration
KEYCLOAK_SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://auth:8080/")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "coding-challenges")
KEYCLOAK_ADMIN = os.getenv("KEYCLOAK_ADMIN", "admin")
KEYCLOAK_ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "admin")

async def seed_users():
    print("Starting user seeding from Keycloak...")
    
    users = []
    # 1. Connect to Keycloak
    try:
        # We need to connect to the server. 
        # Note: KeycloakAdmin defaults to 'master' realm for admin authentication.
        keycloak_admin = KeycloakAdmin(
            server_url=KEYCLOAK_SERVER_URL,
            username=KEYCLOAK_ADMIN,
            password=KEYCLOAK_ADMIN_PASSWORD,
            realm_name="master",
            verify=False
        )
        
        # Switch to our realm to get users
        keycloak_admin.realm_name = KEYCLOAK_REALM
        users = keycloak_admin.get_users({})
        print(f"Found {len(users)} users in Keycloak.")
        
    except Exception as e:
        print(f"Failed to connect to Keycloak: {e}")
        # If we can't connect to Keycloak, we can't seed.
        return

    # 2. Sync to DB
    async with SessionLocal() as db:
        for kc_user in users:
            username = kc_user.get("username")
            email = kc_user.get("email")
            keycloak_id = kc_user.get("id")
            
            if not username or not email:
                continue
                
            # Determine role
            role = "student"
            try:
                # Fetch roles for user
                user_roles = keycloak_admin.get_realm_roles_of_user(keycloak_id)
                role_names = [r['name'] for r in user_roles]
                if "admin" in role_names:
                    role = "admin"
                elif "editor" in role_names:
                    role = "editor"
            except Exception as e:
                print(f"Could not fetch roles for {username}: {e}")

            # Check if exists by Keycloak ID
            result = await db.execute(select(User).where(User.keycloakId == keycloak_id))
            existing_user = result.scalar_one_or_none()
            
            if not existing_user:
                # Check by email/username to avoid unique constraint error
                result = await db.execute(select(User).where((User.email == email) | (User.username == username)))
                conflict_user = result.scalar_one_or_none()
                
                if conflict_user:
                    print(f"Updating existing user {username} with new Keycloak ID")
                    conflict_user.keycloakId = keycloak_id
                    conflict_user.role = role
                else:
                    print(f"Creating user {username}")
                    new_user = User(
                        keycloakId=keycloak_id,
                        username=username,
                        email=email,
                        role=role
                    )
                    db.add(new_user)
            else:
                print(f"User {username} already exists.")
                if existing_user.role != role:
                     existing_user.role = role

        await db.commit()
    print("User seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_users())
