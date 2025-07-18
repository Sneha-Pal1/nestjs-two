import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
}
