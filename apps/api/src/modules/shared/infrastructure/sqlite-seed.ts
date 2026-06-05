import { InvestigationCaseProps } from "../../cases/domain/entities/case.entity";

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
        "서울 동부 녹지대 사진이 반복적으로 거대한 폐 조직처럼 분류되며 동일 좌표를 가리키고 있습니다.",
      reportBody:
        "공원 사진 여러 장이 LUNG_AREA_001로 재기록되었고, 분류기는 해당 구역을 도시 호흡 기관으로 계속 판정했습니다.",
      safetyNotice:
        "공개 산책로만 이용하고, 타인의 얼굴이나 민감한 정보가 두드러지게 촬영되지 않도록 주의해 주세요.",
      startsAt: activeStart,
      endsAt: activeEnd,
      announcedAt: activeAnnounced,
      answerLocation: "서울숲",
      identificationCode: "GREEN-LUNG-001",
      completionMessage:
        "식별이 완료되었습니다. 제출한 증거는 FILE-001 기록철에 보관되며 보상 추첨 대상에 등록됩니다.",
      clues: [
        {
          order: 1,
          title: "관측 구역",
          content: "서울 동부에 있는 대형 공원 구역이며 현장 사진 제보가 유독 많이 쌓입니다.",
        },
        {
          order: 2,
          title: "표식",
          content: "촬영 프레임 안에서 서울숲 표기를 읽을 수 있어야 합니다.",
        },
        {
          order: 3,
          title: "배경 구조",
          content: "산책로, 벤치, 낮은 건물, 짙은 수목이 한 화면에 함께 잡히는 지점을 찾으세요.",
        },
      ],
      mission: {
        instruction: "위치를 특정한 뒤, 장소를 식별할 수 있는 표식이 포함된 장면을 제출하세요.",
        photoRequirement: "서울숲 표기가 읽히는 프레임이어야 합니다.",
        caution: "야간 접근과 제한 구역 진입은 피하세요.",
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
        "원형 저장 탱크가 남아 있는 문화 공간에서 저주파 잔향이 반복 기록되며, 빈 구조물 내부에 미확인 반응이 남아 있습니다.",
      reportBody:
        "문화비축기지의 탱크 구조물은 비어 있는 것으로 보이지만, 기록 장치는 계속 EMPTY_TANK_ACTIVE 상태를 반환했습니다.",
      safetyNotice:
        "공개 관람 동선만 이용하고, 제한된 출입구나 통제 구역 대신 외부 구조물과 표지판 위주로 촬영해 주세요.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "문화비축기지",
      identificationCode: "EMPTY-TANK-002",
      completionMessage:
        "식별이 완료되었습니다. FILE-002 증거는 보관 처리되었으며 보상 추첨 대상에 포함됩니다.",
      clues: [
        {
          order: 1,
          title: "형태",
          content: "원형 외벽과 회색 산업 구조물이 반복적으로 등장합니다.",
        },
        {
          order: 2,
          title: "과거 용도",
          content: "한때 액체 연료를 저장하던 시설이었습니다.",
        },
        {
          order: 3,
          title: "현재 용도",
          content: "지금은 일반에 개방된 문화 공간으로 사용됩니다.",
        },
      ],
      mission: {
        instruction: "탱크 구조물 자체이거나 장소를 식별할 수 있는 표지판이 보이도록 촬영해 제출하세요.",
        photoRequirement: "가능하면 탱크 번호나 현장 표식을 프레임 안에 포함하세요.",
        caution: "통제 구역 내부에는 들어가지 마세요.",
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
        "정원과 콘크리트 수로가 공존하는 지점에서 EXIF 보정 시간이 반복적으로 00:00:00으로 붕괴합니다.",
      reportBody:
        "과거 정수 시설의 흔적이 남은 공원에서 흐르는 물 대신 정지한 수면이 기록되며 시간 정보가 불안정하게 끊어졌습니다.",
      safetyNotice:
        "개방된 공공 동선만 이용하고, 주변 방문객이 두드러지게 촬영되지 않도록 주의해 주세요.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "선유도공원",
      identificationCode: "STILL-WATER-003",
      completionMessage:
        "식별이 완료되었습니다. FILE-003 기록은 봉인 보관되며 보상 추첨 대상에 등록됩니다.",
      clues: [
        {
          order: 1,
          title: "겹쳐 보이는 요소",
          content: "물, 콘크리트 구조물, 정원 요소가 한 화면 안에서 겹쳐 보여야 합니다.",
        },
        {
          order: 2,
          title: "과거 흔적",
          content: "예전 정수 처리 시설의 구조가 아직 현장 곳곳에 남아 있습니다.",
        },
      ],
      mission: {
        instruction:
          "장소 표지판이나 물가와 정원 구조를 함께 식별할 수 있는 공공 구조물을 촬영해 제출하세요.",
        photoRequirement: "물, 콘크리트 구조물, 정원 표식 중 하나 이상이 분명하게 포함되어야 합니다.",
        caution: "통제 구역이나 수변 위험 구간에는 접근하지 마세요.",
      },
    },
  ];
}
