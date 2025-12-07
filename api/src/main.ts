import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomValidationPipe } from "./common/validation/validation.pipe";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { configureCloudinary } from "./common/config/cloudinary.config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Initialize Cloudinary
  configureCloudinary();

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new CustomValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable cookie parser
  app.use(cookieParser());

  app.use("/api/v1/webhooks/stripe", express.raw({ type: "application/json" }));

  app.use(
    helmet({
      hidePoweredBy: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: [String(process.env.FRONT_END_URL)],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Stripe-Signature",
      "x-refresh-token",
    ],
    methods: ["GET", "POST", "DELETE", "PATCH"],
  });

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (req.method === "OPTIONS") {
        res.header(
          "Access-Control-Allow-Origin",
          String(process.env.FRONT_END_URL),
        );
        res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, x-refresh-token, Stripe-Signature",
        );
        res.header("Access-Control-Allow-Credentials", "true");
        return res.sendStatus(204);
      }
      next();
    },
  );

  await app.listen(process.env.PORT ?? 5000, "0.0.0.0");
}

bootstrap()
  .then(() => {
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 5000}`,
    );
  })
  .catch((err) => console.error(err));
