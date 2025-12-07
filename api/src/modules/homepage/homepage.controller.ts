import { Controller, Get } from "@nestjs/common";
import { HomepageService } from "./homepage.service";

@Controller("v1/homepage")
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  getHomepageData() {
    return this.homepageService.getHomepageData();
  }

  @Get("categories")
  getCategories() {
    return this.homepageService.getCategories();
  }

  @Get("featured")
  getFeaturedProducts() {
    return this.homepageService.getFeaturedProducts();
  }

  @Get("flash-sale")
  getFlashSaleProducts() {
    return this.homepageService.getFlashSaleProducts();
  }

  @Get("new-arrivals")
  getNewArrivals() {
    return this.homepageService.getNewArrivals();
  }

  @Get("brands")
  getBrands() {
    return this.homepageService.getBrands();
  }
}
