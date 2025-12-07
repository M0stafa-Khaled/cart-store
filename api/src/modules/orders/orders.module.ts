import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { StripeWebhookController } from "./stripe-webhook.controller";
import { StripeWebhookService } from "./stripe-webhook.service";
import { EmailModule } from "../../email/email.module";

@Module({
  imports: [EmailModule],
  controllers: [OrdersController, StripeWebhookController],
  providers: [OrdersService, StripeWebhookService],
})
export class OrdersModule {}
