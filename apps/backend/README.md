# NestJS Backend

A robust NestJS backend application with TypeScript, PostgreSQL, and MikroORM. This backend is part of the NestJS + React + Turborepo boilerplate.

## Features

### Core Features
- 🚀 **NestJS**: Enterprise-grade Node.js framework
- 🗄️ **Database**: PostgreSQL with MikroORM
- 🔒 **Authentication**: JWT-based authentication with refresh tokens
- 👥 **User Management**: Role-based access control
- 📝 **API Documentation**: Swagger/OpenAPI integration
- 🧪 **Testing**: Jest for unit and E2E testing
- 🔄 **Migrations**: Automated database migrations

### Security Features
- JWT authentication
- Password hashing with bcrypt
- Role-based access control (ADMIN, USER)
- CORS configuration
- Cookie-based token storage
- Refresh token mechanism
- Request validation with class-validator

### API Features
- RESTful architecture
- Request validation
- Error handling
- Response transformation
- Rate limiting
- Logging

## Project Structure

```
src/
├── auth/             # Authentication module
│   ├── guards/      # Authentication guards
│   ├── strategies/  # Passport strategies
│   └── ...
├── users/           # User management module
│   ├── create/      # User creation
│   ├── read/        # User retrieval
│   ├── update/      # User updates
│   ├── delete/      # User deletion
│   └── ...
├── migrations/      # Database migrations
└── ...
```

## Getting Started

### Prerequisites
- Node.js 24.x
- Yarn
- PostgreSQL
- Docker (optional)

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update the environment variables:
```env
# Database
DATABASE_NAME=nest-react-turbo-template
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Server
PORT=3000
```

### Database Setup

#### Using Docker (Recommended)
```bash
yarn setup:db
```

#### Local Setup
```bash
yarn setup:db:local
```

### Development

Start the development server:
```bash
yarn start:dev
```

The API will be available at `http://localhost:3000`.

### Building

Build the application:
```bash
yarn build
```

Start the production server:
```bash
yarn start:prod
```

### Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Users
- `POST /users/register` - Register new user
- `POST /users/create-admin` - Create admin user (requires admin role)
- `GET /users/allUser` - Get all users (requires admin role)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user

## Database Migrations

Create a new migration:
```bash
yarn migration:create
```

Run migrations:
```bash
yarn migration:up
```

Revert migrations:
```bash
yarn migration:down
```

## Available Scripts

- `yarn start:dev` - Start development server
- `yarn start:prod` - Start production server
- `yarn build` - Build application
- `yarn test` - Run unit tests
- `yarn test:e2e` - Run E2E tests
- `yarn test:cov` - Run test coverage
- `yarn lint` - Run linter
- `yarn build:docker` - Build Docker image
- `yarn docker:up` - Start Docker container
- `yarn docker:down` - Stop Docker container

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_NAME | Database name | nest-react-turbo-template |
| DATABASE_HOST | Database host | localhost |
| DATABASE_PORT | Database port | 5432 |
| DATABASE_USER | Database user | admin |
| DATABASE_PASSWORD | Database password | password |
| JWT_SECRET | JWT secret key | - |
| JWT_REFRESH_SECRET | JWT refresh secret key | - |
| PORT | Server port | 3000 |

## Docker Support

Build and run with Docker:
```bash
# Build
yarn build:docker

# Run
yarn docker:up

# Stop
yarn docker:down
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License - see the main [LICENSE](../LICENSE) file for details.
