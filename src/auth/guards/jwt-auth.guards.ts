import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//protects routes that require authentication -> protected route

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
