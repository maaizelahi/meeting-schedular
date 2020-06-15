import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import * as yup from "yup";
import { Modal, Button, Form, Col, Alert } from "react-bootstrap";
import { FaCaretRight } from "react-icons/fa";
import { Formik } from "formik";
import { MeetingContext } from "../context/MeetingContext";
import { USERS, MEETING_ROOM_NAMES } from "../utils/constants";
import { CalendarContext } from "../context/CalendarContext";
import { getTimeInNearest30Min, getNext30Min } from "../utils/date";
import { isMeetingOverlapForUser, isMeetingRoomAvailable, getUserById, getMeetingRoomById } from "../utils/helpers";

const NewMeetingForm = () => {
    const { currentDate, selectedDate, currentUser } = useContext(CalendarContext);
    const { meetings, dispatch, showMeetingForm, setShowMeetingForm } = useContext(MeetingContext);
    // Considering initial values as state considering edit flow
    const [initialValues, setInitialValues] = useState({
        invites: ["2"],
        subject: "",
        location: "1",
        duration: 30,
        startDate: moment(selectedDate).format("MM/DD/YYYY"),
        startTime: moment(selectedDate).format("hh:mm a"),
        endDate: moment(selectedDate).format("MM/DD/YYYY"),
        endTime: getNext30Min(selectedDate)
    });
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [errorAlerts, setErrorAlerts] = useState([]);
    const [warningAlerts, setWarningAlerts] = useState([]);

    const schema = yup.object().shape({
        invites: yup.array().required(),
        subject: yup.string().required(),
        location: yup.string().required(),
        duration: yup.number().required().positive().integer(),
        startDate: yup.string().required(),
        endDate: yup.string().required(),
        startTime: yup.string().required(),
        endTime: yup.string().required()
    });

    const handleClose = () => setShowMeetingForm(false);

    const createFinalObject = (values) => {
        let meetingObj = {};
        //TODO: Apply logic to get correct user id
        meetingObj.userId = currentUser;
        // meetingObj.invites = values.invites.map((invite) => parseInt(invite));
        meetingObj.invites = values.invites;
        meetingObj.location = values.location;
        meetingObj.subject = values.subject;
        meetingObj.startTime = moment(`${values.startDate} ${values.startTime}`).toDate();
        meetingObj.endTime = moment(`${values.endDate} ${values.endTime}`).toDate();
        return meetingObj;
    };

    const saveMeeting = (values) => {
        let meeting = createFinalObject(values);
        dispatch({ type: "CREATE_MEETING", meeting });
        handleClose();
    };

    const handleInviteChange = (invitedUserId, values) => {
        let startTime = moment(`${values.startDate} ${values.startTime}`).toDate();
        let endTime = moment(`${values.endDate} ${values.endTime}`).toDate();
        const isMeetingOverlap = isMeetingOverlapForUser(invitedUserId, meetings, startTime, endTime);
        handleMeetingOverlapWarnings(getUserById(invitedUserId), isMeetingOverlap);
    };

    const handleRoomChange = (roomId, values) => {
        let startTime = moment(`${values.startDate} ${values.startTime}`).toDate();
        let endTime = moment(`${values.endDate} ${values.endTime}`).toDate();
        const isRoomAvailable = isMeetingRoomAvailable(roomId, meetings, startTime, endTime);
        handleMeetingRoomBusyErrors(getMeetingRoomById(roomId), isRoomAvailable);
    };

    const handleMeetingOverlapWarnings = (user, isUserBusy) => {
        let warningMsg = `${user.name} already has a meeting sheduled at the time selected`;
        if (isUserBusy) {
            if (!warningAlerts.includes(warningMsg)) {
                setWarningAlerts([...warningAlerts, warningMsg]);
            }
        } else {
            setWarningAlerts(warningAlerts.filter((warning) => warning !== warningMsg));
        }
    };

    const handleMeetingRoomBusyErrors = (room, isRoomAvailable) => {
        let errorgMsg = `${room.name} in not available for time selected`;
        if (!isRoomAvailable) {
            if (!errorAlerts.includes(errorgMsg)) {
                setErrorAlerts([...errorAlerts, errorgMsg]);
            }
            setDisableSubmit(true);
        } else {
            if (errorAlerts.length !== 0) {
                setErrorAlerts(errorAlerts.filter((error) => error !== errorgMsg));
            }
            if (errorAlerts.length === 0) setDisableSubmit(false);
        }
    };

    //checks wheter startTime is before endTime and accrordingly sets error msg
    const checkStartBeforeEnd = (startTime, endTime) => {
        if (startTime >= endTime) {
            if (!errorAlerts.includes("Start time should be before end time")) {
                setErrorAlerts([...errorAlerts, "Start time should be before end time"]);
            }
            setDisableSubmit(true);
        } else {
            setErrorAlerts(errorAlerts.filter((error) => error !== "Start time should be before end time"));
            if (errorAlerts.length === 0) setDisableSubmit(false);
        }
    };

    //For every change change evaluating ovelapping meeting for user and room availability
    const handleStartTimeChange = (time, values) => {
        let startTime = moment(`${values.startDate} ${time}`).toDate();
        let endTime = moment(`${values.endDate} ${values.endTime}`).toDate();

        checkStartBeforeEnd(startTime, endTime);
        values.invites.forEach((invite) => {
            let isMeetingOverlap = isMeetingOverlapForUser(invite, meetings, startTime, endTime);
            handleMeetingOverlapWarnings(getUserById(invite), isMeetingOverlap);
        });
        let isMeetingOverlap = isMeetingOverlapForUser(currentUser, meetings, startTime, endTime);
        handleMeetingOverlapWarnings(getUserById(currentUser), isMeetingOverlap);
        const isRoomAvailable = isMeetingRoomAvailable(values.location, meetings, startTime, endTime);
        handleMeetingRoomBusyErrors(getMeetingRoomById(values.location), isRoomAvailable);
    };

    //For every change change evaluating ovelapping meeting for user and room availability
    const handleEndTimeChange = (time, values) => {
        let startTime = moment(`${values.startDate} ${values.startTime}`).toDate();
        let endTime = moment(`${values.endDate} ${time}`).toDate();
        checkStartBeforeEnd(startTime, endTime);
        values.invites.forEach((invite) => {
            let isMeetingOverlap = isMeetingOverlapForUser(invite, meetings, startTime, endTime);
            handleMeetingOverlapWarnings(getUserById(invite), isMeetingOverlap);
        });
        let isMeetingOverlap = isMeetingOverlapForUser(currentUser, meetings, startTime, endTime);
        handleMeetingOverlapWarnings(getUserById(currentUser), isMeetingOverlap);
        const isRoomAvailable = isMeetingRoomAvailable(values.location, meetings, startTime, endTime);
        handleMeetingRoomBusyErrors(getMeetingRoomById(values.location), isRoomAvailable);
    };

    //For every change change evaluating ovelapping meeting for user and room availability
    const handleStartDateChange = (date, values) => {
        let startTime = moment(`${date} ${values.startTime}`).toDate();
        let endTime = moment(`${values.endDate} ${values.endTime}`).toDate();
        checkStartBeforeEnd(startTime, endTime);

        values.invites.forEach((invite) => {
            let isMeetingOverlap = isMeetingOverlapForUser(invite, meetings, startTime, endTime);
            handleMeetingOverlapWarnings(getUserById(invite), isMeetingOverlap);
        });
        let isMeetingOverlap = isMeetingOverlapForUser(currentUser, meetings, startTime, endTime);
        handleMeetingOverlapWarnings(getUserById(currentUser), isMeetingOverlap);
        const isRoomAvailable = isMeetingRoomAvailable(values.location, meetings, startTime, endTime);
        handleMeetingRoomBusyErrors(getMeetingRoomById(values.location), isRoomAvailable);
    };

    //For every change change evaluating ovelapping meeting for user and room availability
    const handleEndDateChange = (date, values) => {
        let startTime = moment(`${values.startDate} ${values.startTime}`).toDate();
        let endTime = moment(`${date} ${values.endTime}`).toDate();
        checkStartBeforeEnd(startTime, endTime);
        values.invites.forEach((invite) => {
            let isMeetingOverlap = isMeetingOverlapForUser(invite, meetings, startTime, endTime);
            handleMeetingOverlapWarnings(getUserById(invite), isMeetingOverlap);
        });
        let isMeetingOverlap = isMeetingOverlapForUser(currentUser, meetings, startTime, endTime);
        handleMeetingOverlapWarnings(getUserById(currentUser), isMeetingOverlap);
        const isRoomAvailable = isMeetingRoomAvailable(values.location, meetings, startTime, endTime);
        handleMeetingRoomBusyErrors(getMeetingRoomById(values.location), isRoomAvailable);
    };

    useEffect(() => {
        let date = moment(selectedDate);
        const startTime = getTimeInNearest30Min(currentDate);
        const endTime = getNext30Min(currentDate);
        setInitialValues({ ...initialValues, startDate: date.format("MM/DD/YYYY"), endDate: date.format("MM/DD/YYYY"), startTime, endTime });
    }, [selectedDate]);
    return (
        <>
            <Modal show={showMeetingForm} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Meeting Schedular</Modal.Title>
                </Modal.Header>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values) => {
                        saveMeeting(values);
                    }}
                    initialValues={initialValues}
                    in
                    enableReinitialize={true}
                >
                    {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors, resetForm }) => {
                        // console.log("Errors:", errors);
                        // console.log("Tocuhed:", touched);
                        // console.log("Values:", values);
                        return (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Modal.Body>
                                    <Form.Group controlId="subject">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={values.subject}
                                            onChange={handleChange}
                                            isInvalid={touched.subject && !!errors.subject}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="invites">
                                        <Form.Label>Select Invites</Form.Label>
                                        <Form.Control
                                            as="select"
                                            multiple
                                            name="invites"
                                            value={values.invites}
                                            onChange={(e) => {
                                                handleChange(e);
                                                handleInviteChange(e.target.value, values);
                                            }}
                                            isInvalid={touched.invites && !!errors.invites}
                                        >
                                            {USERS.map((user) => {
                                                if (user.id !== currentUser)
                                                    return <option key={user.id} value={user.id}>{`${user.name},${user.email}`}</option>;
                                            })}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{errors.invites}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="location">
                                        <Form.Label>Meeting Room</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="location"
                                            value={values.location}
                                            onChange={(e) => {
                                                handleChange(e);
                                                handleRoomChange(e.target.value, values);
                                            }}
                                            isInvalid={touched.location && !!errors.location}
                                        >
                                            {MEETING_ROOM_NAMES.map((meetingRoom) => {
                                                return <option key={meetingRoom.id} value={meetingRoom.id}>{`${meetingRoom.name}`}</option>;
                                            })}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Row>
                                        <Form.Group as={Col} md="6" controlId="startDate">
                                            <Form.Label>Starts</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MM/DD/YYYY"
                                                name="startDate"
                                                value={values.startDate}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleStartDateChange(e.target.value, values);
                                                }}
                                                isInvalid={touched.startDate && !!errors.startDate}
                                            />

                                            <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="3" controlId="startTime" className="time-input">
                                            <Form.Label></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="HH:MM"
                                                name="startTime"
                                                value={values.startTime}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleStartTimeChange(e.target.value, values);
                                                }}
                                                isInvalid={touched.startTime && !!errors.startTime}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.startTime}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="6" controlId="endDate">
                                            <Form.Label>Ends</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MM/DD/YYYY"
                                                name="endDate"
                                                value={values.endDate}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleEndDateChange(e.target.value, values);
                                                }}
                                                isInvalid={touched.endDate && !!errors.endDate}
                                            />

                                            <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="3" controlId="endTime" className="time-input">
                                            <Form.Label></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="HH:MM"
                                                name="endTime"
                                                value={values.endTime}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleEndTimeChange(e.target.value, values);
                                                }}
                                                isInvalid={touched.endTime && !!errors.endTime}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.endTime}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    {errorAlerts.length > 0 && (
                                        <Alert variant="danger">
                                            {errorAlerts.map((error) => {
                                                return (
                                                    <div>
                                                        <FaCaretRight />
                                                        {error}
                                                    </div>
                                                );
                                            })}
                                        </Alert>
                                    )}
                                    {warningAlerts.length > 0 && (
                                        <Alert variant="warning">
                                            {warningAlerts.map((warning) => {
                                                return (
                                                    <div>
                                                        <FaCaretRight />
                                                        {warning}
                                                    </div>
                                                );
                                            })}
                                        </Alert>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="info" type="submit" disabled={disableSubmit}>
                                        Schedule Meeting
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        </>
    );
};

export default NewMeetingForm;
