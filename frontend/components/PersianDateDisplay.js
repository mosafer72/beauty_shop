// components/PersianDateDisplay.jsx
import { format, fromUnixTime } from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';

export default function PersianDateDisplay({ timestamp, showTime = true }) {
  // تبدیل timestamp به Date object
  const date = fromUnixTime(timestamp);
  
  // فرمت‌های مختلف
  const formats = {
    dateOnly: 'yyyy/MM/dd',          // 1403/09/15
    fullDate: 'yyyy MMMM dd',        // 1403 آذر 15
    withDay: 'EEEE yyyy/MM/dd',      // شنبه 1403/09/15
    dateTime: 'yyyy/MM/dd HH:mm',    // 1403/09/15 14:30
    fullDateTime: 'yyyy/MM/dd - HH:mm:ss' // 1403 آذر 15 - 14:30:45
  };
  
  return (
    <div dir="rtl" className="font-sans">
        <p>{format(date, formats.fullDateTime, { locale: faIR })}</p>
    </div>
  );
}