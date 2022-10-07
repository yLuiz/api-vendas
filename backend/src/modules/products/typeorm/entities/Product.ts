import OrdersProducts from "@modules/orders/typeorm/entities/OrdersProducts";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
class Product {
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @OneToMany(type => OrdersProducts, order_products => order_products.product, { cascade: true})
  order_products: OrdersProducts[];

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;