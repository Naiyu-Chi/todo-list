
import { ref, computed } from 'vue';

import type { CalendarDay } from '@/types'

export default function useCalendar() {

    const currentDate = ref(new Date());
    const selectedDate = ref(new Date().toISOString().split('T')[0]); // Format: YYYY-MM-DD

    // 表格時間區段 (00:00 - 23:00)
    const timePeriods = computed(() => {
        return Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, '0');
            return `${hour}:00`;
        });
    });

    // 根據當前日期計算星期
    const weekDays = computed(() => {
        const date = new Date(currentDate.value);
        const day = date.getDay();
        date.setDate(date.getDate() - day);

        const days: CalendarDay[] = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(date);
            currentDay.setDate(date.getDate() + i);

            const formattedDate = currentDay.toISOString().split('T')[0];

            days.push({
                date: currentDay,
                formattedDate,
                dayName: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDay),
                dayNumber: currentDay.getDate(),
                isToday: isToday(currentDay),
                isSelected: formattedDate === selectedDate.value
            });
        }
        return days;
    });

    // 確認日期是否為今天
    function isToday(date: Date): boolean {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    // 返回今天
    function goToToday(): void {
        currentDate.value = new Date();
        selectedDate.value = new Date().toISOString().split('T')[0];
    }

    // 往前一週
    function goToPreviousWeek(): void {
        const date = new Date(selectedDate.value);
        date.setDate(date.getDate() - 7);
        currentDate.value = date;
        selectedDate.value = new Date(date).toISOString().split('T')[0];
    }

    // 往後一週
    function goToNextWeek(): void {
        const date = new Date(selectedDate.value);
        date.setDate(date.getDate() + 7);
        currentDate.value = date;
        selectedDate.value = new Date(date).toISOString().split('T')[0];
    }

    // 設置選擇的日期
    function selectDate(formattedDate: string): void {
        selectedDate.value = formattedDate;
    }

    // 取得
    const currentMonthYear = computed(() => {
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate.value);
    });

    return {
        currentDate,
        selectedDate,
        weekDays,
        timePeriods,
        currentMonthYear,
        goToToday,
        goToPreviousWeek,
        goToNextWeek,
        selectDate,
        isToday
    };
}