# 애드노트 Render 배포

애드노트는 서버나 데이터베이스가 없는 정적 웹앱입니다. Render의 **Static Site**로 배포합니다. Web Service 및 유료 인스턴스를 생성하지 않습니다.

## 배포 설정

| 항목 | 값 |
| --- | --- |
| 종류 | Static Site |
| 이름 | adnote-reports |
| Branch | main |
| Build Command | node --check dist/app.js |
| Publish Directory | dist |
| 환경변수 | 없음 |
| 데이터베이스 | 없음 |

GitHub/GitLab/Bitbucket 저장소에 이 폴더를 올린 후 Render에서 저장소를 연결합니다. 루트의 `render.yaml`을 사용하는 Blueprint 배포도 지원합니다. 정적 사이트는 compute plan을 지정하지 않습니다.

무료 범위는 Render 계정의 트래픽·빌드 한도를 따릅니다. 실제 onrender.com 주소는 서비스 생성 후 Render가 확정합니다.

업로드한 CSV와 메모는 각 이용자의 브라우저에만 저장됩니다. 배포 URL이 바뀌면 기존 주소의 브라우저 저장 데이터가 자동으로 이동하지 않으므로 기존 사이트에서 보고서 백업을 내려받아 새 사이트에서 불러옵니다.

공식 문서: https://render.com/docs/static-sites
