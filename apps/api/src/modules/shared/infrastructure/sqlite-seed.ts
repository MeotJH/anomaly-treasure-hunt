import { InvestigationCaseProps } from "../../cases/domain/entities/case.entity";
import { createHash } from "node:crypto";

function hashCode(code: string) {
  return createHash("sha256")
    .update(code.trim().toUpperCase().replace(/\s+/g, ""))
    .digest("hex");
}

export function createSeedCases(now = new Date()): InvestigationCaseProps[] {
  const activeStart = new Date(now.getTime() - 1000 * 60 * 60 * 12);
  const activeEnd = new Date(now.getTime() + 1000 * 60 * 60 * 36);
  const activeAnnounced = new Date(now.getTime() + 1000 * 60 * 60 * 48);
  const closedStart = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
  const closedEnd = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5);
  const closedAnnounced = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4);

  return [
    {
      id: "case-file-001",
      fileNo: "FILE-001",
      title: "도시 폐엽 신호 변조",
      episodeNo: 1,
      accessLevel: "공개 관측",
      status: "published",
      rewardName: "치킨 기프티콘 추첨권",
      summary:
        "서로 다른 공원 사진이 저장 이후 같은 이름으로 재기록되고 있습니다. 분석기는 특정 장소명을 끝까지 복원하지 못한 채, 식생과 호흡기관에 관한 비정상 문장을 반복 출력합니다.",
      reportBody: `최근 서울 동부 권역에서 업로드된 공원 사진 일부가 동일한 오류명을 가진 파일로 재기록되고 있다.

원본 파일명은 서로 달랐다.

IMG_1427.jpg -> LUNG_AREA_001.jpg
IMG_2031.jpg -> LUNG_AREA_001.jpg
IMG_8810.jpg -> LUNG_AREA_001.jpg

초기 분류팀은 단순 색인 오류로 판단했다.

그러나 동일 증상이 11건 추가 수집된 뒤, 분석기는 아래 문장을 고정 출력하기 시작했다.

도시형 호흡기관 감지
녹지 밀도 비정상 상승
회색 구조물 내부의 폐엽 반응 확인

사진 속 피사체는 특이하지 않았다.

벤치, 산책로, 수목, 낮은 건물, 걷는 사람들.

문제는 구성 요소가 아니라 귀속 좌표였다.

촬영 위치는 서로 달랐지만, 저장 이후 좌표는 반복적으로 하나의 지점으로 수렴했다.

[관측자 진술 04-1]
"찍을 때는 그냥 공원 사진이었어요. 다시 열어보니까 자꾸 같은 문장이 떠 있었어요."

LOCATION NAME REQUIRED
LOCATION NAME REQUIRED
LOCATION NAME REQUIRED

제보자는 장소명을 입력하지 않았다고 진술했다.

그러나 빈 입력값은 아래 문자로 자동 보정되었다.

ㅅ
ㅜ
ㅍ

이후 해당 이미지는 일반 풍경으로 분류되지 않았다.

[편집 주석]
최초 두 음절은 보고서 본문에서 삭제되었다.
삭제 사유: 현장 직행 유도 가능성.`,
      safetyNotice:
        "공개 산책로에서만 촬영하고, 타인의 얼굴이 크게 식별되지 않도록 주의할 것. 출입금지 구역, 사유지, 공사장, 야간 저시인 환경 접근은 금지한다.",
      startsAt: activeStart,
      endsAt: activeEnd,
      announcedAt: activeAnnounced,
      answerLocation: "서울숲",
      identificationCodeHash: hashCode("GREEN-LUNG-001"),
      completionMessage:
        "식별 코드와 현장 증거가 접수되었습니다. 승인된 보고서는 FILE-001 보상 추첨 대상에 편입됩니다.",
      clues: [
        {
          order: 1,
          title: "관측 구역",
          content:
            "오류는 서울 동부의 대형 녹지 권역에서 집중 발생했다. 도시 안에 있으나, 이름은 건물보다 오래된 것에 가깝다.",
        },
        {
          order: 2,
          title: "주변 잔류 기록",
          content:
            "과거 기록에는 공장과 창고의 냄새가 남아 있다. 현재 기록에는 붉은 벽돌, 낮은 카페, 긴 대기 줄, 사진을 찍는 방문자가 반복 등장한다.",
        },
        {
          order: 3,
          title: "이름 조각",
          content:
            "분석기는 장소명을 끝까지 복원하지 못하고 마지막 글자만 남긴다. 첫 두 글자는 도시명과 동일하며, 마지막 한 글자는 나무들이 혼자가 아닐 때 생기는 것이다.",
        },
      ],
      mission: {
        instruction:
          "발생 위치를 식별한 뒤, 현장에서 장소명이 확인되는 구조물을 확보하라. 표식이 없는 사진은 장소가 아닌 풍경으로 분류된다.",
        photoRequirement:
          "프레임 안에 장소명 표식, 안내판, 입구 표지, 또는 해당 장소를 식별할 수 있는 공식 구조물 중 하나 이상이 읽혀야 한다.",
        caution:
          "공개 동선 밖으로 벗어나지 말 것. 군중 밀집 시간대에는 타인 식별 정보 유입에 주의할 것.",
      },
    },
    {
      id: "case-file-002",
      fileNo: "FILE-002",
      title: "빈 탱크의 잔향",
      episodeNo: 2,
      accessLevel: "공개 관측",
      status: "announced",
      rewardName: "치킨 기프티콘 추첨권",
      summary:
        "대형 원통 구조물이 비어 있음에도 내부 공명 로그가 반복 기록됩니다. 저장 장치는 비어 있는 탱크를 계속 작동 중 설비로 분류합니다.",
      reportBody: `폐쇄된 산업 시설 재생 구역에서 비어 있는 원통 구조물이 반복적으로 잔향을 생성하고 있다.

현장 오디오에는 실체 없는 저주파가 남고, 분류기는 매번 동일한 상태값을 반환한다.

EMPTY_TANK_ACTIVE
EMPTY_TANK_ACTIVE
EMPTY_TANK_ACTIVE

외부 관찰만 허용되며, 내부 접근 시도는 기록에서 제외된다.`,
      safetyNotice:
        "통제선 내부 진입 금지. 공개 관람 동선과 안내 표지 주변에서만 촬영하고, 구조물 접촉이나 월담을 시도하지 말 것.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "문화비축기지",
      identificationCodeHash: hashCode("EMPTY-TANK-002"),
      completionMessage: "FILE-002 보고서가 처리되었습니다. 승인된 제보는 추첨 대상에 반영됩니다.",
      clues: [
        {
          order: 1,
          title: "구조",
          content: "원형 금속 외피와 번호가 붙은 대형 저장 구조물이 반복적으로 관측된다.",
        },
        {
          order: 2,
          title: "과거 용도",
          content: "한때 액체 연료를 저장하던 장소였으나, 현재는 문화 공간으로 재생되었다.",
        },
        {
          order: 3,
          title: "현장 규칙",
          content: "내부보다 외부 표식이 더 중요하다. 장소명 또는 구조물 번호가 보이지 않으면 증거 효력이 약하다.",
        },
      ],
      mission: {
        instruction:
          "현장 구조물 또는 공식 표지 중 하나를 확보하라. 비어 있는 표면만 촬영한 이미지는 배경 자료로만 분류된다.",
        photoRequirement:
          "탱크 번호, 안내판, 또는 장소명 표식 중 하나 이상이 프레임 안에서 읽혀야 한다.",
        caution: "통제 구역 진입 금지. 난간이나 폐쇄 구역 위로 기기를 올리지 말 것.",
      },
    },
    {
      id: "case-file-003",
      fileNo: "FILE-003",
      title: "정지 수면의 정원",
      episodeNo: 3,
      accessLevel: "공개 관측",
      status: "closed",
      rewardName: "치킨 기프티콘 추첨권",
      summary:
        "정원과 콘크리트 수로가 공존하는 구역에서 EXIF 시간이 반복적으로 00:00:00으로 붕괴합니다. 물과 구조물이 동시에 잡힌 프레임에서 증상이 심화됩니다.",
      reportBody: `과거 정수 시설의 흔적이 남아 있는 공원 구역에서 시간 메타데이터가 정지한다.

특정 수면을 촬영한 이미지의 EXIF 값은 보정 이후에도 00:00:00으로 되돌아간다.

프레임에는 물, 콘크리트 구조물, 정원 요소가 함께 등장하는 경우가 많다.`,
      safetyNotice:
        "공개 동선에서만 촬영할 것. 수면 가장자리, 시설 외곽, 미끄러운 구간 접근을 피하고 방문객 얼굴이 과도하게 노출되지 않도록 주의할 것.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "선유도공원",
      identificationCodeHash: hashCode("STILL-WATER-003"),
      completionMessage:
        "FILE-003 기록이 보강되었습니다. 검토 완료된 증거는 보상 추첨 대상에 포함됩니다.",
      clues: [
        {
          order: 1,
          title: "복합 구조",
          content: "물, 콘크리트 구조물, 정원 요소가 한 시야 안에 공존한다.",
        },
        {
          order: 2,
          title: "과거 흔적",
          content: "현재는 공원으로 쓰이지만, 이전에는 물을 다루던 시설이었다.",
        },
      ],
      mission: {
        instruction:
          "공식 구조물 또는 장소명 표식이 포함된 장면을 제출하라. 수면만 담긴 이미지는 위치 식별 실패로 처리된다.",
        photoRequirement:
          "물 또는 콘크리트 구조와 함께, 장소를 특정할 수 있는 표식 한 가지 이상이 분명하게 보여야 한다.",
        caution: "출입 제한 구역 진입 금지. 난간 바깥이나 습한 구조면 위 촬영 시도를 금한다.",
      },
    },
  ];
}
