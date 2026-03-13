export function generatedDockerCompose(): string {
  return `services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: generated_app
    ports:
      - "5432:5432"

  backend:
    build: ./app/backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/generated_app
      PORT: 3001
    depends_on:
      - postgres
    ports:
      - "3001:3001"

  frontend:
    build: ./app/frontend
    environment:
      NEXT_PUBLIC_API_BASE: http://backend:3001
    depends_on:
      - backend
    ports:
      - "3000:3000"

  admin:
    build: ./app/admin
    depends_on:
      - backend
    ports:
      - "3002:3002"
`;
}
