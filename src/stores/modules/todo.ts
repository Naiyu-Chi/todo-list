import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
  getTodos,
  addTodo as apiAddTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
  toggleTodo as apiToggleTodo,
} from "@/api/todo";
import {
  organizeTodos,
  getGroupsInHour,
  getTimeRangeGroupsAtTime
} from "@/utils/time";
import type { Form, Todo } from "@/types";

export const useTodoStore = defineStore("todo", () => {
  // 狀態
  const todos = ref<Todo[]>([]);
  const error = ref<string | null>(null);
  const loadingState = reactive({
    fetching: false,
    adding: false,
    updating: false,
    deleting: false,
    toggling: false,
  });

  /**
   * 包裝 API 呼叫
   * @param apiCall - API 調用函數
   * @param loadingKey 
   * @param successMessage - 成功訊息
   */
  const apiCall = async (
    apiCall: () => Promise<any>,
    loadingKey: keyof typeof loadingState,
    successMessage?: string
  ) => {
    loadingState[loadingKey] = true;
    try {
      const response = await apiCall();
      if (response.data.success) {
        todos.value = response.data.data;
        if (successMessage) ElMessage.success(successMessage);
      }
      return true;
    } catch (e: any) {
      error.value = e.message;
      ElMessage.error(error.value || "操作失敗");
      return false;
    } finally {
      loadingState[loadingKey] = false;
    }
  };

  // GETTERS
  /**
   * 獲取組織後的待辦事項
   */
  const organizedTodos = computed(() => {
    return organizeTodos(todos.value);
  });

  const getGroupsByHour = computed(() => {
    return (date: string, hour: string) => {
      return getGroupsInHour(organizedTodos.value, date, hour);
    };
  });

  /**
   * 獲取特定時間點的分組
   */
  const getGroupsAtTime = computed(() => {
    return (date: string, timeSlot: string) => {
      return getTimeRangeGroupsAtTime(organizedTodos.value, date, timeSlot);
    };
  });

  /**
   * 根據日期範圍過濾待辦事項
   * @param startDate - 開始日期
   * @param endDate - 結束日期
   */
  const getTodosByDateRange = (startDate: Date, endDate: Date): Todo[] => {
    return todos.value.filter((todo) => {
      const todoDate = new Date(todo.date);
      todoDate.setHours(0, 0, 0, 0);
      return todoDate >= startDate && todoDate <= endDate;
    });
  };

  /**
   * 獲取特定日期的待辦事項
   * @param dateStr - 日期字串 (YYYY-MM-DD)
   */
  const getTodosByDate = (dateStr: string): Todo[] => {
    return todos.value.filter((todo) => todo.date === dateStr);
  };

  /**
   * 從待辦事項列表中獲取已完成的項目
   * @param todoList - 待辦事項列表
   */
  const getCompletedTodos = (todoList: Todo[] = todos.value): Todo[] => {
    return todoList.filter((todo) => todo.done);
  };

  /**
   * 從待辦事項列表中獲取進行中的項目
   * @param todoList - 待辦事項列表
   */
  const getInProgressTodos = (todoList: Todo[] = todos.value): Todo[] => {
    return todoList.filter((todo) => !todo.done);
  };

  /**
   * 計算完成率
   * @param todoList - 待辦事項列表
   */
  const getCompletionRate = (todoList: Todo[] = todos.value): number => {
    if (todoList.length === 0) return 0;
    const completedCount = getCompletedTodos(todoList).length;
    return Math.round((completedCount / todoList.length) * 100);
  };

  // ACTIONS
  /**
   * 取得待辦事項
   */
  const fetchTodos = async () => {
    return apiCall(() => getTodos(), 'fetching');
  };

  /**
   * 新增待辦事項
   */
  const addTodo = async (form: Form) => {
    return apiCall(() => apiAddTodo(form), 'adding', "新增成功");
  };

  /**
   * 更新待辦事項
   */
  const updateTodo = async (id: string | number, todoData: Form) => {
    return apiCall(() => apiUpdateTodo(id, todoData), 'updating', "更新成功");
  };

  /**
   * 刪除待辦事項
   */
  const deleteTodo = async (id: string | number) => {
    return apiCall(() => apiDeleteTodo(id), 'deleting', "刪除成功");
  };

  /**
   * 切換待辦事項完成狀態
   */
  const toggleDone = async (id: string | number) => {
    return apiCall(() => apiToggleTodo(id), 'toggling', "切換成功");
  };

  return {
    todos,
    organizedTodos,
    error,
    loadingState,
    getGroupsByHour,
    getGroupsAtTime,
    getTodosByDateRange,
    getTodosByDate,
    getCompletedTodos,
    getInProgressTodos,
    getCompletionRate,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleDone,
  };
});