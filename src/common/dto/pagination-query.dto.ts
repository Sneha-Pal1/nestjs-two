import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an Integer' })
  @Min(1, { message: 'Page must be atleast 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an Integer' })
  @Min(1, { message: 'Limit must be atleast 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  Limit?: number = 10;
}
