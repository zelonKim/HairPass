import { CalendarDay } from "../../hooks/booking/CalendarDay";

export interface DateModalProps {
  visible: boolean;
  onClose: () => void;
  isCurrentMonth: boolean;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  currentYear: number;
  currentMonth: number;
  calendarDays: (CalendarDay | null)[];
  bookingDate: string;
  onSelectDate: (dateString: string) => void;
}
