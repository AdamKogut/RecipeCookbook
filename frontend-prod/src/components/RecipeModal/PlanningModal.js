import React, { Component } from "react";
import { Modal, Typography, Paper, Select, MenuItem, Button } from "@material-ui/core";
import { DateFormatInput } from "material-ui-next-pickers";
import Axios from "axios";

class PlanningModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      date2: null,
      meal: "none"
    };
  }

  changeDate = date => {
    let date2 =
      "" +
      (date.getMonth() + 1) +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear();
    this.setState({ date: date, date2: date2 });
    // console.log(date2)
  };

  handleSubmit=()=>{
    if(this.state.date==null||this.state.meal=='none'){
      alert('Please fill out all forms')
      return;
    }
    //console.log(this.props)
    let that=this;
    Axios.post("https://nightin.xyz/meal",{
      googleId:that.props.auth,
      recipeId:that.props.recipe.id,
      recipeName:that.props.recipe.title,
      meal:that.state.meal,
      date:that.state.date2,
    }).then(response=>{
      if(response.data.success){
        that.handleClose();
      }else{
        alert('Something went wrong, please try again')
      }
    })
  }

  handleClose=()=>{
    this.setState({date:null,date2:null,meal:'none'},this.props.closeModal)
  }

  render() {
    return (
      <Modal open={this.props.modal} onClose={this.handleCloses}>
        <Paper
          style={{
            position: "absolute",
            top: "30%",
            left: "25%",
            width: "50%",
            padding: "30px"
          }}
        >
          <Typography variant="h6">Add to meal planning</Typography>
          <br />
          <DateFormatInput value={this.state.date} onChange={this.changeDate} />
          <br />
          <Select
            value={this.state.meal}
            onChange={event => this.setState({ meal: event.target.value })}
          >
            <MenuItem value='none'>Please choose meal</MenuItem>
            <MenuItem value="Breakfast">Breakfast</MenuItem>
            <MenuItem value="Lunch">Lunch</MenuItem>
            <MenuItem value="Dinner">Dinner</MenuItem>
          </Select>
          <br/>
          <br />
          <Button onClick={this.handleSubmit}>Submit</Button>
          <Button onClick={this.handleClose}>Close</Button>
        </Paper>
      </Modal>
    );
  }
}

export default PlanningModal;
