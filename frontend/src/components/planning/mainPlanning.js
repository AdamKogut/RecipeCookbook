import React, { Component } from "react";
import Calendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import RecipeModal from "../RecipeModal/RecipeModal";
import moment from "moment";
import "./mainPlanning.css";
import Axios from "axios";

const localizer = Calendar.momentLocalizer(moment);
//Fix this when route is implemented
class mainPlanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          start: new Date(),
          end: new Date(),
          title: "Chipotle Tomato Pepper Cheeseburger",
          id: 553935
        }
      ],
      id: null,
      date: null,
      meal: null
    };
  }

  onClose = () => {
    this.setState({ id: null });
  };

  click = event => {
    // console.log(event);
    this.setState({ id: event.id, date: event.date, meal: event.meal });
  };

  componentDidMount = () => {
    let that = this;
    Axios.get("http://localhost:8080/getMonthPlan", {
      headers: { googleId: that.props.auth }
    }).then(response => {
      that.setState({ events: response.data });
    });
  };

  render() {
    return (
      <div className="BigDivArea">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "calc(100vh - 48px)" }}
          onSelectEvent={this.click}
          resizable
        />
        <RecipeModal
          {...this.state}
          onClose={this.onClose}
          type="Planning"
          updateSavedList={this.updateList}
        />
      </div>
    );
  }
}

export default mainPlanning;
