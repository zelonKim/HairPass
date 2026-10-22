export interface TimeModalProps {
  visible: boolean;
  onClose: () => void;
  bookingTime: string;
  onSelectTime: (time: string) => void;
}
