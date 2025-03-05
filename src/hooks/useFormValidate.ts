import { type Ref } from "vue";
import { ElMessage } from "element-plus";
import type { Form } from "@/types";
import useTimeCalculation from "@/hooks/useTimeCalculation";

/**
 * 表單驗證相關功能
 * @param form - 表單數據
 */
export default function useFormValidator(form: Ref<Form>) {
  const { parseTimeToMinutes } = useTimeCalculation();

  /**
   * 驗證表單數據
   * @returns 表單是否有效
   */
  const validateForm = () => {
    // 檢查所有必填欄位是否都有填寫
    if (
      !form.value.name ||
      !form.value.date ||
      !form.value.startTime ||
      !form.value.endTime
    ) {
      ElMessage.error("請填寫全部資料");
      return false;
    }

    // 檢查開始時間是否早於現在
    const currentTime = new Date();
    const todoTime = new Date(form.value.date + " " + form.value.startTime);

    if (todoTime < currentTime) {
      ElMessage.error("時間不能早於現在");
      return false;
    }

    // 檢查開始時間是否晚於結束時間
    if (form.value.startTime && form.value.endTime) {
      const startMinutes = parseTimeToMinutes(form.value.startTime);
      const endMinutes = parseTimeToMinutes(form.value.endTime);

      if (startMinutes >= endMinutes) {
        ElMessage.error("開始時間不能晚於或等於結束時間");
        return false;
      }
    }

    return true;
  };

  return {
    validateForm,
  };
}
