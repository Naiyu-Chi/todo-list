import moment from 'moment';

/**
 * @param {Array} todos - 原始待辦事項陣列
 * @return {Object} - 按日期和時間範圍組織的結構
 */
export function organizeTodos(todos) {
    if (!todos || !todos.length) return {};

    // 按日期分組
    const byDate = {};

    todos.forEach(todo => {
        if (!todo.date) return;

        if (!byDate[todo.date]) {
            byDate[todo.date] = {
                events: [],
                hourSlots: {}
            };
        }

        byDate[todo.date].events.push({ ...todo });
    });

    // 對每一天的事件進行全局重疊處理
    Object.keys(byDate).forEach(date => {
        // 先將事件按開始時間排序
        byDate[date].events.sort((a, b) => {
            const aStart = a.startTime;
            const bStart = b.startTime;
            return moment(`${date} ${aStart}`).diff(moment(`${date} ${bStart}`));
        });

        // 找出具有相同開始時間和結束時間的事件並進行分組
        const exactTimeGroups = groupEventsByExactTimeRange(byDate[date].events);

        // 計算重疊組和分配位置
        calculateGlobalOverlap(exactTimeGroups, date);

        // 將分組按小時進行組織，以便於在日曆視圖中使用
        organizeGroupsByHour(exactTimeGroups, byDate[date], date);
    });

    return byDate;
}

/**
 * 將具有相同開始時間和結束時間的事件分為一組
 * @param {Array} events - 事件列表
 * @return {Array} - 分組後的事件
 */
function groupEventsByExactTimeRange(events) {
    const timeRangeGroups = [];
    const groupMap = {};

    events.forEach(event => {
        if (!event.startTime || !event.endTime) return;

        // 使用開始時間和結束時間當鍵值
        // 如果完全相同，則事件在同一分組
        const timeRangeKey = `${event.startTime}-${event.endTime}`;

        if (!groupMap[timeRangeKey]) {
            const newGroup = {
                startTime: event.startTime,
                endTime: event.endTime,
                events: [event],
                position: 0, // 位置偏移
                total: 1
            };
            timeRangeGroups.push(newGroup);
            groupMap[timeRangeKey] = newGroup;
        } else {
            groupMap[timeRangeKey].events.push(event);
        }
    });
    return timeRangeGroups;
}

/**
 * 計算全局重疊並分配位置
 * @param {Array} groups - 事件分組
 * @param {string} date - 日期
 */
function calculateGlobalOverlap(groups, date) {
    if (groups.length <= 1) return;

    // 建立重疊圖 - 追蹤哪些組重疊
    const overlapGraph = {};
    groups.forEach((_, index) => {
        overlapGraph[index] = [];
    });

    // 檢測哪些組之間存在時間重疊
    for (let i = 0; i < groups.length; i++) {
        const groupA = groups[i];
        const startA = moment(`${date} ${groupA.startTime}`, 'YYYY-MM-DD HH:mm');
        const endA = moment(`${date} ${groupA.endTime}`, 'YYYY-MM-DD HH:mm');

        for (let j = i + 1; j < groups.length; j++) {
            const groupB = groups[j];
            const startB = moment(`${date} ${groupB.startTime}`, 'YYYY-MM-DD HH:mm');
            const endB = moment(`${date} ${groupB.endTime}`, 'YYYY-MM-DD HH:mm');

            if (startA.isBefore(endB) && endA.isAfter(startB)) {
                overlapGraph[i].push(j);
                overlapGraph[j].push(i);
            }
        }
    }

    // 找出連接的群組（重疊的事件群組）
    const components = findConnectedComponents(overlapGraph);

    // 處理每個連接的群組
    components.forEach(component => {
        if (component.length === 1) {
            // 如果群組只有一個事件，不需要分配位置
            const index = component[0];
            groups[index].position = 0;
            groups[index].total = 1;
            return;
        }

        // 依照開始時間排序群組中的事件
        const sortedIndices = component.sort((a, b) => {
            // 先按開始時間排序
            const startA = moment(groups[a].startTime, 'HH:mm');
            const startB = moment(groups[b].startTime, 'HH:mm');
            const startDiff = startA.diff(startB);

            if (startDiff !== 0) return startDiff;

            // 如果開始時間相同，按持續時間長短排序
            const endA = moment(groups[a].endTime, 'HH:mm');
            const endB = moment(groups[b].endTime, 'HH:mm');
            const durationA = endA.diff(startA);
            const durationB = endB.diff(startB);

            return durationB - durationA; // 先放較長的事件
        });

        // 只考慮該組件中的事件重疊
        const componentGraph = {};
        sortedIndices.forEach(index => {
            componentGraph[index] = overlapGraph[index].filter(neighbor =>
                component.includes(neighbor)
            );
        });

        // 為該組件中的事件分配位置
        const positions = {};
        const usedPositions = {};

        sortedIndices.forEach(index => {
            // 查找已經分配給鄰居的位置
            const unavailablePositions = new Set();
            componentGraph[index].forEach(neighbor => {
                if (positions[neighbor] !== undefined) {
                    unavailablePositions.add(positions[neighbor]);
                }
            });

            // 從左到右查找可用的位置
            let position = 0;
            while (unavailablePositions.has(position)) {
                position++;
            }

            positions[index] = position;
            usedPositions[position] = true;
        });

        // 計算最大所需的位置數
        const totalPositions = Object.keys(usedPositions).length;

        // 更新每個分組的位置訊息
        sortedIndices.forEach(index => {
            groups[index].position = positions[index];
            groups[index].total = totalPositions;
        });
    });
}

