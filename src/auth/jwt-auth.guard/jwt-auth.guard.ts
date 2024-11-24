import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // You can override methods here if you need custom behavior
  // For example, you can add additional logging, error handling, etc.
}
