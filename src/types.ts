export interface CalendarDay {
    date: Date;
    formattedDate: string;
    dayName: string;
    dayNumber: number;
    isToday: boolean;
    isSelected: boolean;
}

export interface Form {
    name: string,
    date: string | null,
    startTime: string,
    endTime: string
}

export interface Todo extends Form {
    id: string;
    done: boolean;
}


