import React, { Component } from "react";
import { Card, CardHeader, CardMedia } from "@material-ui/core";
import SavedSearch from "./SavedSearch";
import RecipeTiles from "./RecipeTiles";
import "./mainSave.css";
import Axios from "axios";
import RecipeModal from "../RecipeModal/RecipeModal";

class mainSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      id:null,
    };
  }

  openRecipe=(id)=>{
    this.setState({id:id})
  }

  onClose=()=>{
    this.setState({id:null});
  }

  componentDidMount = () => {
    let that=this;
    Axios.post("/GET-SAVED", {}).then(function(response) {
      let tempCard = [];
      for (let i in response.data) {
        tempCard.push(
          <Card onClick={()=>this.openRecipe(response.data[i].id)}>
            <CardHeader title={response.data[i].title} />
            <CardMedia
              image={response.data[i].image}
              title={response.data[i].title}
            />
          </Card>
        );
      }
      that.setState({cards:tempCard});
    });
  };

  render() {
    return (
      <div className="BigDivArea">
        <div className="save-search-bar">
          <SavedSearch {...this.state}/>
        </div>
        <div className="save-recipe-tile">
          <RecipeTiles {...this.state}/>
        </div>
        <RecipeModal {...this.state}/>
      </div>
    );
  }
}

export default mainSave;
