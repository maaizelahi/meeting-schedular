import React, { useContext } from "react";
import moment from "moment";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { CalendarContext } from "../context/CalendarContext";
import { MeetingContext } from "../context/MeetingContext";
import { USERS } from "../utils/constants";

const Header = () => {
    const { currentDate, setCurrentDate, currentUser, setCurrentUser } = useContext(CalendarContext);
    const { setShowMeetingForm } = useContext(MeetingContext);

    const dateFormat = "MMMM YYYY";
    const nextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, "month"));
    };

    const previousMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, "month"));
    };

    const nextYear = () => {
        setCurrentDate(moment(currentDate).add(1, "year"));
    };

    const previousYear = () => {
        setCurrentDate(moment(currentDate).subtract(1, "year"));
    };

    const setToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="header">
            <div>
                <ButtonGroup aria-label="Basic example" className="prev-next">
                    <Button variant="outline-info" onClick={previousYear}>
                        <FaAngleDoubleLeft />
                    </Button>
                    <Button variant="outline-info" onClick={previousMonth}>
                        <FaAngleLeft />
                    </Button>
                    <Button variant="outline-info" onClick={setToToday} size="sm">
                        Today
                    </Button>
                    <Button variant="outline-info" onClick={nextMonth}>
                        <FaAngleRight />
                    </Button>
                    <Button variant="outline-info" onClick={nextYear}>
                        <FaAngleDoubleRight />
                    </Button>
                </ButtonGroup>

                <Button className="shedule-meeting-btn" variant="info" onClick={() => setShowMeetingForm(true)}>
                    Shedule Meeting
                </Button>
            </div>

            <div className="month-heading">{moment(currentDate).format(dateFormat)}</div>

            <Form inline className="calendar-user-form">
                <Form.Label>Calendar User:</Form.Label>
                <Form.Control
                    className="calendar-user-select"
                    as="select"
                    id="calendar-user"
                    size="sm"
                    defaultValue={currentUser}
                    onChange={(e) => setCurrentUser(e.target.value)}
                >
                    {USERS.map((user) => {
                        return <option key={user.id} value={user.id}>{`${user.name} <${user.email}>`}</option>;
                    })}
                </Form.Control>
            </Form>
        </div>
    );
};

export default Header;
