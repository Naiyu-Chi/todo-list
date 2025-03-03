// api/todo.ts
import request from 'axios';
import type { Form, Todo } from '@/types';

/**
 * 取得所有待辦事項
 */
export const getTodos = () => {
    return request.get('/api/todo');
};

/**
 * 新增一筆待辦事項
 * @param todo 
 */
export const addTodo = (todo: Form) => {
    return request.post('/api/todo', todo);
};

/**
 * 刪除一筆待辦事項
 * @param id 待辦事項 ID
 */
export const deleteTodo = (id: string | number) => {
    return request.delete(`/api/todo/${id}`);
};

/**
 * 切換待辦事項完成狀態
 * @param id 待辦事項 ID
 */
export const toggleTodo = (id: string | number) => {
    return request.patch(`/api/todo/${id}`);
};

/**
 * 更新一筆待辦事項
 * @param id 待辦事項 ID
 * @param todo 待更新的資料
 */
export const updateTodo = (id: string | number, todo: Form) => {
    return request.put(`/api/todo/${id}`, todo);
};