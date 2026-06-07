"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminCasePayload,
  AdminCaseRecord,
  CaseClue,
  MissionInstruction,
} from "@/modules/cases/domain/case";
import {
  createAdminCase,
  updateAdminCase,
} from "@/modules/cases/infrastructure/case-admin-browser-api";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

interface AdminCaseManagerProps {
  cases: AdminCaseRecord[];
  selectedCaseId: string;
  onCasesChange: (cases: AdminCaseRecord[]) => void;
  onSelectedCaseChange: (caseId: string) => void;
}

interface AdminCaseFormState {
  fileNo: string;
  title: string;
  accessLevel: string;
  status: "draft" | "published" | "closed" | "announced";
  rewardName: string;
  summary: string;
  reportBody: string;
  safetyNotice: string;
  startsAt: string;
  endsAt: string;
  announcedAt: string;
  answerLocation: string;
  identificationCode: string;
  completionMessage: string;
  clue1Title: string;
  clue1Content: string;
  clue2Title: string;
  clue2Content: string;
  clue3Title: string;
  clue3Content: string;
  missionInstruction: string;
  missionPhotoRequirement: string;
  missionCaution: string;
}

function isoLocal(dateString: string) {
  return dateString.slice(0, 16);
}

function isoInTwoDays() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();
}

function buildDefaultForm(): AdminCaseFormState {
  const now = new Date().toISOString();
  const inTwoDays = isoInTwoDays();

  return {
    fileNo: "",
    title: "",
    accessLevel: "공개 관측",
    status: "draft",
    rewardName: "",
    summary: "",
    reportBody: "",
    safetyNotice: "",
    startsAt: isoLocal(now),
    endsAt: isoLocal(inTwoDays),
    announcedAt: isoLocal(inTwoDays),
    answerLocation: "",
    identificationCode: "",
    completionMessage: "",
    clue1Title: "",
    clue1Content: "",
    clue2Title: "",
    clue2Content: "",
    clue3Title: "",
    clue3Content: "",
    missionInstruction: "",
    missionPhotoRequirement: "",
    missionCaution: "",
  };
}

function mapCaseToForm(caseItem: AdminCaseRecord): AdminCaseFormState {
  const [clue1, clue2, clue3] = caseItem.clues;

  return {
    fileNo: caseItem.fileNo,
    title: caseItem.title,
    accessLevel: caseItem.accessLevel,
    status: caseItem.status as AdminCaseFormState["status"],
    rewardName: caseItem.rewardName,
    summary: caseItem.summary,
    reportBody: caseItem.reportBody,
    safetyNotice: caseItem.safetyNotice,
    startsAt: isoLocal(caseItem.startsAt),
    endsAt: isoLocal(caseItem.endsAt),
    announcedAt: isoLocal(caseItem.announcedAt),
    answerLocation: caseItem.answerLocation,
    identificationCode: "",
    completionMessage: caseItem.completionMessage,
    clue1Title: clue1?.title ?? "",
    clue1Content: clue1?.content ?? "",
    clue2Title: clue2?.title ?? "",
    clue2Content: clue2?.content ?? "",
    clue3Title: clue3?.title ?? "",
    clue3Content: clue3?.content ?? "",
    missionInstruction: caseItem.mission.instruction,
    missionPhotoRequirement: caseItem.mission.photoRequirement,
    missionCaution: caseItem.mission.caution,
  };
}

function buildPayload(form: AdminCaseFormState): AdminCasePayload {
  const clues: CaseClue[] = [
    { order: 1, title: form.clue1Title.trim(), content: form.clue1Content.trim() },
    { order: 2, title: form.clue2Title.trim(), content: form.clue2Content.trim() },
    { order: 3, title: form.clue3Title.trim(), content: form.clue3Content.trim() },
  ].filter((clue) => clue.title && clue.content);

  const mission: MissionInstruction = {
    instruction: form.missionInstruction.trim(),
    photoRequirement: form.missionPhotoRequirement.trim(),
    caution: form.missionCaution.trim(),
  };

  return {
    fileNo: form.fileNo.trim(),
    title: form.title.trim(),
    accessLevel: form.accessLevel.trim(),
    status: form.status,
    rewardName: form.rewardName.trim(),
    summary: form.summary.trim(),
    reportBody: form.reportBody.trim(),
    safetyNotice: form.safetyNotice.trim(),
    startsAt: new Date(form.startsAt).toISOString(),
    endsAt: new Date(form.endsAt).toISOString(),
    announcedAt: new Date(form.announcedAt).toISOString(),
    answerLocation: form.answerLocation.trim(),
    identificationCode: form.identificationCode.trim(),
    completionMessage: form.completionMessage.trim(),
    clues,
    mission,
  };
}

