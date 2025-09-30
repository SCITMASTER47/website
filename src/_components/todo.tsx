"use client";
import { TodoProps } from "@/_types/schedule";
import { BookIcon, CalendarIcon, TimerIcon } from "@/_ui/svg/svg";
import React, { useState, useEffect } from "react";
import { Input } from "@/_ui/input";
import { Button } from "@/_ui/button";

export default function Todo({
  id,
  date,
  startPage,
  endPage,
  keywords,
  chapter,
  minute: estimatedTime,
  note,
  studyGoal,
  subject,
  isDone: completed,
  readOnly = false,
  editable = false,
  onClickDone,
  onClickEdit,
  onClickDelete,
}: TodoProps & {
  readOnly?: boolean;
  editable?: boolean;
  onClickDone?: (id: number, status: boolean) => void;
  onClickEdit?: (props: TodoProps) => void;
  onClickDelete?: (id: number) => void;
}) {
  const [editData, setEditData] = useState({
    minute: estimatedTime,
    startPage: startPage,
    endPage: endPage,
    keywords: keywords || [],
    note: note || "",
    chapter: chapter || "",
    studyGoal: studyGoal || "",
    isDone: completed,
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setEditData({
      minute: estimatedTime,
      startPage: startPage,
      endPage: endPage,
      keywords: keywords || [],
      note: note || "",
      chapter: chapter || "",
      studyGoal: studyGoal || "",
      isDone: completed,
    });
  }, [
    estimatedTime,
    startPage,
    endPage,
    keywords,
    note,
    chapter,
    studyGoal,
    completed,
  ]);

  const handleSave = () => {
    if (onClickEdit) {
      onClickEdit({
        id,
        date,
        startPage: editData.startPage,
        endPage: editData.endPage,
        keywords: editData.keywords,
        chapter: editData.chapter,
        minute: editData.minute,
        note: editData.note,
        studyGoal: editData.studyGoal,
        isDone: editData.isDone,
        subject: subject,
      });
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditData({
      minute: estimatedTime,
      startPage: startPage,
      endPage: endPage,
      keywords: keywords || [],
      note: note || "",
      chapter: chapter || "",
      studyGoal: studyGoal || "",
      isDone: completed,
    });
    setKeywordInput("");
    setIsEditMode(false);
  };

  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !editData.keywords.includes(keywordInput.trim())
    ) {
      setEditData({
        ...editData,
        keywords: [...editData.keywords, keywordInput.trim()],
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setEditData({
      ...editData,
      keywords: editData.keywords.filter((_, index) => index !== indexToRemove),
    });
  };

  return (
    <div
      className={`w-full rounded-2xl bg-white  shadow-sm px-4 py-2 flex flex-col border-transparent border border-l-4 border-l-primary/30  transition-all duration-200  ${
        completed ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-col gap-1 ">
        <div className="flex items-start justify-between">
          <div
            className={`font-semibold  text-black  ${
              completed ? "line-through" : ""
            }`}
          >
            {editable && isEditMode ? (
              <Input
                value={editData.chapter}
                onChange={(e) =>
                  setEditData({ ...editData, chapter: e.target.value })
                }
                className="h-8 text-sm font-semibold"
                placeholder="챕터명"
              />
            ) : (
              chapter
            )}
          </div>
        </div>

        {editable && isEditMode ? (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">학습 목표</div>
            <Input
              value={editData.studyGoal}
              onChange={(e) =>
                setEditData({ ...editData, studyGoal: e.target.value })
              }
              className="h-8 text-sm"
              placeholder="학습 목표를 입력하세요"
            />
          </div>
        ) : (
          studyGoal && (
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">목표:</span> {studyGoal}
            </div>
          )
        )}

        {editable && isEditMode ? (
          <div className="space-y-2 mb-2">
            <div className="text-xs text-gray-500">키워드</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {editData.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#f2f1ef] text-primary/80 text-xs font-bold border border-[#e8e7e4] flex items-center gap-1"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(idx)}
                    className="ml-1 text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                className="h-8 text-sm"
                placeholder="새 키워드 추가"
              />
              <Button onClick={addKeyword} size="sm">
                추가
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 mb-1">
            {keywords?.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#f2f1ef] text-primary/80 text-xs font-bold border border-[#e8e7e4]"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span className="text-xs text-[#a8a39a] font-medium">
              {date}
              {/* 무슨 요일인지 */}
              <span className="text-xs text-[#a8a39a] font-medium">
                {`(${new Date(date).toLocaleDateString("ko-KR", {
                  weekday: "short",
                })})`}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <BookIcon />
            {editable && isEditMode ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editData.startPage}
                  onChange={(e) =>
                    setEditData({ ...editData, startPage: e.target.value })
                  }
                  className="h-6 w-16 text-xs p-1"
                  placeholder="시작"
                />
                <span className="text-xs">-</span>
                <Input
                  value={editData.endPage}
                  onChange={(e) =>
                    setEditData({ ...editData, endPage: e.target.value })
                  }
                  className="h-6 w-16 text-xs p-1"
                  placeholder="끝"
                />
              </div>
            ) : (
              <span className="text-xs text-[#a8a39a] font-medium">
                {startPage}-{endPage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <TimerIcon />
            {editable && isEditMode ? (
              <Input
                type="number"
                value={editData.minute}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    minute: parseInt(e.target.value) || 0,
                  })
                }
                className="h-6 w-16 text-xs p-1"
                placeholder="분"
              />
            ) : (
              <span className="text-xs text-[#a8a39a] font-medium">
                {estimatedTime}분
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-2 mt-2">
        {editable && isEditMode ? (
          <div>
            <div className="text-xs text-gray-500 mb-1">노트</div>
            <textarea
              value={editData.note}
              onChange={(e) =>
                setEditData({ ...editData, note: e.target.value })
              }
              className="w-full p-2 text-xs border rounded-md resize-none h-16"
              placeholder="노트를 입력하세요"
            />
          </div>
        ) : (
          note && (
            <div className="text-xs text-gray-600 italic whitespace-pre-wrap break-words">
              {note}
            </div>
          )
        )}

        {readOnly ? null : (
          <div className="flex items-center justify-start grow gap-2">
            {editable && isEditMode ? (
              <>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  저장
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  취소
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (onClickDone) {
                      onClickDone(id, !completed);
                    }
                  }}
                  className={`bg-[#f8f9fb] flex flex-col items-center justify-center rounded-md  w-fit  border-[#dcdfe5] border py-1 px-2 hover:scale-95 active:scale-90 transition-all `}
                >
                  <div className="text-black font-medium text-xs text-nowrap">
                    완료
                  </div>
                </button>
                {editable && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className={`bg-[#f0f9ff] flex flex-col items-center justify-center rounded-md  w-fit  border-[#0ea5e9] border py-1 px-2 hover:scale-95 active:scale-90 transition-all `}
                  >
                    <div className="text-[#0ea5e9] font-medium text-xs text-nowrap">
                      편집
                    </div>
                  </button>
                )}
                {editable && onClickDelete && (
                  <button
                    onClick={() => onClickDelete(id)}
                    className={`bg-[#fef2f2] flex flex-col items-center justify-center rounded-md  w-fit  border-[#ef4444] border py-1 px-2 hover:scale-95 active:scale-90 transition-all `}
                  >
                    <div className="text-[#ef4444] font-medium text-xs text-nowrap">
                      삭제
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
