import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import ProductCategory from '../../product-categories/entities/product-category.entity';
import { BookProperties } from '../types/book-properties.interface';
import { CarProperties } from '../types/car-properties.interface';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products,
  )
  public category: ProductCategory;

  @Column({
    // Using jsonb would improve the read (or query) performance but write is much slower
    // can also use 'json'
    type: 'jsonb',
  })
  public properties: CarProperties | BookProperties;
}

export default Product;
