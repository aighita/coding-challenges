# Platformă distribuită de mini-learning / coding challenges  
Proiect SCD 2025–2026

## 1. Descriere generală
Platformă web distribuită pentru execuția de exerciții de programare. Utilizatorii autentificați trimit soluții, sistemul le execută în containere izolate prin workers replicați, iar rezultatele sunt salvate și afișate împreună cu leaderboard-uri. Front-end: Next.js.

## 2. Arhitectura soluției (Docker Swarm)
Serviciile funcționează ca microservicii independente, containerizate, interconectate doar prin rețelele definite.

### Servicii principale
1. **auth-service** – Keycloak. SSO, token issuance, realms, mapping pentru roluri.
2. **user-service** – Preia metadate Keycloak → creează profil intern.
3. **sandbox-runner-service** (replicat) – Execută soluții în containere izolate - replicat.
4. **frontend** – Next.js.
5. **gateway-api-service** – API REST + rate-limiting distribuit.
6. **db** – PostgreSQL.
7. **broker** – RabbitMQ / Kafka / Redis pt caching.

## 3. Fluxul aplicației
1. Utilizatorul se autentifică prin Keycloak.
2. Gateway validează token-ul.
3. Soluțiile sunt puse în coadă în broker.
4. Workerii sandbox-runner preiau joburile.
5. Execuția are loc într-un container izolat.
6. Frontend afișează istoricul și leaderboard-ul.

## 4. Module obligatorii
- SSO prin Keycloak.
- Gestionare roluri: student, editor, admin.
- PostgreSQL + ORM (Prisma/SQLAlchemy).
- Stack Docker Swarm cu minim 5 servicii.
- Minim două microservicii proprii.

## 5. Module avansate
### Modul 1: Worker replicat pentru execuția soluțiilor
- Minim 2 replici.
- Execuție izolată + limitare resurse.
- Fără duplicare execuții.

### Modul 2: Rate-limiting distribuit
- Redis Cluster + token bucket.
- Limitare per user și per endpoint.
- Implementat în gateway.

## 6. Tehnologii
- Next.js
- FastAPI / Node.js Express
- Keycloak
- PostgreSQL
- RabbitMQ / Kafka
- Redis Cluster
- Docker Swarm

## 7. Structură directoare
```
/project
  /gateway
  /auth
  /users
  /challenges
  /sandbox-runner
  /frontend
  /db
  /broker
  docker-swarm-stack.yml
```

## 8. Rețele și securitate
- Gateway singurul expus extern.
- Rețele separate pentru fiecare grup de servicii.
- DNS intern Docker.
- Configurare prin variabile de mediu.

## 9. Replicare și testare
- Sandbox-runner replicat pentru concurență.
- Teste:
  - lipsă execuții duplicate
  - rate-limiter funcțional
  - leaderboard consistent

## 10. Livrare finală
- Stack Docker Swarm complet.
- Date demo incluse.
- Utilizatori demo în Keycloak.
