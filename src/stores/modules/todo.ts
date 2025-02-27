// stores/todo.ts
import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import {
    getTodos,
    addTodo as apiAddTodo,
    updateTodo as apiUpdateTodo,
    deleteTodo as apiDeleteTodo,
    toggleTodo as apiToggleTodo
} from '@/api/todo';
import type { Form, Todo, TodoGroup } from '@/types';

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: [] as Todo[],
        isLoading: false,
        error: null as string | null,
        searchKeyword: '' as string,
    }),

    getters: {
        /**
         * 依照日期分組的待辦事項
         */
        todosByDate(): Record<string, TodoGroup> {
            // 按日期從早到晚排序
            const sortedTodos = [...this.todos].sort((a, b) =>
                a.date.localeCompare(b.date)
            );

            const grouped: Record<string, TodoGroup> = {};

            sortedTodos.forEach(todo => {
                const dateKey = todo.date;
                if (!grouped[dateKey]) {
                    grouped[dateKey] = {
                        done: [],
                        notDone: []
                    };
                }

                if (todo.done) {
                    grouped[dateKey].done.push(todo);
                } else {
                    grouped[dateKey].notDone.push(todo);
                }
            });

            return grouped;
        },

        /**
         * 根據搜尋關鍵字過濾的待辦事項
         */
        filteredTodosByDate(): Record<string, TodoGroup> {
            // 去除空白搜尋
            if (!this.searchKeyword.trim()) {
                return this.todosByDate;
            }

            const filtered: Record<string, TodoGroup> = {};
            const keyword = this.searchKeyword.toLowerCase();

            Object.keys(this.todosByDate).forEach(date => {
                const dateGroup = this.todosByDate[date];
                const filteredDone = dateGroup.done.filter(
                    todo => todo.name.toLowerCase().includes(keyword)
                );
                const filteredNotDone = dateGroup.notDone.filter(
                    todo => todo.name.toLowerCase().includes(keyword)
                );

                // 如果該日期有符合條件的待辦事項，則添加到結果中
                if (filteredDone.length > 0 || filteredNotDone.length > 0) {
                    filtered[date] = {
                        done: filteredDone,
                        notDone: filteredNotDone
                    };
                }
            });

            return filtered;
        },
    },
    actions: {
        /**
         * 從 API 獲取待辦事項
         */
        async fetchTodos() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await getTodos();
                if (response.data.success) {
                    this.todos = response.data.data;
                    console.log(this.todos)
                }
                return this.todos;
            } catch (err: any) {
                this.error = err.message || '獲取待辦事項失敗';
                ElMessage.error(this.error);
                console.error("Error fetching todos:", err);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * 新增一筆待辦事項
         */
        async addTodo(todoData: Form) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await apiAddTodo(todoData);
                if (response.data.success) {
                    this.todos = response.data.data;
                    // return { success: true, data: response.data.data };
                    ElMessage.success("成功新增待辦事項")
                }
                return false;
            } catch (err: any) {
                this.error = err.message || '新增待辦事項失敗';
                ElMessage.error(this.error);
                console.error("Error adding todo:", err);
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * 刪除一筆待辦事項
         */
        async deleteTodo(id: string | number) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await apiDeleteTodo(id);
                if (response.data.success) {
                    this.todos = response.data.data;
                    return { success: true, data: response.data.data };
                }
            } catch (err: any) {
                this.error = err.message || '刪除待辦事項失敗';
                ElMessage.error(this.error);
                console.error("Error deleting todo:", err);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * 更新一筆待辦事項
         */
        async updateTodo(id: string, todoData: { name: string; date: string }) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await apiUpdateTodo(id, todoData);
                console.log(response)
                if (response.data.success) {
                    this.todos = response.data.data;
                    ElMessage.success('更新成功');
                    // return { success: true, data: response.data.data };
                }
                return false;
            } catch (err: any) {
                this.error = err.message || '更新待辦事項失敗';
                ElMessage.error(this.error);
                console.error('Error updating todo:', err);
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * 切換待辦事項完成狀態
         */
        async toggleDone(id: string | number) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await apiToggleTodo(id);
                if (response.data.success) {
                    this.todos = response.data.data;
                }
            } catch (err: any) {
                this.error = err.message || '切換狀態失敗';
                ElMessage.error(this.error);
                console.error('Error toggling todo:', err);
            } finally {
                this.isLoading = false;
            }
        }
    }
});