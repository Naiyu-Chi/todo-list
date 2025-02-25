import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

// 用於管理待辦事項的 Hook
export default function useTodo() {
    const searchKeyword = ref('');

    // 初始資料
    const todos = reactive([
        { id: 1, name: 'Learn Vue 2', done: true, date: '2025-02-26' },
        { id: 4, name: 'Learn Vue 3', done: false, date: '2025-02-26' },
        { id: 2, name: 'Learn React', done: false, date: '2025-02-27' },
        { id: 3, name: 'Build something awesome', done: false, date: '2025-02-28' },
    ]);

    /**
     * 根據ID查找待辦事項的索引
     * @param {string|number} id - 待辦事項ID
     * @returns {number} 索引值或-1(未找到)
     */
    function findTodoIndex(id) {
        return todos.findIndex(todo => todo.id === id);
    }

    /**
     * 驗證待辦事項資料
     * @param {Object} data - 待辦事項資料
     * @returns {boolean} 資料是否有效
     */
    function validateForm(data) {
        if (!data || !data.name || !data.date) {
            ElMessage({
                showClose: true,
                message: '請輸入待辦事項名稱和日期',
                type: 'warning',
            });
            return false;
        }
        return true;
    }

    /**
     * 添加新的待辦事項
     * @param {Object} todo - 待辦事項對象
     * @returns {boolean} 是否添加成功
     */
    function addTodo(todo) {
        if (!validateForm(todo)) return false;

        todos.push({
            id: crypto.randomUUID(),
            name: todo.name,
            date: todo.date,
            done: false,
        });

        ElMessage({
            type: 'success',
            message: '待辦事項已新增',
            duration: 2000
        });

        return true;
    }

    /**
     * 更新現有待辦事項
     * @param {string|number} id - 待辦事項ID
     * @param {Object} updates - 更新的欄位
     * @returns {boolean} 是否更新成功
     */
    function updateTodo(id, updates) {
        if (!validateForm(updates)) return false;

        const index = findTodoIndex(id);
        if (index !== -1) {
            Object.assign(todos[index], updates);

            ElMessage({
                type: 'success',
                message: '待辦事項已更新',
                duration: 2000
            });
            return true;
        }

        ElMessage({
            type: 'error',
            message: '找不到要更新的項目',
            duration: 2000
        });
        return false;
    }

    /**
     * 刪除待辦事項
     * @param {Object} todo - 待辦事項對象
     */
    function deleteTodo(todo) {
        const index = findTodoIndex(todo.id);
        if (index !== -1) {
            todos.splice(index, 1);

            ElMessage({
                type: 'success',
                message: '待辦事項已刪除',
                duration: 2000
            });
        }
    }

    /**
     * 切換待辦事項完成狀態
     * @param {Object} todo - 待辦事項對象
     */
    function toggleDone(todo) {
        const index = findTodoIndex(todo.id);
        if (index !== -1) {
            todos[index].done = !todos[index].done;
        }
    }

    // 依照日期分組的待辦事項
    const todosByDate = computed(() => {
        // 按日期從早到晚排序
        const sortedTodos = [...todos].sort((a, b) => {
            return a.date.localeCompare(b.date);
        });

        const grouped = {};

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
    });

    // 根據搜尋關鍵字過濾的待辦事項，並按照日期排序
    const filteredTodosByDate = computed(() => {
        // 去除空白搜尋
        if (!searchKeyword.value.trim()) {
            return todosByDate.value;
        }

        const filtered = {};
        const keyword = searchKeyword.value.toLowerCase();

        Object.keys(todosByDate.value).forEach(date => {
            const dateGroup = todosByDate.value[date];
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
    });

    // 匯出所需的狀態和方法
    return {
        todos,
        searchKeyword,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleDone,
        filteredTodosByDate
    };
}