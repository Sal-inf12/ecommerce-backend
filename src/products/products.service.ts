import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll(options?: { categoryId?: number; search?: string; active?: boolean }): Promise<Product[]> {
    const where: any = {};
    if (options?.categoryId) where.categoryId = options.categoryId;
    if (options?.active !== undefined) where.isActive = options.active;
    if (options?.search) where.name = ILike(`%${options.search}%`);

    return this.repo.find({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repo.findOne({ 
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
