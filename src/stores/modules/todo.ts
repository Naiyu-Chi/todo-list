import { ref, reactive} from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
  getTodos,
  addTodo as apiAddTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
  toggleTodo as apiToggleTodo,
} from "@/api/todo";
import type { Form, Todo } from "@/types";

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

  // GETTERS
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
  const getCompletedTodos = (todoList: Todo[]): Todo[] => {
    return todoList.filter((todo) => todo.done);
  };

  /**
   * 從待辦事項列表中獲取進行中的項目
   * @param todoList - 待辦事項列表
   */
  const getInProgressTodos = (todoList: Todo[]): Todo[] => {
    return todoList.filter((todo) => !todo.done);
  };

  /**
   * 計算完成率
   * @param todoList - 待辦事項列表
   */
  const getCompletionRate = (todoList: Todo[]): number => {
    if (todoList.length === 0) return 0;
    const completedCount = getCompletedTodos(todoList).length;
    return Math.round((completedCount / todoList.length) * 100);
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
      }
      return true;
    } catch (e: any) {
      error.value = e.message;
      ElMessage.error(error.value || "獲取待辦事項失敗");
      return false;
    } finally {
      loadingState.fetching = false;
    }

    // return await getTodos();
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

    // return await apiAddTodo(form);
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

    // return await apiUpdateTodo(id, todoData);
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
    // retrun await apiDeleteTodo(id);
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

    // return await apiToggleTodo(id);
  };

  return {
    todos,
    error,
    loadingState,
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
