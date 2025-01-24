"use client";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
// import { calendarEvents } from "../../lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState ,useEffect } from "react";

const localizer = momentLocalizer(moment);
const calendarEvents = [
    {
      title: "Math",
      allDay: false,
      start: new Date(2024, 7, 12, 10, 0), // Aug 12, 2024, 10:00 AM
      end: new Date(2024, 7, 12, 10, 45),  // Aug 12, 2024, 10:45 AM
    },
    {
      title: "English",
      allDay: false,
      start: new Date(2024, 7, 13, 11, 0), // Aug 13, 2024, 11:00 AM
      end: new Date(2024, 7, 13, 11, 45),  // Aug 13, 2024, 11:45 AM
    },
    {
      title: "History",
      allDay: false,
      start: new Date(2024, 7, 14, 14, 0), // Aug 14, 2024, 2:00 PM
      end: new Date(2024, 7, 14, 14, 45),  // Aug 14, 2024, 2:45 PM
    },
  ];
const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const handleOnChangeView = (selectView: View) => {
    setView(selectView);
  };
   // Log events on component load
   useEffect(() => {
    console.log("Calendar Events:", calendarEvents);
  }, []);
  return (
    
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleOnChangeView}
        min={new Date(2025,1,0,7,0,0)}
        max={new Date(2025,1,0,17,0,0)}
      />

  );
};
export default BigCalendar;
