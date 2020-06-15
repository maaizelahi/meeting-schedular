import moment from "moment";

export const getTimeInNearest30Min = (date) => {
    const remainder = 30 - (moment(date).minute() % 30);

    const dateTime = moment(date).add(remainder, "minutes").format("h:mm a");
    return dateTime;
};

export const getNext30Min = (date) => {
    const remainder = 30 + (30 - (moment(date).minute() % 30));

    const dateTime = moment(date).add(remainder, "minutes").format("h:mm a");
    return dateTime;
};
