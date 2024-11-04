import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    //PassportStrategy의 validate 메서드에서 반환한 객체가 user 프로퍼티에 할당되어 있음
    return request.user;
  },
);
