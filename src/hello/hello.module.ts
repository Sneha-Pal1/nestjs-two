import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    //this will make the post repository available for injection
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
