import React, { useContext } from "react";
import moment from "moment";
import { Badge } from "react-bootstrap";
import { CalendarContext } from "../context/CalendarContext";
import { MeetingContext } from "../context/MeetingContext";

const Cells = () => {
    const { currentDate, selectedDate, currentUser, setSelectedDate } = useContext(CalendarContext);
    const { meetings, setShowMeetingForm } = useContext(MeetingContext);
    const monthStart = moment(currentDate).startOf("month");
    const monthEnd = moment(currentDate).endOf("month");
    const startDate = moment(monthStart).startOf("week");
    const endDate = moment(monthEnd).endOf("week");
    const dateFormat = "D";

    const handleCellClick = (date, e) => {
        setSelectedDate(date);
        setShowMeetingForm(true);
    };

    let days = [];
    let day = startDate;
    while (day < endDate) {
        /* eslint-disable no-loop-func */
        //TODO: Improve on this logic
        days.push(
            <div
                className={`cell ${
                    !moment(day).isSame(monthStart, "month")
                        ? "disabled"
                        : moment(day).isSame(currentDate, "day")
                        ? "current"
                        : moment(day).isSame(selectedDate, "day")
                        ? "selected"
                        : ""
                }`}
                onClick={handleCellClick.bind(this, moment(day).toDate())}
                key={day}
            >
                {moment(day).format(dateFormat)}
                {meetings.map((meeting) => {
                    // If currentUsers is invited in the meeting then show that in calendar
                    const isMeetingSheduledForUser = meeting.invites.includes(currentUser);
                    // If the user is slected user and the cell representing current day has event

                    if ((meeting.userId === currentUser || isMeetingSheduledForUser) && moment(day).isSame(meeting.startTime, "day")) {
                        return (
                            <div key={meeting.id} onClick={(e) => e.stopPropagation()} className="event-badge">
                                <Badge variant="info">{`${moment(meeting.startDate).format("hh:mm A")} - ${meeting.subject}`}</Badge>
                            </div>
                        );
                    }
                    return;
                })}
            </div>
        );
        day = moment(day).add(1, "days");
        /* eslint-enable no-loop-func */
    }

    return <div className="days-grid">{days}</div>;
};

export default Cells;
