import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class loginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required! Please provide password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
