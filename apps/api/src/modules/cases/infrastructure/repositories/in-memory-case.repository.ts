import { Injectable } from "@nestjs/common";
import {
  InvestigationCase,
  InvestigationCaseProps,
} from "../../domain/entities/case.entity";
import { CaseRepository } from "../../domain/repositories/case.repository";

function createSeedCases() {
  const now = new Date();
  const activeStart = new Date(now.getTime() - 1000 * 60 * 60 * 12);
  const activeEnd = new Date(now.getTime() + 1000 * 60 * 60 * 36);
  const activeAnnounced = new Date(now.getTime() + 1000 * 60 * 60 * 48);
  const closedStart = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
  const closedEnd = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5);
  const closedAnnounced = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4);

  const seeds: InvestigationCaseProps[] = [
    {
      id: "case-file-001",
      fileNo: "FILE-001",
      title: "도시폐 호흡 오류",
      episodeNo: 1,
      accessLevel: "공개 관측 허가",
      status: "published",
      rewardName: "치킨 기프티콘 추첨 대상 등록",
      summary:
        "서울 동부 권역의 녹지 사진이 동일 파일명과 호흡기관 분류 로그로 기록되는 이상현상.",
      reportBody:
        "성수동 인근 녹지 사진들이 모두 LUNG_AREA_001.jpg로 재기록되었고, 시스템은 해당 지역을 도시형 호흡기관으로 분류했다.",
      safetyNotice:
        "공개된 공원과 산책로만 방문하고, 타인의 얼굴과 민감한 정보가 크게 드러나지 않게 촬영한다.",
      startsAt: activeStart,
      endsAt: activeEnd,
      announcedAt: activeAnnounced,
      answerLocation: "서울숲",
      identificationCode: "GREEN-LUNG-001",
      completionMessage:
        "식별 완료. 제출된 기록은 FILE-001 관측 자료로 등록되며 보상 추첨 대상에 등록됩니다.",
      clues: [
        { order: 1, title: "권역", content: "서울 동부, 반복 촬영이 많은 녹지 구역." },
        { order: 2, title: "표식", content: "현장에서 '숲'이라는 글자가 분명하게 드러난다." },
        {
          order: 3,
          title: "구조",
          content: "산책로, 낮은 건물, 벤치와 녹지 구조가 함께 등장한다.",
        },
      ],
      mission: {
        instruction: "현장을 식별하고 장소명 표식이 포함된 사진을 확보한다.",
        photoRequirement: "프레임 안에 '서울숲' 글자가 식별 가능해야 한다.",
        caution: "야간 방문과 출입금지 구역 접근은 금지한다.",
      },
    },
    {
      id: "case-file-002",
      fileNo: "FILE-002",
      title: "비어 있는 탱크의 잔류음",
      episodeNo: 2,
      accessLevel: "공개 관측 허가",
      status: "announced",
      rewardName: "치킨 기프티콘 추첨 대상 등록",
      summary:
        "공개 문화 공간의 원형 탱크 구조물에서 저주파 잔류 로그가 반복 감지되는 현상.",
      reportBody:
        "문화비축기지의 원형 구조물은 비어 있지만, 시스템은 EMPTY_TANK_ACTIVE 상태를 지속적으로 감지했다.",
      safetyNotice:
        "통제 구역에 들어가지 않고 공개된 외부 동선과 안내 표식 중심으로 조사한다.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "문화비축기지",
      identificationCode: "EMPTY-TANK-002",
      completionMessage:
        "식별 완료. FILE-002 관측 자료 등록이 완료되었고 보상 추첨 대상에 반영됩니다.",
      clues: [
        { order: 1, title: "형태", content: "원형 외벽과 회색 금속 구조." },
        { order: 2, title: "과거", content: "액체 연료를 보관하던 장소." },
        { order: 3, title: "현재", content: "시민에게 개방된 문화 공간." },
      ],
      mission: {
        instruction: "탱크 구조물 또는 안내판이 포함된 사진을 제출한다.",
        photoRequirement: "가능하면 탱크 번호 또는 안내판이 프레임에 포함되어야 한다.",
        caution: "통제 구역 진입 금지.",
      },
    },
    {
      id: "case-file-003",
      fileNo: "FILE-003",
      title: "정지된 물의 정원",
      episodeNo: 3,
      accessLevel: "공개 관측 허가",
      status: "closed",
      rewardName: "치킨 기프티콘 추첨 대상 등록",
      summary:
        "정원과 콘크리트 구조물, 수공간이 함께 있는 장소에서 EXIF 보정 시간이 00:00:00으로 고정되는 현상.",
      reportBody:
        "선유도공원으로 추정되는 장소에서 물의 흐름이 기록되지 않는 것처럼 보이는 비정상 로그가 발생했다.",
      safetyNotice:
        "공개된 산책 동선만 이용하고 타인의 얼굴을 크게 촬영하지 않는다.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "선유도공원",
      identificationCode: "STILL-WATER-003",
      completionMessage:
        "식별 완료. FILE-003 기록이 등록되었고 보상 추첨 대상에 포함됩니다.",
      clues: [
        { order: 1, title: "구조", content: "물, 콘크리트, 정원이 한 화면에 겹친다." },
        { order: 2, title: "이력", content: "과거 정수 시설이었던 흔적." },
      ],
      mission: {
        instruction: "안내판 또는 구조물과 함께 정원/물 요소가 포함된 사진을 제출한다.",
        photoRequirement: "수공간, 콘크리트 구조물, 정원 요소 중 하나 이상 포함.",
        caution: "통제 구역 접근 금지.",
      },
    },
  ];

  return seeds.map((seed) => new InvestigationCase(seed));
}

@Injectable()
export class InMemoryCaseRepository implements CaseRepository {
  private readonly cases = createSeedCases();

  async findCurrent(now: Date) {
    return (
      this.cases.find((caseItem) => caseItem.isReportOpen(now) && caseItem.isVisible()) ??
      null
    );
  }

  async findVisible() {
    return this.cases.filter((caseItem) => caseItem.isVisible());
  }

  async findById(caseId: string) {
    return this.cases.find((caseItem) => caseItem.id === caseId) ?? null;
  }
}

