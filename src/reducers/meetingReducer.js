import { v4 as uuid } from "uuid";

export const meetingReducer = (state, action) => {
    switch (action.type) {
        case "GET_USERS":
            break;
        case "CREATE_MEETING":
            const { userId, invites, location, subject, startTime, endTime } = action.meeting;
            return [
                ...state,
                {
                    id: uuid(),
                    userId,
                    invites,
                    location,
                    subject,
                    startTime,
                    endTime
                }
            ];
        case "EDIT_MEETING":
            break;
        case "DELETE_MEETING":
            return state.filter((user) => {
                return user.id !== action.id;
            });
        default:
            return state;
    }
};

export default meetingReducer;
