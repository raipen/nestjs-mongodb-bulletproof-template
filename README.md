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
