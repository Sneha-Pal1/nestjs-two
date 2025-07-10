import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostInterface } from './interfaces/post.interface';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Query('search') search?: string): PostInterface[] {
    const extractAllPost = this.postService.findAll();

    if (search) {
      return extractAllPost.filter((singlePost) =>
        singlePost.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return extractAllPost;
  }

  @Get('id')
  findOne(@Param('id', ParseIntPipe) id: number): PostInterface {
    return this.postService.findOne(id);
  }
}
