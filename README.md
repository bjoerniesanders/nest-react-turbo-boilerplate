# NestJS + React + Turborepo Boilerplate

A modern, full-stack boilerplate using NestJS for the backend and React for the frontend, managed with Turborepo.

## Features

- 🚀 **Monorepo Structure**: Using Turborepo for efficient monorepo management
- 🔒 **Authentication**: JWT-based authentication system
- 🎨 **UI Framework**: Material-UI (MUI) with a modern, responsive design
- 📱 **Responsive Design**: Mobile-first approach with MUI's Grid system
- 🔄 **Type Safety**: Full TypeScript support across the entire stack
- 🗄️ **Database**: MikroORM with PostgreSQL
- 🧪 **Testing**: E2E and unit testing setup
- 📦 **Package Management**: Yarn for reliable dependency management

## Project Structure

```
.
├── apps/
│   ├── backend/          # NestJS backend application
│   └── frontend/         # React frontend application
├── packages/             # Shared packages
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn
- PostgreSQL

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

5. **Database Setup**

NestJS requires a running PostgreSQL database.

- **Using Docker:**

```bash
yarn setup:db
```

This will start the database container and run the database setup script.

- **Locally (without Docker):**

Ensure PostgreSQL is running and accessible, then run:

```bash
yarn setup:db:local
```

## Building

Before starting development, build the apps:

```bash
# Build all
yarn build

# Or specific targets
yarn build:backend
yarn build:frontend
```

### Development
Start dev servers:

```bash
# Run both frontend and backend
yarn start

# Or individually
yarn start:backend
yarn start:frontend
```

You can also run everything with Docker and auto-setup:

```bash
yarn start:with-setup
```

This will restart Docker, set up the database, and start both frontend and backend in parallel.

### Testing

```bash
yarn test          # All
yarn test:backend  # Backend only
yarn test:frontend # Frontend only
```

## Docker Commands

```bash
yarn docker:build     # Build all containers
yarn docker:up        # Start containers
yarn docker:down      # Stop containers
yarn docker:logs      # View logs
yarn docker:restart   # Restart stack
```

## Features in Detail

### Backend (NestJS)

- RESTful API architecture
- JWT authentication
- MikroORM integration
- Swagger documentation
- E2E testing setup

### Frontend (React)

- Modern Material-UI components
- Responsive design
- Protected routes
- Authentication context
- Type-safe API integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.