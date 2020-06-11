import React, { Component } from "react";
import moment from "moment";
import AddEventModal from "./AddEventModal";
import WeekToolbar from "./WeekToolbar";
import WeekHeader from "./WeekHeader";
import TimeSlotGroup from "./TimeSlotGroup";
import EventHighlighter from "./EventHighlighter";
import { times, getAllDaysInTheWeek } from "../../utils";
import { container } from "../styles";

class WeekView extends Component {
  state = {
    startDate: +moment(),
    weekDays: getAllDaysInTheWeek(),
    showAddEventModal: false,
    eventStart: null,
    eventEnd: null,
  };

  // Sets next week days in the state

  goToNextWeek = () => {
    const dateAfter7Days = moment(this.state.startDate).add(7, "days");
    this.setState({
      startDate: +dateAfter7Days,
      weekDays: getAllDaysInTheWeek(dateAfter7Days),
    });
  };

  // Sets previous week days in the state
  goToPreviousWeek = () => {
    const dateBefore7Days = moment(this.state.startDate).subtract(7, "days");
    this.setState({
      startDate: +dateBefore7Days,
      weekDays: getAllDaysInTheWeek(dateBefore7Days),
    });
  };

  // Updates today's date in the view

  goToToday = () => {
    this.setState({
      startDate: +moment(),
      weekDays: getAllDaysInTheWeek(),
    });
  };

  // Opens the add event modal and initialize the date from the cell

  openAddEventModal = (dateStamp, time) => {
    const start = moment(dateStamp).set("hour", time);
    const end = start.clone().add(1, "hour");

    this.setState({
      showAddEventModal: true,
      eventStart: +start,
      eventEnd: +end,
    });
  };

  // Closes the add event modal

  onCloseAddEventModal = () => {
    this.setState({
      showAddEventModal: false,
    });
  };

  // Adds the new event and closes the add event modal

  onOkAddEventModal = (title) => {
    this.props.onNewEvent({
      title,
      start: this.state.eventStart,
      end: this.state.eventEnd,
    });
    this.setState({
      showAddEventModal: false,
    });
  };

  // Saves the timeStamps of the new event in the state

  onCurrentEventTimeChange = (dates) => {
    this.setState({
      eventStart: +dates[0],
      eventEnd: +dates[1],
    });
  };

  render() {
    const {
      weekDays,
      showAddEventModal,
      eventStart,
      eventEnd,
      startDate,
    } = this.state;
    const { events } = this.props;
    return (
      <div style={container}>
        <AddEventModal
          visible={showAddEventModal}
          onCancel={this.onCloseAddEventModal}
          onClose={this.onCloseAddEventModal}
          onOk={this.onOkAddEventModal}
          eventStart={eventStart}
          eventEnd={eventEnd}
          onTimeChange={this.onCurrentEventTimeChange}
        />

        <WeekToolbar
          goToPreviousWeek={this.goToPreviousWeek}
          goToNextWeek={this.goToNextWeek}
          startDate={startDate}
          goToToday={this.goToToday}
        />

        <WeekHeader weekDays={weekDays} />

        {times.map((time) => (
          <TimeSlotGroup
            key={time}
            time={time}
            weekDays={weekDays}
            events={events[time]}
            openAddEventModal={this.openAddEventModal}
          >
            {events[time] &&
              events[time].map(
                (event) =>
                  event.startWeek <= moment(startDate).week() &&
                  event.endWeek >= moment(startDate).week() && (
                    <EventHighlighter
                      onEventDelete={this.props.onEventDelete}
                      onEventUpdate={this.props.onEventUpdate}
                      key={event.title + event.end + event.start}
                      startDate={startDate}
                      event={event}
                    />
                  )
              )}
          </TimeSlotGroup>
        ))}
      </div>
    );
  }
}

export default WeekView;
