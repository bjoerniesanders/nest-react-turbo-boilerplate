import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from 'mikro-orm.config';
import { UsersModule } from '@src/users/user.module';
import { AuthModule } from '@src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@src/auth/guards/roles.guard';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { User } from '@src/users/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...config,
      entities: [User],
      entitiesTs: [User],
      debug: process.env.NODE_ENV !== 'production',
      allowGlobalContext: true,
      discovery: {
        disableDynamicFileAccess: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...(process.env.NODE_ENV !== 'test'
      ? [
          {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
          },
          {
            provide: APP_GUARD,
            useClass: RolesGuard,
          },
        ]
      : []),
  ],
})
export class AppModule {}
