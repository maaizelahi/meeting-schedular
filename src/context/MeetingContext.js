import React, { createContext, useEffect, useReducer, useState } from "react";
import { meetingReducer } from "../reducers/meetingReducer";

export const MeetingContext = createContext();

// Context to keep track of Meeting Events/Schedules
const MeetingContextProvider = (props) => {
    const [meetings, dispatch] = useReducer(meetingReducer, [], () => {
        const localData = localStorage.getItem("meetings");
        return localData ? JSON.parse(localData) : [];
    });
    const [showMeetingForm, setShowMeetingForm] = useState(false);
    // Persisiting data by storing meetings to localStorage
    useEffect(() => {
        localStorage.setItem("meetings", JSON.stringify(meetings));
        console.log(meetings);
    });

    return <MeetingContext.Provider value={{ meetings, dispatch, showMeetingForm, setShowMeetingForm }}>{props.children}</MeetingContext.Provider>;
};

export default MeetingContextProvider;
