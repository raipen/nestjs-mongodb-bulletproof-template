# 구글 로그인이 가능한 간단한 메모 서버
## 사용 기술
- firebase: 구글 로그인
- nestjs: 백엔드 프레임워크
- swagger: API 문서 자동화
- mongodb: 데이터베이스
- mongoose: mongodb ODM(Object-Document Mapper)
- jest: 테스트 프레임워크
- supertest: API 테스트
- passport: 로그인 인증

# 개발 환경 구축
* 참고사항: docker compose 의 경우, 실행 환경 및 설치 방법에 따라 `docker-compose` 명령어가 동작하지 않을 수 있습니다. 이 경우, `docker compose` 명령어로 대체하여 사용하시기 바랍니다.

## 프론트엔드 개발자를 위한 백엔드 서버 + 데이터베이스 세팅
1. docker 및 docker-compose 설치
2. docker compose 실행

    2-1. 기존에 돌아가던 서버가 있는 경우, `docker-compose down --rmi local` 명령어 실행

    2-2. 프로젝트 루트 폴더에서 `docker-compose up -d` 명령어 실행
3. `localhost:3000`으로 접속하기

## 백엔드 개발자를 위한 개발 환경 세팅
1. mongodb 세팅(아래 두 가지 방법 중 하나 선택)

    1-1. 로컬에 mongodb 설치 후 실행

    1-2. 로컬에 mongodb 설치가 귀찮은 경우 `docker-compose up -d db` 명령어 실행, `localhost:27017`로 데이터베이스 접속
2. `.env` 파일 생성 후, 아래 예시를 참고하여 환경변수 설정
    ```env
    MONGODB_URL = "mongodb://localhost:27017"
    MONGODB_DBNAME_MAIN = "test"
    MONGODB_USERNAME = "root"
    MONGODB_PASSWORD = "root"

    NODE_ENV = "development"
    #NODE_ENV = "production"
    #NODE_ENV = "test"
    #PORT = 3333
    ```
    production 환경에서 필요한 환경변수는 관리자에게 문의하기
3. `npm install` 명령어 실행
4. `npm run start:dev` 명령어 실행

