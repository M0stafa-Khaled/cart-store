import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { EmailModule } from "../../email/email.module";

@Module({
  imports: [EmailModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
