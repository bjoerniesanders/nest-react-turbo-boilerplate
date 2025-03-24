import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { LoadStrategy } from '@mikro-orm/core';
import { join } from 'path';
import { User } from './src/users/entities/user.entity';

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  entities: [User],
  entitiesTs: [User],
  dbName: process.env.DATABASE_NAME || 'nest-react-turbo-template',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'password',
  debug: process.env.NODE_ENV !== 'production',
  loadStrategy: LoadStrategy.JOINED,
  discovery: {
    disableDynamicFileAccess: true,
  },
  migrations: {
    path: join(__dirname, 'migrations'),
    pathTs: join(__dirname, 'migrations'),
    glob: '!(*.d).{js,ts}',
  },
  seeder: {
    path: join(__dirname, 'seeders'),
    pathTs: join(__dirname, 'seeders'),
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
});
