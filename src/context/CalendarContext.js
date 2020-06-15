import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarContextProvider = (props) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentUser, setCurrentUser] = useState("1");

    return (
        <CalendarContext.Provider value={{ currentDate, setCurrentDate, selectedDate, setSelectedDate, currentUser, setCurrentUser }}>
            {props.children}
        </CalendarContext.Provider>
    );
};

export default CalendarContextProvider;