function buildUpdatePayload(form: AdminCaseFormState): Partial<AdminCasePayload> {
  const payload = buildPayload(form);

  if (!payload.identificationCode) {
    const { identificationCode: _identificationCode, ...rest } = payload;
    return rest;
  }

  return payload;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block text-sm font-medium text-zinc-200">{children}</span>;
}

export function AdminCaseManager({
  cases,
  selectedCaseId,
  onCasesChange,
  onSelectedCaseChange,
}: AdminCaseManagerProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "create">("edit");
  const [form, setForm] = useState<AdminCaseFormState>(buildDefaultForm);

  const selectedCase = useMemo(
    () => cases.find((caseItem) => caseItem.id === selectedCaseId) ?? cases[0] ?? null,
    [cases, selectedCaseId],
  );

  useEffect(() => {
    if (mode === "edit" && selectedCase) {
      setForm(mapCaseToForm(selectedCase));
    }
  }, [mode, selectedCase]);

  function updateForm<K extends keyof AdminCaseFormState>(key: K, value: AdminCaseFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function switchToCreateMode() {
    setMode("create");
    setMessage(null);
    setForm(buildDefaultForm());
  }

  function switchToEditMode(caseId: string) {
    onSelectedCaseChange(caseId);
    setMode("edit");
    setMessage(null);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const createdCase = await createAdminCase(buildPayload(form));
      onCasesChange([createdCase, ...cases]);
      onSelectedCaseChange(createdCase.id);
      setMode("edit");
      setForm(mapCaseToForm(createdCase));
      setMessage(`${createdCase.fileNo} 문서를 생성했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문서 생성에 실패했습니다.");
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCase) {
      return;
    }

    try {
      const updated = await updateAdminCase(selectedCase.id, buildUpdatePayload(form));
      onCasesChange(cases.map((caseItem) => (caseItem.id === updated.id ? updated : caseItem)));
      onSelectedCaseChange(updated.id);
      setForm(mapCaseToForm(updated));
      setMessage(`${updated.fileNo} 문서를 저장했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문서 저장에 실패했습니다.");
    }
  }

  async function handlePublish() {
    if (!selectedCase) {
      return;
    }

    try {
      const updated = await updateAdminCase(selectedCase.id, { status: "published" });
      onCasesChange(cases.map((caseItem) => (caseItem.id === updated.id ? updated : caseItem)));
      onSelectedCaseChange(updated.id);
      setForm(mapCaseToForm(updated));
      setMessage(`${updated.fileNo} 문서를 공개 상태로 전환했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문서 공개 처리에 실패했습니다.");
    }
  }

  const submitHandler = mode === "create" ? handleCreate : handleUpdate;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">문서 통제 목록</p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-50">
              <span className="glitch-text" data-text="사건 문서 관리">
                사건 문서 관리
              </span>
            </h3>
          </div>
          {selectedCase && mode === "edit" ? <StatusBadge label={selectedCase.status} /> : null}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={switchToCreateMode}
            className="distressed-button distressed-button-info px-4 py-2 text-sm"
          >
            새 초안 작성
          </button>
          {mode === "edit" && selectedCase ? (
            <button
              type="button"
              onClick={handlePublish}
              className="distressed-button distressed-button-danger px-4 py-2 text-sm"
            >
              선택 문서 공개
            </button>
          ) : null}
        </div>

        <div className="mt-6 space-y-3">
          {cases.map((caseItem) => (
            <button
              key={caseItem.id}
              type="button"
              onClick={() => switchToEditMode(caseItem.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                mode === "edit" && selectedCase?.id === caseItem.id
                  ? "border-rose-400/30 bg-rose-500/10"
                  : "border-white/10 bg-black/20 hover:border-rose-900/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{caseItem.fileNo}</p>
                  <p className="mt-2 text-base font-medium text-zinc-100">
                    <span className="glitch-text" data-text={caseItem.title}>
                      {caseItem.title}
                    </span>
                  </p>
                </div>
                <StatusBadge label={caseItem.status} />
              </div>
              <p className="mt-2 text-sm text-zinc-400">{caseItem.summary}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          {mode === "create" ? "새 문서 작성" : "선택 문서 편집"}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-zinc-50">
          <span
            className="glitch-text"
            data-text={mode === "create" ? "초안 생성" : "문서 세부 조정"}
          >
            {mode === "create" ? "초안 생성" : "문서 세부 조정"}
          </span>
        </h3>

        <form onSubmit={submitHandler} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <FieldLabel>문서 번호</FieldLabel>
              <input
                value={form.fileNo}
                onChange={(event) => updateForm("fileNo", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
                placeholder="FILE-010"
              />
            </label>
            <label className="block">
              <FieldLabel>상태</FieldLabel>
              <select
                value={form.status}
                onChange={(event) =>
                  updateForm("status", event.target.value as AdminCaseFormState["status"])
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50"
              >
                <option value="draft">초안</option>
                <option value="published">공개 중</option>
                <option value="closed">종료</option>
                <option value="announced">발표됨</option>
              </select>
            </label>
          </div>

          <label className="block">
            <FieldLabel>이상현상 제목</FieldLabel>
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              placeholder="현상을 식별할 제목"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <FieldLabel>열람 등급</FieldLabel>
              <input
                value={form.accessLevel}
                onChange={(event) => updateForm("accessLevel", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              />
            </label>
            <label className="block">
              <FieldLabel>보상 명칭</FieldLabel>
              <input
                value={form.rewardName}
                onChange={(event) => updateForm("rewardName", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <FieldLabel>시작 시각</FieldLabel>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(event) => updateForm("startsAt", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50"
              />
            </label>
            <label className="block">
              <FieldLabel>종료 시각</FieldLabel>
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(event) => updateForm("endsAt", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50"
              />
            </label>
            <label className="block">
              <FieldLabel>발표 시각</FieldLabel>
              <input
                type="datetime-local"
                value={form.announcedAt}
                onChange={(event) => updateForm("announcedAt", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50"
              />
            </label>
          </div>

          <label className="block">
            <FieldLabel>문서 요약</FieldLabel>
            <textarea
              value={form.summary}
              onChange={(event) => updateForm("summary", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
            />
          </label>

          <label className="block">
            <FieldLabel>관측 보고서 본문</FieldLabel>
            <textarea
              value={form.reportBody}
              onChange={(event) => updateForm("reportBody", event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
            />
          </label>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div>
              <p className="text-sm font-medium text-zinc-100">
                <span className="glitch-text" data-text="단서 편집">
                  단서 편집
                </span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">최대 3개의 단서를 문서 본문과 분리해 관리합니다.</p>
            </div>

            {[
              ["clue1Title", "clue1Content", "단서 1"],
              ["clue2Title", "clue2Content", "단서 2"],
              ["clue3Title", "clue3Content", "단서 3"],
            ].map(([titleKey, contentKey, label]) => (
              <div key={label} className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                <input
                  value={form[titleKey as keyof AdminCaseFormState] as string}
                  onChange={(event) =>
                    updateForm(titleKey as keyof AdminCaseFormState, event.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
                  placeholder={`${label} 제목`}
                />
                <textarea
                  value={form[contentKey as keyof AdminCaseFormState] as string}
                  onChange={(event) =>
                    updateForm(contentKey as keyof AdminCaseFormState, event.target.value)
                  }
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
                  placeholder={`${label} 내용`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div>
              <p className="text-sm font-medium text-zinc-100">
                <span className="glitch-text" data-text="조사 지시와 촬영 조건">
                  조사 지시와 촬영 조건
                </span>
              </p>
            </div>
            <textarea
              value={form.missionInstruction}
              onChange={(event) => updateForm("missionInstruction", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              placeholder="조사 지시"
            />
            <textarea
              value={form.missionPhotoRequirement}
              onChange={(event) => updateForm("missionPhotoRequirement", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              placeholder="촬영 조건"
            />
            <textarea
              value={form.missionCaution}
              onChange={(event) => updateForm("missionCaution", event.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              placeholder="현장 주의 문구"
            />
          </div>

          <label className="block">
            <FieldLabel>안전 수칙</FieldLabel>
            <textarea
              value={form.safetyNotice}
              onChange={(event) => updateForm("safetyNotice", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <FieldLabel>정답 위치</FieldLabel>
              <input
                value={form.answerLocation}
                onChange={(event) => updateForm("answerLocation", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
              />
            </label>
            <label className="block">
              <FieldLabel>식별 코드</FieldLabel>
              <input
                value={form.identificationCode}
                onChange={(event) => updateForm("identificationCode", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
                placeholder={
                  mode === "edit" && selectedCase?.hasIdentificationCode
                    ? "변경할 때만 새 코드를 입력"
                    : "현장 식별 코드"
                }
              />
              {mode === "edit" && selectedCase?.hasIdentificationCode ? (
                <p className="mt-2 text-xs text-zinc-500">
                  기존 식별 코드는 서버에서만 보관됩니다. 비워두면 현재 코드가 유지됩니다.
                </p>
              ) : null}
            </label>
          </div>

          <label className="block">
            <FieldLabel>조사 완료 문구</FieldLabel>
            <textarea
              value={form.completionMessage}
              onChange={(event) => updateForm("completionMessage", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 placeholder:text-zinc-500"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="distressed-button distressed-button-info px-5 py-2 text-sm"
            >
              {mode === "create" ? "초안 문서 생성" : "문서 저장"}
            </button>
            {mode === "create" && selectedCase ? (
              <button
                type="button"
                onClick={() => switchToEditMode(selectedCase.id)}
                className="distressed-button distressed-button-neutral px-5 py-2 text-sm"
              >
                기존 문서 편집으로 돌아가기
              </button>
            ) : null}
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
      </section>
    </div>
  );
}
