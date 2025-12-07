import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {
  minutes,
  seconds,
  ThrottlerGuard,
  ThrottlerModule,
} from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaService } from "./prisma/prisma.service";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { SubCategoriesModule } from "./modules/sub-categories/sub-categories.module";
import { BrandModule } from "./modules/brand/brand.module";
import { CouponsModule } from "./modules/coupons/coupons.module";
import { ProductsModule } from "./modules/products/products.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { CartsModule } from "./modules/cart/cart.module";
import { ShippingAddressesModule } from "./modules/shipping-addresses/shipping-addresses.module";
import { CitiesModule } from "./modules/cities/cities.module";
import { CountriesModule } from "./modules/countries/countries.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { AppController } from "./app.controller";
import { EmailModule } from "./email/email.module";
import { HomepageModule } from "./modules/homepage/homepage.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 20, ttl: minutes(1), blockDuration: seconds(30) }],
      errorMessage: "Too many requests. Please try again later.",
    }),
    PrismaModule,
    EmailModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    CategoriesModule,
    SubCategoriesModule,
    BrandModule,
    CouponsModule,
    ProductsModule,
    ReviewsModule,
    CartsModule,
    ShippingAddressesModule,
    CitiesModule,
    CountriesModule,
    OrdersModule,
    HomepageModule,
    AnalyticsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
