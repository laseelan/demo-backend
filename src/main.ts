import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Demo')
    .setDescription('Secure NestJs Rest API with FAM')
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',        
        flows: {
          password: {                                    
            tokenUrl: `${process.env.FAM_SERVER_URL}/realms/${process.env.FAM_REALM}/protocol/openid-connect/token`,
            authorizationUrl: `${process.env.FAM_SERVER_URL}/realms/${process.env.FAM_REALM}/protocol/openid-connect/auth`,
            scopes: {}
          }
        }
      }, "FAM")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Demo API',
    swaggerOptions: {
      initOAuth: {        
        clientId : process.env.FAM_CLIENT_ID,
        clientSecret: process.env.FAM_CLIENT_SECRET,
        appName: 'Demo'
      }
    },
  });
  app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
      next();
  });

  app.enableCors({
      allowedHeaders:"*",
      origin: "*"
  });
  await app.listen(4000);
}
bootstrap();
