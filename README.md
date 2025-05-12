# NestJS + React + Turborepo Boilerplate

A modern, full-stack boilerplate using NestJS for the backend and React for the frontend, managed with Turborepo. This template provides a robust foundation for building scalable web applications with a focus on security, type safety, and developer experience.

## Features

### Core Features
- 🚀 **Monorepo Structure**: Using Turborepo for efficient monorepo management
- 🔒 **Authentication**: JWT-based authentication with cookie storage
- 🎨 **UI Framework**: Material-UI (MUI) with a modern, responsive design
- 📱 **Responsive Design**: Mobile-first approach with MUI's Grid system
- 🔄 **Type Safety**: Full TypeScript support across the entire stack
- 🗄️ **Database**: MikroORM with PostgreSQL
- 🧪 **Testing**: E2E and unit testing setup with Jest/Vitest
- 📦 **Package Management**: Yarn for reliable dependency management

### Backend Features
- RESTful API architecture
- Role-based access control (ADMIN, USER)
- JWT authentication with refresh tokens
- PostgreSQL database with MikroORM
- Automated migrations
- Cookie-based token storage
- Comprehensive test coverage

### Frontend Features
- Modern Material-UI components
- Protected routes with authentication
- Responsive design
- Type-safe API integration
- Authentication context
- Axios for API communication

## Default Credentials

For initial login, the following admin credentials are available:

```
Email: admin@example.com
Password: securePassword123
```

## Project Structure

```
.
├── apps/
│   ├── backend/          # NestJS backend application
│   │   ├── src/
│   │   │   ├── auth/     # Authentication module
│   │   │   ├── users/    # User management
│   │   │   └── ...
│   └── frontend/         # React frontend application
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── ...
├── packages/             # Shared packages
└── scripts/             # Development and setup scripts
```

## Getting Started

### Prerequisites

- Node.js 24.x (see .nvmrc and package.json)
- Yarn
- PostgreSQL
- Docker (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nest-react-turbo-boilerplate.git
cd nest-react-turbo-boilerplate
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

4. Update the environment variables with your configuration.

### Database Setup

#### Using Docker (Recommended)
```bash
yarn setup:db
```
This will start the database container and run the database setup script.

#### Local Setup
Ensure PostgreSQL is running and accessible, then run:
```bash
yarn setup:db:local
```

## Development

### Building
```bash
# Build all
yarn build

# Or specific targets
yarn build:backend
yarn build:frontend
```

### Running
```bash
# Run both frontend and backend
yarn start

# Or individually
yarn start:backend
yarn start:frontend
```

### Docker Development
Run everything with Docker and auto-setup:
```bash
yarn start:with-setup
```

### Testing
```bash
yarn test          # All tests
yarn test:backend  # Backend tests
yarn test:frontend # Frontend tests
```

## Docker Commands

```bash
yarn docker:build     # Build all containers
yarn docker:up        # Start containers
yarn docker:down      # Stop containers
yarn docker:logs      # View logs
yarn docker:restart   # Restart stack
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

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Protected routes
- Cookie-based token storage
- Refresh token mechanism

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.