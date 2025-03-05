import { ref, computed } from "vue";

import type { CalendarDay } from "@/types";

export default function useCalendar() {
  const currentDate = ref(new Date());
  const selectedDate = ref(new Date().toISOString().split("T")[0]); // 格式: YYYY-MM-DD

  // 表格時間區段 (00:00 - 23:00)
  const timePeriods = computed(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0");
      return `${hour}:00`;
    });
  });

  // 根據當前日期計算星期
  const weekDays = computed(() => {
    const date = new Date(currentDate.value);
    const day = date.getDay();

    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() - day);

    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStartDate);
      currentDay.setDate(weekStartDate.getDate() + i);

      const formattedDate = currentDay.toISOString().split("T")[0];

      days.push({
        date: currentDay,
        formattedDate,
        dayName: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
          currentDay
        ),
        dayNumber: currentDay.getDate(),
        isToday: isToday(currentDay),
        isSelected: formattedDate === selectedDate.value,
      });
    }
    return days;
  });

  // 確認日期是否為今天
  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // 週的開始日期 (00:00:00)
  const weekStart = computed(() => {
    const firstDay = new Date(weekDays.value[0].date);
    firstDay.setHours(0, 0, 0, 0);
    return firstDay;
  });

  // 週的結束日期 (23:59:59)
  const weekEnd = computed(() => {
    const lastDay = new Date(weekDays.value[6].date);
    lastDay.setHours(23, 59, 59, 999);
    return lastDay;
  });

  // 判斷是否是當前週
  const isCurrentWeek = computed(() => {
    const today = new Date();
    return today >= weekStart.value && today <= weekEnd.value;
  });

  // 格式化的週日期範圍 (MM/DD - MM/DD)
  const weekRangeText = computed(() => {
    const start = weekStart.value;
    const end = weekEnd.value;
    const startMonth = String(start.getMonth() + 1).padStart(2, "0");
    const startDay = String(start.getDate()).padStart(2, "0");
    const endMonth = String(end.getMonth() + 1).padStart(2, "0");
    const endDay = String(end.getDate()).padStart(2, "0");
    return `${startMonth}/${startDay} - ${endMonth}/${endDay}`;
  });

  /**
   * 格式化日期為 MM/DD [Weekday]
   * @param date - 
   */
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    const weekday = weekdays[dateObj.getDay()];
    return `${month}/${day} ${weekday}`;
  };

  // 返回今天
  function goToToday(): void {
    currentDate.value = new Date();
    selectedDate.value = new Date().toISOString().split("T")[0];
  }

  // 往前一週
  function goToPreviousWeek(): void {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() - 7);
    currentDate.value = date;
    selectedDate.value = new Date(date).toISOString().split("T")[0];
  }

  // 往後一週
  function goToNextWeek(): void {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() + 7);
    currentDate.value = date;
    selectedDate.value = new Date(date).toISOString().split("T")[0];
  }

  // 設置選擇的日期
  function selectDate(formattedDate: string): void {
    selectedDate.value = formattedDate;
  }

  // 取得月份和年份
  const currentMonthYear = computed(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(currentDate.value);
  });

  return {
    currentDate,
    selectedDate,
    weekDays,
    timePeriods,
    currentMonthYear,
    weekStart,
    weekEnd,
    isCurrentWeek,
    weekRangeText,
    formatDate,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    selectDate,
    isToday,
  };
}