/**
 * 找出圖中的所有連接組件
 * @param {Object} graph
 * @return {Array} - 連接組件的陣列
 */
function findConnectedComponents(graph) {
    const visited = {};
    const components = [];

    Object.keys(graph).forEach(node => {
        if (!visited[node]) {
            const component = [];
            dfs(graph, node, visited, component);
            components.push(component);
        }
    });

    return components;
}

/**
 * 深度優先搜索遍歷圖
 * @param {Object} graph - 圖的鄰接表
 * @param {string} node - 當前節點
 * @param {Object} visited - 已訪問節點的紀錄
 * @param {Array} component - 當前連接組件
 */
function dfs(graph, node, visited, component) {
    visited[node] = true;
    component.push(parseInt(node));

    graph[node].forEach(neighbor => {
        if (!visited[neighbor]) {
            dfs(graph, neighbor.toString(), visited, component);
        }
    });
}

/**
 * 將分組按小時進行組織
 * @param {Array} groups - 事件分組
 * @param {Object} dayData - 某天的資料
 * @param {string} date - 日期
 */
function organizeGroupsByHour(groups, dayData, date) {
    // 初始化小時欄位
    const hourSlots = {};
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        hourSlots[hour] = [];
    }

    // 將分組分配到相應的小時欄位
    groups.forEach(group => {
        const startHour = group.startTime.split(':')[0];
        hourSlots[startHour].push(group);
    });

    dayData.hourSlots = hourSlots;
}

/**
 * 獲取特定小時的分組
 * @param {Object} organizedTodos - 組織後的待辦事項
 * @param {string} date - 日期
 * @param {string} hour - 小時（格式：HH）
 * @return {Array} - 該小時的分組
 */
export function getGroupsInHour(organizedTodos, date, hour) {
    if (!organizedTodos || !organizedTodos[date] || !organizedTodos[date].hourSlots[hour]) {
        return [];
    }

    return organizedTodos[date].hourSlots[hour];
}

/**
 * 獲取特定時間點的分組
 * @param {Object} organizedTodos - 組織後的待辦事項
 * @param {string} date - 日期
 * @param {string} timeSlot - 時間段（格式：HH:mm）
 * @return {Array} - 該時間點的分組
 */
export function getTimeRangeGroupsAtTime(organizedTodos, date, timeSlot) {
    if (!organizedTodos || !organizedTodos[date]) return [];

    const hour = timeSlot.split(':')[0];
    return getGroupsInHour(organizedTodos, date, hour);
}