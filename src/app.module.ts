import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './hello/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { PostModule } from './post/post.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sneha',
      database: 'nestjstwo',
      entities: [Post, User],
      synchronize: true,
    }),
    AuthModule,
    HelloModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
