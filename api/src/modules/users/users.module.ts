import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserController } from "./users.controller";
import { EmailModule } from "../../email/email.module";

@Module({
  imports: [EmailModule],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
