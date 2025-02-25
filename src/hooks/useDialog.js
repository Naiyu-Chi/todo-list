import { ref, reactive } from 'vue';

export default function useDialog() {
    // 對話框狀態
    const dialogFormVisible = ref(false);
    const isEditing = ref(false);
    const dialogTitle = ref('');
    const selectedId = ref('');

    // 表單資料
    const form = reactive({
        name: '',
        date: null,
    });

    /**
     * 重置表單
     */
    function resetForm() {
        form.name = '';
        form.date = null;
        selectedId.value = '';
    }

    /**
     * 開啟新增對話框
     */
    function openDialogForAdd() {
        dialogTitle.value = '新增待辦事項';
        isEditing.value = false;
        resetForm();
        dialogFormVisible.value = true;
    }

    /**
     * 開啟編輯對話框
     * @param {Object} todo - 待編輯的待辦事項
     */
    function openDialogForEdit(todo) {
        dialogTitle.value = '編輯待辦事項';
        isEditing.value = true;
        selectedId.value = todo.id;
        form.name = todo.name;
        form.date = todo.date;
        dialogFormVisible.value = true;
    }

    /**
     * 關閉對話框
     */
    function closeDialog() {
        dialogFormVisible.value = false;
        resetForm();
    }

    /**
     * 獲取當前表單資料
     * @returns {Object} 表單資料
     */
    function getFormData() {
        return {
            name: form.name,
            date: form.date
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
        getFormData
    };
}