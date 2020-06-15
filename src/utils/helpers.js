import { USERS, MEETING_ROOM_NAMES } from "./constants";
import moment from "moment";

export const getUserById = (id) => {
    return USERS.find((user) => user.id === id);
};

export const getMeetingRoomById = (id) => {
    return MEETING_ROOM_NAMES.find((room) => room.id === id);
};

export const getMeetingsByMeetingRoom = (roomId, meetings) => {
    const roomMeetings = meetings.filter((meeting) => {
        return meeting.location === roomId;
    });
    return roomMeetings;
};

export const getMeetingsForUser = (userId, meetings) => {
    const usersMeetings = meetings.filter((meeting) => {
        return meeting.userId === userId || meeting.invites.includes(userId);
    });
    return usersMeetings;
};

export const isMeetingOverlapForUser = (userId, meetings, startTime, endTime) => {
    const usersMeetings = getMeetingsForUser(userId, meetings);
    let isMeetingOverlap = false;
    for (var i = 0; i < usersMeetings.length; i++) {
        let meeting = usersMeetings[i];
        // Check if date/time is overlapping (inclusive)
        if (
            moment(startTime).isBetween(meeting.startTime, meeting.endTime, undefined, "[)") ||
            moment(endTime).isBetween(meeting.startTime, meeting.endTime, undefined, "(]")
        ) {
            isMeetingOverlap = true;
            break;
        }
    }
    return isMeetingOverlap;
};

export const isMeetingRoomAvailable = (roomId, meetings, startTime, endTime) => {
    const meetingsInRoom = getMeetingsByMeetingRoom(roomId, meetings);
    let isRoomAvailable = true;
    for (var i = 0; i < meetingsInRoom.length; i++) {
        let meeting = meetingsInRoom[i];
        // Check if date/time is overlapping (inclusive)
        if (
            moment(startTime).isBetween(meeting.startTime, meeting.endTime, undefined, "[)") ||
            moment(endTime).isBetween(meeting.startTime, meeting.endTime, undefined, "(]")
        ) {
            isRoomAvailable = false;
            break;
        }
    }
    return isRoomAvailable;
};
