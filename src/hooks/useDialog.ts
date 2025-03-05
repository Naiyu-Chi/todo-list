import { ref, reactive } from "vue";
import type { Todo, Form } from "@/types";
import useTimeCalculation from "@/hooks/useTimeCalculation";
import useFormValidate from "@/hooks/useFormValidate";

export default function useDialog() {
  const { getCurrentRoundedTime, getDefaultEndTime } = useTimeCalculation();

  // 對話框狀態
  const dialogFormVisible = ref<boolean>(false);
  const isEditing = ref<boolean>(false);
  const dialogTitle = ref<string>("");
  const selectedId = ref<string>("");

  // 表單資料
  const form = reactive<Form>({
    name: "",
    date: null,
    startTime: "00:00",
    endTime: "00:00",
  });

  const { validateForm } = useFormValidate(ref(form));

  /**
   * 重置表單
   */
  function resetForm(): void {
    form.name = "";
    form.date = null;
    form.startTime = "00:00";
    form.endTime = "00:00";
    selectedId.value = "";
  }

  /**
   * 設置開啟表單預設開始時間
   */
  function setDefaultStartTime() {
    form.startTime = getCurrentRoundedTime();
  }

  /**
   * 設置開啟表單預設結束時間 --> 開始時間往後一小時
   */
  function setDefaultEndTime() {
    form.endTime = getDefaultEndTime(form.startTime);
  }

  /**
   * 開啟新增對話框
   * @param {string} date - 預設日期
   * @param {string} startTime - 可選的預設開始時間
   */
  function openDialogForAdd(date: string, startTime?: string): void {
    dialogTitle.value = "新增待辦事項";
    isEditing.value = false;
    form.date = date;

    if (startTime) {
      form.startTime = startTime;
    } else {
      setDefaultStartTime();
    }

    setDefaultEndTime();
    dialogFormVisible.value = true;
  }

  /**
   * 開啟編輯對話框
   * @param {Todo} todo - 待編輯的待辦事項
   */
  function openDialogForEdit(todo: Todo): void {
    isEditing.value = true;
    dialogTitle.value = "編輯待辦事項";
    selectedId.value = todo.id;
    form.name = todo.name;
    form.date = todo.date;
    form.startTime = todo.startTime;
    form.endTime = todo.endTime;
    form.done = todo.done;
    dialogFormVisible.value = true;
  }

  /**
   * 關閉對話框
   */
  function closeDialog(): void {
    dialogFormVisible.value = false;
    resetForm();
  }

  /**
   * 獲取當前表單資料
   * @returns {Object} 表單資料
   */
  function getFormData(): {
    name: string;
    date: string | null;
    startTime?: string;
    endTime?: string;
  } {
    return {
      name: form.name,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    };
  }

  return {
    dialogFormVisible,
    isEditing,
    dialogTitle,
    selectedId,
    form,
    openDialogForAdd,
    openDialogForEdit,
    closeDialog,
    getFormData,
    validateForm,
  };
}
