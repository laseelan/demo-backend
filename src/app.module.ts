import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieController } from './movie.controller';
import { AppLoggerMiddleware, MovieService } from './movie.service';
import 'dotenv/config'
import {
  KeycloakConnectModule,
  RoleGuard,
  AuthGuard,  
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
require('dotenv').config()

@Module({
  imports: [
    ConfigModule.forRoot(),
    KeycloakConnectModule.register({
      authServerUrl: process.env.FAM_SERVER_URL,
      realm: process.env.FAM_REALM,
      clientId: process.env.FAM_CLIENT_ID,
      secret: process.env.FAM_CLIENT_SECRET ,
    }),
  ],
  controllers: [MovieController],
  providers: [
    MovieService,
    // This adds a global level authentication guard, you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
