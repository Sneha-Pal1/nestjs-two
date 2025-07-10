import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { UserRole } from '../entities/user.entity';

//workflow ->
// client -> jwtauthguard -> validate the token and attach the current user in the request
// -> roles guard -> check if the user has the required role to access the route
// -> if match found, proceed to controller -> if not forbidden exception is thrown

@Injectable()
export class RolesGuard implements CanActivate {
  //Reflector -> utility that will help to access metadata

  constructor(private reflector: Reflector) {}

  // -> canActivate method is called by the NestJS framework to determine if the request should be allowed to proceed
  // next method -> router.post ('/', A, B, C, handler)

  canActivate(context: ExecutionContext): boolean {
    // retrive the roles metadata set by the roles decorator

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method level metadata
        context.getClass(), // class level metadata
      ],
    );

    if (!requiredRoles) {
      return true; // if no roles are required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('user not authenticated');
    }

    const hashRequiredRoles = requiredRoles.some((role) => user.role === role);

    if (!hashRequiredRoles) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true; // if user has one of the required roles, allow access
  }
}
