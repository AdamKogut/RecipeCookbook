import React, { Component } from "react";
import { connect } from "react-redux";
import Calendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import RecipeModal from "../RecipeModal/RecipeModal";
import moment from "moment";
import "./mainPlanning.css";
import Axios from "axios";

const localizer = Calendar.momentLocalizer(moment);

class mainPlanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      id: null,
      date: null,
      meal: null
    };
  }

  onClose = () => {
    this.setState({ id: null, meal: null, date: null },this.componentDidMount);
  };

  click = event => {
    this.setState({ id: event.id, date: event.start, meal: event.meal });
  };

  componentDidMount = () => {
    let that = this;
    setTimeout(() => {
      Axios.get("http://localhost:8080/meal/month", {
        headers: {
          googleId: that.props.auth,
          udate: `${new Date().getMonth() + 1}/1/${new Date().getFullYear()}`
        }
      }).then(response => {
        let k = [];
        for (let i in response.data.mealPlans) {
          for (let date in response.data.mealPlans[i]) {
            for (let meal in response.data.mealPlans[i][date]) {
              for (let recipe in response.data.mealPlans[i][date][meal]) {
                k.push({
                  start: date,
                  end: date,
                  id: response.data.mealPlans[i][date][meal][recipe].recipeId,
                  title: response.data.mealPlans[i][date][meal][recipe].recipeName,
                  meal: response.data.mealPlans[i][date][meal][recipe].meal
                });
              }
            }
          }
        }
        that.setState({ events: k });
      });
    }, 20);
  };

  changeMonth = event1 => {
    let that = this;
    Axios.get("http://localhost:8080/meal/month", {
      headers: {
        googleId: that.props.auth,
        udate: `${event1.getMonth() + 1}/1/${event1.getFullYear()}`
      }
    }).then(response => {
      let k = [];
        for (let i in response.data.mealPlans) {
          for (let date in response.data.mealPlans[i]) {
            for (let meal in response.data.mealPlans[i][date]) {
              for (let recipe in response.data.mealPlans[i][date][meal]) {
                k.push({
                  start: date,
                  end: date,
                  id: response.data.mealPlans[i][date][meal][recipe].recipeId,
                  title: response.data.mealPlans[i][date][meal][recipe].recipeName
                });
              }
            }
          }
        }
        that.setState({ events: k });
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
          views={{ month: true }}
          onNavigate={this.changeMonth}
        />

        <RecipeModal
          date={this.state.date}
          id={this.state.id}
          meal={this.state.meal}
          onClose={this.onClose}
          type="Planning"
          updateSavedList={this.updateList}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainPlanning);
