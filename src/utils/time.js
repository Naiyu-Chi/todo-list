import moment from 'moment';

/**
 * 將待辦事項組織為按日期和時間排列的結構
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
        // 先將事件按開始時間排序，對於相同開始時間的事件，按持續時間長短排序（較長的先）
        byDate[date].events.sort((a, b) => {
            const aStart = moment(`${date} ${a.startTime}`, 'YYYY-MM-DD HH:mm');
            const bStart = moment(`${date} ${b.startTime}`, 'YYYY-MM-DD HH:mm');
            const startDiff = aStart.diff(bStart);

            if (startDiff !== 0) return startDiff;

            // 如果開始時間相同，按持續時間長短排序（較長的先）
            const aEnd = moment(`${date} ${a.endTime}`, 'YYYY-MM-DD HH:mm');
            const bEnd = moment(`${date} ${b.endTime}`, 'YYYY-MM-DD HH:mm');
            const aDuration = aEnd.diff(aStart);
            const bDuration = bEnd.diff(bStart);

            return bDuration - aDuration; // 先放較長的事件
        });

        // 計算每個事件的重疊情況並分配位置
        const eventsWithPosition = googleCalendarLayout(byDate[date].events, date);
        byDate[date].events = eventsWithPosition;

        // 將事件按小時進行組織，以便於在日曆視圖中使用
        organizeEventsByHour(eventsWithPosition, byDate[date]);
    });

    return byDate;
}

/**
 * Google Calendar 風格的事件佈局算法
 * @param {Array} events - 事件列表
 * @param {string} date - 日期
 * @return {Array} - 添加了位置信息的事件列表
 */
function googleCalendarLayout(events, date) {
    if (events.length <= 1) {
        return events.map(event => ({
            ...event,
            position: 0,
            total: 1
        }));
    }

    // 標記事件的持續時間和位置
    const eventsWithMeta = events.map(event => {
        const startTime = moment(`${date} ${event.startTime}`, 'YYYY-MM-DD HH:mm');
        const endTime = moment(`${date} ${event.endTime}`, 'YYYY-MM-DD HH:mm');
        return {
            ...event,
            duration: endTime.diff(startTime, 'minutes'),
            startMoment: startTime,
            endMoment: endTime,
            column: -1 
        };
    });

    // 按開始時間排序，同一時間的按持續時間長的先放置
    eventsWithMeta.sort((a, b) => {
        const startDiff = a.startMoment.diff(b.startMoment);
        if (startDiff !== 0) return startDiff;
        return b.duration - a.duration;
    });

    // 計算事件的重疊組
    const overlapGroups = [];
    for (let i = 0; i < eventsWithMeta.length; i++) {
        const event = eventsWithMeta[i];
        let foundGroup = false;

        // 查看現有組是否有重疊
        for (let j = 0; j < overlapGroups.length; j++) {
            const group = overlapGroups[j];
            let hasOverlap = false;

            // 檢查事件與組中的任何事件是否重疊
            for (const groupEvent of group) {
                if (event.startMoment.isBefore(groupEvent.endMoment) && 
                    event.endMoment.isAfter(groupEvent.startMoment)) {
                    hasOverlap = true;
                    break;
                }
            }

            // 如果沒有重疊，將事件添加到此組
            if (!hasOverlap) {
                group.push(event);
                foundGroup = true;
                break;
            }
        }

        // 如果沒有找到合適的組，創建新組
        if (!foundGroup) {
            overlapGroups.push([event]);
        }
    }

    // 計算每個組內的列分配
    overlapGroups.forEach(group => {
        // 按開始時間排序
        group.sort((a, b) => a.startMoment.diff(b.startMoment));
        
        let maxColumn = 0;
        for (const event of group) {
            let column = 0;
            while (true) {
                // 檢查此列是否已被占用
                let columnAvailable = true;
                for (const otherEvent of group) {
                    if (otherEvent.column === column && 
                        event.startMoment.isBefore(otherEvent.endMoment) && 
                        event.endMoment.isAfter(otherEvent.startMoment)) {
                        columnAvailable = false;
                        break;
                    }
                }
                
                if (columnAvailable) {
                    event.column = column;
                    maxColumn = Math.max(maxColumn, column);
                    break;
                }
                column++;
            }
        }
        
        // 設置總列數
        const totalColumns = maxColumn + 1;
        group.forEach(event => {
            event.totalColumns = totalColumns;
        });
    });

    // 將所有分組的事件平整化為一個數組
    const flatEvents = [];
    overlapGroups.forEach(group => {
        group.forEach(event => {
            flatEvents.push({
                ...event,
                position: event.column,
                total: event.totalColumns
            });
        });
    });

    return flatEvents;
}

/**
 * 將事件按小時組織
 * @param {Array} events - 事件列表
 * @param {Object} dayData - 日數據
 */
function organizeEventsByHour(events, dayData) {
    // 初始化小時槽
    const hourSlots = {};
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        hourSlots[hour] = [];
    }
    
    // 將每個事件添加到對應的小時槽
    events.forEach(event => {
        const startHour = event.startTime.split(':')[0];
        hourSlots[startHour].push({
            ...event,
            events: [event] // 保持兼容性，但每個"組"現在只包含一個事件
        });
    });
    
    dayData.hourSlots = hourSlots;
}

/**
 * 獲取特定小時的事件
 * @param {Object} organizedTodos - 組織後的待辦事項
 * @param {string} date - 日期
 * @param {string} hour - 小時
 * @return {Array} - 該小時的事件
 */
export function getGroupsInHour(organizedTodos, date, hour) {
    if (!organizedTodos || !organizedTodos[date] || !organizedTodos[date].hourSlots[hour]) {
        return [];
    }
    
    return organizedTodos[date].hourSlots[hour];
}

/**
 * 獲取特定時間點的事件
 * @param {Object} organizedTodos - 組織後的待辦事項
 * @param {string} date - 日期
 * @param {string} timeSlot - 時間段
 * @return {Array} - 該時間點的事件
 */
export function getTimeRangeGroupsAtTime(organizedTodos, date, timeSlot) {
    if (!organizedTodos || !organizedTodos[date]) return [];
    
    const hour = timeSlot.split(':')[0];
    return getGroupsInHour(organizedTodos, date, hour);
}