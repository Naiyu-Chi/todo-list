import type { Todo } from "@/types";
const timeout = 1000;

let todos: Todo[] = [
    { id: '1', name: 'Learn Vue 2', done: true, date: '2025-02-26', startTime: '09:00', endTime: '12:00' },
    { id: '2', name: 'Learn Vue 3', done: false, date: '2025-02-26', startTime: '14:00', endTime: '15:00' },
    { id: '3', name: 'Learn React', done: false, date: '2025-02-27', startTime: '10:00', endTime: '12:00' },
    { id: '4', name: 'Build something awesome', done: false, date: '2025-02-28', startTime: '16:00', endTime: '20:00' }
];

export default [
    // 取得所有待辦事項
    {
        url: '/api/todo',
        method: "GET",
        timeout,
        response: () => {
            return {
                success: true,
                code: 200,
                data: todos,
                timeout,
                message: "成功取得待辦事項"
            }
        }
    },
    // 新增一筆待辦事項
    {
        url: '/api/todo',
        method: "POST",
        response: ({ body }) => {
            const newTodo = {
                id: crypto.randomUUID(),
                name: body.name,
                date: body.date,
                startTime: body.startTime,
                endTime: body.endTime,
                done: false
            };

            todos = [...todos, newTodo];

            return {
                success: true,
                code: 200,
                data: todos,
                timeout,
                message: "成功新增待辦事項"
            };
        }
    },
    // 刪除一筆待辦事項
    {
        url: '/api/todo/:id',
        method: "DELETE",
        response: ({ query }) => {
            todos = todos.filter(todo => todo.id !== query.id);
            return {
                success: true,
                code: 200,
                data: todos,
                timeout,
                message: "成功刪除待辦事項"
            };
        }
    },
    // 切換待辦事項完成狀態
    {
        url: '/api/todo/:id',
        method: "PATCH",
        response: ({ query }) => {
            const targetTodo = todos.find(todo => todo.id === query.id);
            if (targetTodo) {
                targetTodo.done = !targetTodo.done;
            }
            return {
                success: true,
                code: 200,
                data: todos,
                timeout,
                message: "成功切換待辦事項完成狀態"
            };
        }
    },
    // 更新一筆待辦事項
    {
        url: '/api/todo/:id',
        method: "PUT",
        response: ({ query, body }) => {
            // const targetTodo = todos.find(todo => todo.id === query.id);
            // if (targetTodo) {
            //     targetTodo.name = body.name;
            //     targetTodo.date = body.date;
            // }
            console.log(query)
            console.log(body)
            todos = todos.map(todo => {
                if (todo.id === query.id) {
                    return {
                        ...todo,
                        name: body.name,
                        date: body.date
                    }
                } else {
                    return todo
                }
            })
            return {
                success: true,
                code: 200,
                data: todos,
                timeout,
                message: "成功更新待辦事項"
            };
        }
    }

]