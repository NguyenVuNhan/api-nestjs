import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'apps/api/src/authentication/guard/jwtAuthentication.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @Get('brands')
  async getAllBrands() {
    return this.productsService.getAllBrands();
  }

  @Get('brands/:id')
  async getBrand(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getBrand(id);
  }
}
