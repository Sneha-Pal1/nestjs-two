import { IsOptional } from "class-validator";


export class FindPostsQueryDto extends PaginationQueryDto{
    @IsOptional()
}