# 개발 가이드
## 스웨거
- `localhost:{PORT}/api`로 접속하여 API 명세 확인 가능
- 코드 작성 시 https://docs.nestjs.com/openapi/introduction 를 참고하여 작성
- request DTO
    * validation을 위한 ```@IsString()``` 등의 데코레이터를 ```class-validator``` 라이브러리 대신 ```nestjs-swagger-dto```를 사용하여 작성
        * [nestjs-swagger-dto](https://glebbash.github.io/nestjs-swagger-dto/)
    * UpdateDTO의 경우, Update 가능한 전체 필드를 작성해두고, 이를 PartialType, PickType, OmitType 등을 사용하여 작성
        * https://docs.nestjs.com/techniques/validation#mapped-types
    * 진짜 간단한 request 타입이라 DTO 만들기 귀찮은 경우, 컨트롤러 메서드에 @ApiBody, @ApiQuery, @ApiParam 등의 데코레이터를 사용하여 작성
- response DTO
    * 모든 필드에 ```@ApiProperty()``` 데코레이터를 사용하여 작성
        * ```import { ApiProperty } from '@nestjs/swagger';```
    * 컨트롤러에 적용할때는 아래 두 가지 방법 중 하나를 사용(후자 권장)
        * ```@ApiResponse({ status: 200, type: ResponseDTO })``` 혹은
        * ```@ApiOKResponse({ type: ResponseDTO })```
    * 특수한 에러 코드나 메시지가 있는 경우, 관련 응답에 대한 데코레이터와 응답 데이터 DTO도 추가할것
- ```FirebaseAuthGuard```가 전역적으로 사용 중이므로, ```@Public()``` 데코레이터가 없는 컨트롤러는 아래와 같은 데코레이터를 추가할 것
    ```typescript
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBearerAuth()
    ```
- 컨트롤러에는 @ApiTags() 데코레이터를 사용하여 태그를 추가하여 그룹화할 것
    ```typescript
    @ApiTags('auth')
    ```
* 컨트롤러 메서드에는 @ApiOperation() 데코레이터를 사용하여 API 설명을 추가할 것
    ```typescript
    @ApiOperation({ summary: 'Get all memos' })
    ```

## mongo DB 관련
* 스키마 작성
    * 특수한 validator가 필요하지 않는 이상, @Prop() 데코레이터로 타입 지정 및 required 여부 지정만으로 충분
    * 다른 스키마를 참조하는 경우, id의 타입은 string 대신 데코레이터에는 mongoose.Schema.Types.ObjectId를 사용, 필드 타입은 mongodb.Types.ObjectId를 사용(populate를 사용하는 경우, type은 관련 스키마 class로 지정 참고: https://velog.io/@raipen/nestjsmongoReferencedObjectId )
    ex)
    ```typescript
    import { Prop, Schema } from '@nestjs/mongoose';
    import { SchemaTypes, Types } from 'mongoose';

    @Schema({ timestamps: true, versionKey: false })
    export class Memo {
        @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
        author: Types.ObjectId;
    }
    ```
    * 해당 스키마의 document는 ```HydratedDocument```를 사용하여 타입 지정
* param 또는 query로 받는 id의 경우, ```@Param('id', ParseObjectIdPipe) id: Types.ObjectId```와 같이 ParseObjectIdPipe 사용하여 타입 지정
    * ParseObjectIdPipe ```common/parse-objectId.pipe.ts```에 있음
    * 이 경우, 스웨거에는 ```@ApiParam({ name: 'id', type: String })```와 같이 string으로 표시
* mongo DB 관련 에러 처리
    * 글로벌 에러 필터 ```common/mongo-exception.filter.ts```를 사용하여 에러 처리
* mongo DB가 업데이트 시, 자동 validate 하지 않는 문제를 해결하기 위하여 mongo Module을 import 할 때
    ```typescript
    import { MongooseModule } from '@nestjs/mongoose';

    ...
        MongooseModule.forFeature([
        { name: Memo.name, schema: MemoSchema },
        ])
    ...
    ```
    대신
    ```typescript
    import { MongoosModuleWithValidation } from 'src/common/mongoose-module-with-validation';

    ...
        MongoosModuleWithValidation([{ name: Memo.name, schema: MemoSchema }])
    ...
    ```
    를 사용하면 해결 가능

## API 작성
* 컨트롤러 메서드는 가능한 한 간단하게 작성
    * 비즈니스 로직은 서비스에 위임
    * 컨트롤러 메서드는 request DTO를 받아서 서비스에 전달하고, 서비스에서 받은 response DTO를 반환
* 컨트롤러 메서드의 파라미터
    * 파라미터의 작성 우선순위는 user(auth를 통해 받은 user 정보) > param > query > body
    * user 정보가 필요한 경우, ```@User() user: User```와 같이 사용
    * param의 경우, ```@Param('id', StringToObjectIdPipe) id: Types.ObjectId```와 같이 사용
* 사용자가 다른 사용자의 데이터를 수정 및 삭제하는 경우가 발생할 수 있으므로, 수정 및 삭제의 경우, 해당 데이터의 작성자와 요청자가 일치하는지 확인할 것
    * 이 경우, ```@User() user: User```를 사용하여 요청자 정보를 받아온 후, 서비스에 전달
    * 서비스에서는 요청자와 작성자가 일치하는지 확인 후, 일치하지 않으면 403 Forbidden 에러를 반환
* mongoose Model의 find, updateOne 등, Query를 반환하는 메서드는 뒤에 .exec()를 붙여 실행할 것
    * .exec()가 없어도 작동하지만, 유사 Promise(mongoose에서 자체적으로 만든)를 반환 -> .exec()를 붙이면 Promise를 반환
    * 진짜 Promise를 반환하면, 에러 처리가 편리해짐(global exception filter에서 에러를 캐치하거나, try catch로 에러 처리 가능)

## 테스팅
* 컨트롤러의 유닛테스트는 컨트롤러 메서드들이 원하는 서비스 메서드를 호출하는지, 반환값이 올바른지 확인하는 정도로 작성
* 서비스의 유닛테스트는 비즈니스 로직이 올바르게 작동하는지 확인하는 정도로 작성
