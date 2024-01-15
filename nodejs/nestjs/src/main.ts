import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Petstore")
    .setDescription("This is a sample server Petstore server.")
    .setVersion("1.0.6")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("spec", app, document);
  await app.listen(3000);
}
bootstrap();
