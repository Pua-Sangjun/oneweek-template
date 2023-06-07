1. 폴더 구조 결정하기

    - mongo라는 폴더에 entity 및 service까지 넣을 것인지
    - 어디까지 rest로? 어디까지 graphql로?
        - 일단 유저 로그인 관련은 rest로 빼자

2. 파일 이름 결정하기

    - graphql / rest / mongo / common 로 쪼개기
    - module은 index로 export
    - xx.xx.ts로 쓰지 말고, xx.ts로 쓰기

3. 1,2번 결정 후 sample로 복사하기 쉽게 만들어두기
