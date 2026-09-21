# 국산 — Linear-inspired 뉴스 리서치

Linear의 어두운 작업 화면에서 영감을 얻은 자체 디자인입니다. 공식 Linear UI가 아닙니다.

## 참고
- https://linear.app/
- https://github.com/voltagent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md (제3자 분석)
- https://github.com/orioncactus/pretendard

## 원칙
차콜 #0d0f13, 패널 #171b23, 본문 #eceef3, 보조 #a0a6b3, 블루 #9aafff. 상태별 색에는 반드시 텍스트 병기.
Pretendard 가변 폰트를 로컬 제공. 본문 16px, 기사 22px, 상세 제목 30px, 정보 라벨 12–14px. 숫자는 tabular-nums. 한국어 가독성을 우선하며 명조를 사용하지 않는다.

## 구조
좌측 분야 탐색, 상단 검색·상태 필터, 최근 확인 뉴스의 강조 카드, 후속 정보, 전체 목록. 검색·분류 필터는 전체 목록에 적용하며 최근 확인 영역은 별도 요약이다.
데스크톱 상세는 오른쪽 전체 높이 읽기 패널. 모바일은 한 열과 전체 화면 상세. 기존 검색·분류·삭제 기능 유지.

## 동작
호버 및 선택에만 절제된 강조. 키보드 포커스, Escape 닫기, 감소된 모션 지원. 실제 이미지가 없는 뉴스에 장식 사진을 넣지 않는다.
