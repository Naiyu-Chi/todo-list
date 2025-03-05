export default function useTimeCalculations() {
  /**
   * 將時間字串轉換為分鐘數
   * @param timeStr - 格式為 HH:MM 的時間字串
   */
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  /**
   * 將分鐘數轉換為時間字串
   * @param minutes - 分鐘數
   */
  const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  /**
   * 計算項目時長（小時）
   * @param startTime - 開始時間 (HH:MM)
   * @param endTime - 結束時間 (HH:MM)
   */
  const getEventDurationInHours = (
    startTime: string,
    endTime: string
  ): number => {
    if (!startTime || !endTime) return 1;

    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);

    return (endMinutes - startMinutes) / 60;
  };

  /**
   * 計算時間偏移百分比
   * @param startTime - 開始時間 (HH:MM)
   */
  const getStartTimeOffset = (startTime: string): number => {
    if (!startTime) return 0;

    const [_, startMinute] = startTime.split(":").map(Number);

    return (startMinute / 60) * 100;
  };

  /**
   * 設定預設結束時間（開始時間後一小時）
   * @param startTime - 開始時間 (HH:MM)
   */
  const getDefaultEndTime = (startTime: string): string => {
    const [startHourStr, startMinStr] = startTime.split(":");
    let startHour = parseInt(startHourStr);
    let startMinute = parseInt(startMinStr || "0");

    const startDate = new Date();
    startDate.setHours(startHour);
    startDate.setMinutes(startMinute);

    const endHour = startDate.getHours() + 1;
    const endMinutes = startDate.getMinutes();

    return `${String(endHour).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  /**
   * 獲取目前時間（四捨五入到最近的30分鐘）
   */
  const getCurrentRoundedTime = (): string => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;

    now.setMinutes(roundedMinutes);

    const hours = now.getHours();
    const minutesStr = String(now.getMinutes()).padStart(2, "0");

    return `${String(hours).padStart(2, "0")}:${minutesStr}`;
  };

  /**
   * 檢查兩個時間範圍是否重疊
   */
  const timeRangesOverlap = (
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ): boolean => {
    const startAMinutes = parseTimeToMinutes(startA);
    const endAMinutes = parseTimeToMinutes(endA);
    const startBMinutes = parseTimeToMinutes(startB);
    const endBMinutes = parseTimeToMinutes(endB);

    return startAMinutes < endBMinutes && endAMinutes > startBMinutes;
  };

  return {
    parseTimeToMinutes,
    formatMinutesToTime,
    getEventDurationInHours,
    getStartTimeOffset,
    getDefaultEndTime,
    getCurrentRoundedTime,
    timeRangesOverlap,
  };
}
