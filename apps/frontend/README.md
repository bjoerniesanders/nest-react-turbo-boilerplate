# React Frontend

A modern React frontend application built with TypeScript, Material-UI, and React Router. This frontend is part of the NestJS + React + Turborepo boilerplate.

## Features

### Core Features
- ⚛️ **React 19**: Latest version with TypeScript support
- 🎨 **Material-UI**: Modern UI components and responsive design
- 🔒 **Authentication**: JWT-based authentication with cookie storage
- 🛣️ **Routing**: Protected routes with React Router
- 🔄 **State Management**: Context API for authentication state
- 📡 **API Integration**: Type-safe API calls with Axios
- 🎯 **Type Safety**: Full TypeScript support

### UI Components
- Modern login page with form validation
- Responsive dashboard layout
- User profile management
- Navigation menu
- Loading states and error handling
- Toast notifications

### Security Features
- Protected routes
- Authentication context
- Token refresh mechanism
- Secure cookie handling
- CORS configuration

## Project Structure

```
src/
├── api/              # API configuration and interceptors
├── components/       # Reusable UI components
├── context/         # React context providers
├── pages/           # Page components
├── services/        # API services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 24.x
- Yarn
- Backend server running (see main README)

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
VITE_API_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building

Build the application for production:
```bash
yarn build
```

Preview the production build:
```bash
yarn preview
```

### Testing

Run tests:
```bash
yarn test
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run tests
- `yarn lint` - Run linter
- `yarn build:docker` - Build Docker image
- `yarn docker:up` - Start Docker container
- `yarn docker:down` - Stop Docker container

## Key Components

### Authentication
- `AuthContext`: Manages authentication state
- `PrivateRoute`: Protects routes from unauthorized access
- `LoginPage`: User authentication interface

### API Integration
- `axiosInstance`: Configured Axios instance with interceptors
- `AuthService`: Authentication-related API calls
- `UserService`: User-related API calls

### UI Components
- `Button`: Custom button component with loading state
- `Dashboard`: Main application interface
- `Navigation`: Application navigation menu

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000 |

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
