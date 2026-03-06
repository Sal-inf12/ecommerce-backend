import { IsInt, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @IsPositive()
  quantity: number;
}
