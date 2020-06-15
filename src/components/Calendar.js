import React from "react";
import "./Calendar.css";
import Header from "./Header";
import Days from "./Days";
import Cells from "./Cells";
import NewMeetingForm from "./NewMeetingForm";

const Calendar = () => {
    return (
        <div className="calendar">
            <Header />
            <Days />
            <Cells />
            <NewMeetingForm />
        </div>
    );
};

export default Calendar;
