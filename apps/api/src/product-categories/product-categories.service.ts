import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductCategory from 'apps/api/src/product-categories/entities/product-category.entity';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  getAllProductCategories() {
    return this.productCategoriesRepository.find();
  }

  async createProductCategory(category: CreateProductCategoryDto) {
    const newProductCategory = await this.productCategoriesRepository.create(
      category,
    );
    await this.productCategoriesRepository.save(newProductCategory);
    return newProductCategory;
  }
}
