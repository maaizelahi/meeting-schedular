import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Calendar from "./components/Calendar";
import MeetingContextProvider from "./context/MeetingContext";
import CalendarContextProvider from "./context/CalendarContext";

function App() {
    return (
        <div className="App">
            <CalendarContextProvider>
                <MeetingContextProvider>
                    <Calendar />
                </MeetingContextProvider>
            </CalendarContextProvider>
        </div>
    );
}

export default App;
