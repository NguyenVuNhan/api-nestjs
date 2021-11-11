import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'apps/api/src/authentication/guard/jwtAuthentication.guard';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoriesService } from './product-categories.service';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productsService: ProductCategoriesService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProductCategories();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() productCategory: CreateProductCategoryDto) {
    return this.productsService.createProductCategory(productCategory);
  }
}
