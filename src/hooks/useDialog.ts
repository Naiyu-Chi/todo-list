import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { Todo, Form } from '@/types';

export default function useDialog() {
    // 對話框狀態
    const dialogFormVisible = ref<boolean>(false);
    const isEditing = ref<boolean>(false);
    const dialogTitle = ref<string>('');
    const selectedId = ref<string>('');

    // 表單資料
    const form = reactive<Form>({
        name: '',
        date: null,
        startTime: '00:00',
        endTime: '00:00'
    });

    /**
     * 重置表單
     */
    function resetForm(): void {
        form.name = '';
        form.date = null;
        form.startTime = '00:00';
        form.endTime = '00:00';
        selectedId.value = '';
    }

    /**
     * 設置開啟表單預設開始時間
     */
    function setDefaultStartTime() {
        const now = new Date();
        const minutes = now.getMinutes();
        const roundedMinutes = Math.ceil(minutes / 30) * 30;

        now.setMinutes(roundedMinutes);

        const hours = now.getHours();
        const minutesStr = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${String(hours).padStart(2, '0')}:${minutesStr}`;

        form.startTime = timeString;
    }

    /**
     * 設置開啟表單預設結束時間 --> 開始時間往後一小時
     */
    function setDefaultEndTime() {
        const [startHourStr, startMinStr] = form.startTime.split(':');
        let startHour = parseInt(startHourStr);
        let startMinute = parseInt(startMinStr);

        const startDate = new Date();
        startDate.setHours(startHour);
        startDate.setMinutes(startMinute);

        const endHour = startDate.getHours() + 1;
        const endMinutes = startDate.getMinutes();
        // 轉換格式(HH:mm)
        const endTimeString = `${String(endHour).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

        form.endTime = endTimeString;
    }

    /**
     * 開啟新增對話框
     * @param {string} date - 預設日期
     */
    function openDialogForAdd(date: string, startTime?: string): void {
        dialogTitle.value = '新增待辦事項';
        isEditing.value = false;
        form.date = date;

        if (startTime) {
            form.startTime = startTime
        } else {
            setDefaultStartTime()
        }

        setDefaultEndTime()
        dialogFormVisible.value = true;
    }

    /**
     * 開啟編輯對話框
     * @param {Todo} todo - 待編輯的待辦事項
     */
    function openDialogForEdit(todo: Todo): void {
        isEditing.value = true;
        dialogTitle.value = '編輯待辦事項';
        selectedId.value = todo.id;
        form.name = todo.name;
        form.date = todo.date;
        form.startTime = todo.startTime;
        form.endTime = todo.endTime;
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
    function getFormData(): { name: string; date: string | null; startTime?: string; endTime?: string } {
        return {
            name: form.name,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime
        };
    }

    function validateForm() {
        // 檢查所有必填欄位是否都有填寫
        if (!form.name || !form.date || !form.startTime || !form.endTime) {
            ElMessage.error('請填寫全部資料');
            return false;
        }

        // 檢查開始時間是否早於現在
        const currentTime = new Date();
        const todoTime = new Date(form.date + ' ' + form.startTime);
        if (todoTime < currentTime) {
            ElMessage.error('時間不能早於現在');
            return false;
        }

        // // 檢查開始時間是否晚於結束時間
        if (form.startTime && form.endTime) {
            const [startHourStr, startMinStr] = form.startTime.split(':');
            const [endHourStr, endMinStr] = form.endTime.split(':');

            const startHour = parseInt(startHourStr);
            const startMinute = parseInt(startMinStr || '0');
            const endHour = parseInt(endHourStr);
            const endMinute = parseInt(endMinStr || '0');

            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;

            if (startTotalMinutes >= endTotalMinutes) {
                ElMessage.error('開始時間不能晚於或等於結束時間');
                return false;
            }
        }
        return true;
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
        validateForm
    };
}