import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostService {
  private post: Post[] = [
    {
      id: 1,
      title: 'First',
      content: 'First Post Content',
      authorName: 'Sneha',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(): Post[] {
    return this.post;
  }

  findOne(id: number): Post {
    const singlePost = this.post.find((post) => post.id === id);

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }
    return singlePost;
  }
}
