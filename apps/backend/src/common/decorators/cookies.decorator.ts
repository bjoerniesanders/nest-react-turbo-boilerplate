import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request = ctx.switchToHttp().getRequest();
    if (typeof data === 'string' && data !== '') {
      return request.cookies?.[data];
    }
    return request.cookies;
  },
);
