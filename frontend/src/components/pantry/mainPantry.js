import React, { Component } from "react";
import BodyContainer from "../BodyContainer/BodyContainer";
import { Button, Paper } from "@material-ui/core";
import AddItemModal from "./AddItemModal";
import {connect} from 'react-redux';
import "./mainPantry.css";
import Axios from "axios";
import EditItemModal from "./EditItemModal";

class mainPantry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      items: [],
      current:null,
      editModal:false
    };
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  edit=(item)=>{
    this.setState({current:item,editModal:true})
  }

  closeEdit=()=>{
    this.setState({editModal:false})
  }

  remove=(item)=>{
    let that=this;
    Axios.post("http://localhost:8080/removePantry",{
      googleId:that.props.auth,
      item:item
    }).then(response=>{
      alert(item.ingredient+' was removed')
    })
  }

  componentDidMount = () => {
    //todo: fix this when routes are in place
    let that = this;
    Axios.get("http://localhost:8080/pantry", {
      headers: { googleId: that.props.auth }
    }).then(response => {
      let e = [];
      for (let i in response.data.pantry) {
        e.push(
          <Paper elevation={1} key={i}>
            {`${response.data.pantry[i].amt} ${response.data.pantry[i]
              .amtUnit} ${response.data.pantry[i].ingredient} ${response.data
              .pantry[i].date != "none"
              ? "Best By: " + response.data.pantry[i].date
              : null}`}
            <Button onClick={()=>that.edit(response.data.pantry[i])}>Edit</Button>
            <Button onClick={()=>that.remove(response.data.pantry[i])}>Remove</Button>
          </Paper>
        );
      }
    });
  };

  render() {
    return (
      <div className="BigDivArea">
        <AddItemModal {...this.state} closeModal={this.closeModal} />
        <BodyContainer>
          <Button onClick={() => this.setState({ modal: true })}>
            Add Item
          </Button>
        </BodyContainer>
        <EditItemModal current={this.state.current} editModal={this.state.editModal} closeEdit={this.closeEdit}/>
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainPantry);
