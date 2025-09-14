/**
 * 폼 관리 유틸리티 함수들
 */

/**
 * 제네릭 폼 데이터 업데이트 함수
 * @param setFormData - setState 함수
 * @param field - 업데이트할 필드명
 * @param value - 새로운 값
 */
export const updateFormField = <T>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T,
  value: string | number | boolean
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

/**
 * 폼 데이터 업데이트 헬퍼 함수를 생성하는 팩토리 함수
 * @param setFormData - setState 함수
 * @returns 특정 폼에 바인딩된 업데이트 함수
 */
export const createFormUpdater = <T>(
  setFormData: React.Dispatch<React.SetStateAction<T>>
) => {
  return (field: keyof T, value: string | number | boolean) => {
    updateFormField(setFormData, field, value);
  };
};

/**
 * 폼 초기화 함수
 * @param setFormData - setState 함수
 * @param initialValues - 초기값
 */
export const resetForm = <T>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  initialValues: T
) => {
  setFormData(initialValues);
};

/**
 * 폼 유효성 검사 - 모든 필드가 비어있지 않은지 확인
 * @param formData - 폼 데이터 객체
 * @returns 유효성 검사 결과
 */
export const isFormValid = <T>(formData: T): boolean => {
  return Object.values(formData as Record<string, unknown>).every((value) => {
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    return value !== null && value !== undefined && value !== "";
  });
};

/**
 * 특정 필드들만 유효성 검사
 * @param formData - 폼 데이터 객체
 * @param fields - 검사할 필드명 배열
 * @returns 유효성 검사 결과
 */
export const areFieldsValid = <T>(
  formData: T,
  fields: (keyof T)[]
): boolean => {
  return fields.every((field) => {
    const value = (formData as Record<string, unknown>)[field as string];
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    return value !== null && value !== undefined && value !== "";
  });
};
