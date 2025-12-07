import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AnalyticsQueryDto } from "./dto/analytics-query.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

@Controller("v1/analytics")
@UseGuards(AuthGuard, RolesGuard)
@Roles(["ADMIN"])
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * @Docs     Get dashboard statistics
   * @Route    GET /api/v1/analytics/stats
   * @Access   private [Admin]
   **/
  @Get("stats")
  async getDashboardStats(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDashboardStats(query);
  }
}
