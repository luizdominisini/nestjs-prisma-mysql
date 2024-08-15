import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = Number(context.switchToHttp().getRequest().params.id);
    return req;
  },
);
