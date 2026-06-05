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
      title: "Urban Lung Signal Drift",
      episodeNo: 1,
      accessLevel: "Public Observation",
      status: "published",
      rewardName: "Chicken gifticon raffle entry",
      summary:
        "Green-space photos in eastern Seoul are repeatedly classified as a lung-like urban structure.",
      reportBody:
        "Multiple park photos were rewritten as LUNG_AREA_001.jpg, and the system kept classifying the area as an urban breathing organ.",
      safetyNotice:
        "Use public walking routes only and avoid capturing faces or sensitive information prominently.",
      startsAt: activeStart,
      endsAt: activeEnd,
      announcedAt: activeAnnounced,
      answerLocation: "Seoul Forest",
      identificationCode: "GREEN-LUNG-001",
      completionMessage:
        "Identification complete. The submitted evidence has been archived under FILE-001 and entered into the reward draw.",
      clues: [
        {
          order: 1,
          title: "Region",
          content: "Eastern Seoul, a park zone with frequent photo submissions.",
        },
        {
          order: 2,
          title: "Signage",
          content: "The photographed frame should clearly reveal the Seoul Forest label.",
        },
        {
          order: 3,
          title: "Structure",
          content:
            "Look for public walking paths, benches, low buildings, and dense greenery in one frame.",
        },
      ],
      mission: {
        instruction:
          "Identify the location and submit a frame that includes recognizable location signage.",
        photoRequirement: "The frame should make the Seoul Forest label readable.",
        caution: "Avoid night visits and restricted areas.",
      },
    },
    {
      id: "case-file-002",
      fileNo: "FILE-002",
      title: "Residual Echo in the Empty Tanks",
      episodeNo: 2,
      accessLevel: "Public Observation",
      status: "announced",
      rewardName: "Chicken gifticon raffle entry",
      summary:
        "A public cultural site with circular tanks repeatedly emits low-frequency residue in archived audio logs.",
      reportBody:
        "The tank structures at Oil Tank Culture Park appear empty, but the system continues to classify the area as EMPTY_TANK_ACTIVE.",
      safetyNotice:
        "Stay on public visitor routes and use exterior structures or signs rather than restricted access points.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "Oil Tank Culture Park",
      identificationCode: "EMPTY-TANK-002",
      completionMessage:
        "Identification complete. FILE-002 evidence has been archived and entered into the reward draw.",
      clues: [
        {
          order: 1,
          title: "Form",
          content: "Circular exterior walls and grey industrial structures.",
        },
        {
          order: 2,
          title: "Past use",
          content: "A site that once stored liquid fuel.",
        },
        {
          order: 3,
          title: "Current use",
          content: "Now open to the public as a culture space.",
        },
      ],
      mission: {
        instruction:
          "Submit a photo showing either the tank structure or a clear site sign.",
        photoRequirement: "Include a tank number or sign when possible.",
        caution: "Do not enter controlled zones.",
      },
    },
    {
      id: "case-file-003",
      fileNo: "FILE-003",
      title: "Garden of Still Water",
      episodeNo: 3,
      accessLevel: "Public Observation",
      status: "closed",
      rewardName: "Chicken gifticon raffle entry",
      summary:
        "At a garden-and-concrete water site, EXIF correction times keep collapsing to 00:00:00.",
      reportBody:
        "A park-like site with former water treatment structures keeps producing imagery that suggests still water instead of flow.",
      safetyNotice:
        "Use only open public paths and avoid capturing bystanders prominently.",
      startsAt: closedStart,
      endsAt: closedEnd,
      announcedAt: closedAnnounced,
      answerLocation: "Seonyudo Park",
      identificationCode: "STILL-WATER-003",
      completionMessage:
        "Identification complete. FILE-003 has been archived and entered into the reward draw.",
      clues: [
        {
          order: 1,
          title: "Structure",
          content:
            "Water, concrete, and garden elements should overlap in a single public frame.",
        },
        {
          order: 2,
          title: "History",
          content: "The site still shows traces of older water treatment infrastructure.",
        },
      ],
      mission: {
        instruction:
          "Capture a frame that includes site signage or a recognizable public structure with water or garden elements.",
        photoRequirement:
          "Include at least one of: water, concrete structure, or garden markers.",
        caution: "Do not access controlled zones.",
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

  async findAll() {
    return [...this.cases];
  }

  async findById(caseId: string) {
    return this.cases.find((caseItem) => caseItem.id === caseId) ?? null;
  }

  async create(caseItem: InvestigationCase) {
    this.cases.unshift(caseItem);
  }

  async update(
    caseId: string,
    next: Partial<ReturnType<InvestigationCase["toSnapshot"]>>,
  ) {
    const caseItem = await this.findById(caseId);

    if (!caseItem) {
      throw new Error(`Case ${caseId} was not found.`);
    }

    caseItem.update(next);
    return caseItem;
  }
}
