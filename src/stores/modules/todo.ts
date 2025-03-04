import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
import { defineStore } from "pinia";
import { ElMessage, ElLoading } from "element-plus";
import {
    getTodos,
    addTodo as apiAddTodo,
    updateTodo as apiUpdateTodo,
    deleteTodo as apiDeleteTodo,
    toggleTodo as apiToggleTodo,
} from "@/api/todo";
import type { Form, Todo } from "@/types";
import type { LoadingInstance } from "element-plus/es/components/loading/src/loading.mjs";

export const useTodoStore = defineStore("todo", () => {
    // STATE
    const todos = ref<Todo[]>([]);
    const error = ref<string | null>(null);
    const loadingState = reactive({
        fetching: false,
        adding: false,
        updating: false,
        deleting: false,
        toggling: false,
    });
    let loadingInstance: LoadingInstance | null = null;

    // Add references to store the selected week range
    const selectedWeekStart = ref<Date>(new Date());
    const selectedWeekEnd = ref<Date>(new Date());

    // GETTERS
    /**
     * 取得本周待辦事項清單
     * @returns thisWeekTodos - 當前所有待辦事項
     */
    const todosByWeek = computed(() => {
        // Use the selected week range instead of calculating from today
        return todos.value.filter(todo => {
            const todoDate = new Date(todo.date);
            return todoDate >= selectedWeekStart.value && todoDate <= selectedWeekEnd.value;
        });
    });

    // 篩選已完成的項目
    const completedTodos = computed((): Todo[] => {
        return todosByWeek.value.filter(todo => todo.done);
    })

    // 篩選未完成的項目
    const onProgressTodos = computed((): Todo[] => {
        return todosByWeek.value.filter(todo => !todo.done);
    })

    /**
     * 設置選定的週範圍
     * @param start - 週的開始日期
     * @param end - 週的結束日期
     */
    const setSelectedWeek = (start: Date, end: Date) => {
        selectedWeekStart.value = start;
        selectedWeekEnd.value = end;
    };

    /**
     * 初始化週範圍（如果沒有設置的話）
     */
    const initWeekRange = () => {
        if (!selectedWeekStart.value || !selectedWeekEnd.value) {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
            endOfWeek.setHours(23, 59, 59, 999);

            selectedWeekStart.value = startOfWeek;
            selectedWeekEnd.value = endOfWeek;
        }
    };

    // ACTIONS
    /**
     * 取得待辦事項
     */
    const fetchTodos = async () => {
        if (loadingState.fetching) return;

        loadingState.fetching = true;
        try {
            const response = await getTodos();
            if (response.data.success) {
                todos.value = response.data.data;
                // Initialize week range after fetching todos
                initWeekRange();
            }
        } catch (e: any) {
            error.value = e.message;
            ElMessage.error(error.value || "獲取待辦事項失敗");
        } finally {
            loadingState.fetching = false;
        }
    };

    /**
     * 新增待辦事項
     */
    const addTodo = async (form: Form) => {
        loadingState.adding = true;
        try {
            const response = await apiAddTodo(form);
            if (response.data.success) {
                todos.value = response.data.data; // 更新整個列表
                ElMessage.success("新增成功");
            }
            return true;
        } catch (e: any) {
            error.value = e.message;
            ElMessage.error(error.value || "新增待辦事項失敗");
            return false;
        } finally {
            loadingState.adding = false;
        }
    };

    /**
     * 更新待辦事項
     */
    const updateTodo = async (id: string | number, todoData: Form) => {
        loadingState.updating = true;
        try {
            const response = await apiUpdateTodo(id, todoData);
            if (response.data.success) {
                todos.value = response.data.data;
                ElMessage.success("更新成功");
            }
            return true;
        } catch (e: any) {
            error.value = e.message;
            ElMessage.error(error.value || "更新待辦事項失敗");
            return false;
        } finally {
            loadingState.updating = false;
        }
    };

    /**
     * 刪除待辦事項
     */
    const deleteTodo = async (id: string | number) => {
        loadingState.deleting = true;
        try {
            const response = await apiDeleteTodo(id);
            if (response.data.success) {
                todos.value = response.data.data;
                ElMessage.success("刪除成功");
            }
            return true;
        } catch (e: any) {
            error.value = e.message;
            ElMessage.error(error.value || "刪除待辦事項失敗");
            return false;
        } finally {
            loadingState.deleting = false;
        }
    };

    /**
     * 切換待辦事項完成狀態
     */
    const toggleDone = async (id: string | number) => {
        loadingState.toggling = true;
        try {
            const response = await apiToggleTodo(id);
            if (response.data.success) {
                todos.value = response.data.data;
                ElMessage.success("切換成功");
            }
            return true;
        } catch (e: any) {
            error.value = e.message;
            ElMessage.error(error.value || "切換待辦事項狀態失敗");
            return false;
        } finally {
            loadingState.toggling = false;
        }
    };

    // Move to global api
    // onMounted(() => {
    //     fetchTodos()
    // })

    // watch(() => loadingState.fetching, (value) => {
    //     if (value) {
    //         loadingInstance = ElLoading.service({
    //             lock: true,
    //             text: "讀取資料中..."
    //         })
    //     } else {
    //         nextTick(() => {
    //             loadingInstance?.close()
    //         })
    //     }
    // })

    return {
        todos,
        error,
        loadingState,
        todosByWeek,
        completedTodos,
        onProgressTodos,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleDone,
        setSelectedWeek, // Expose the new method
        selectedWeekStart,
        selectedWeekEnd
    };
});