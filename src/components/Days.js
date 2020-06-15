import React from "react";
import moment from "moment";

const Days = () => {
    const weekdays = moment.weekdaysShort();
    const days = weekdays.map((weekday) => {
        return (
            <div key={weekday} className="weekday">
                {weekday}
            </div>
        );
    });
    return <div className="days-row">{days}</div>;
};

export default Days;
