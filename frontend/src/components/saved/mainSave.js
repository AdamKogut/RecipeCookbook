import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import SavedSearch from "./SavedSearch";
import RecipeTiles from "./RecipeTiles";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./mainSave.css";
import Axios from "axios";
import RecipeModal from "../RecipeModal/RecipeModal";
import BodyContainer from "../BodyContainer/BodyContainer";
import filter from "fuzzaldrin";
import { connect } from "react-redux";

class mainSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownCards: [],
      allCards: [],
      id: null,
      names: [],
      info: []
    };
  }

  openRecipe = id => {
    this.setState({ id: id });
  };

  onClose = () => {
    this.setState({ id: null });
  };

  componentDidMount = () => {
    if (this.state.auth)
      this.updateList();
    else
      setTimeout(() => {
        this.updateList();
      }, 10);
  };

  updateList = () => {
    let that = this;

    Axios.get("http://localhost:8080/savedRecipes", {
      headers: { googleId: that.props.auth }
    }).then(function(response) {
      let tempCard = [];
      let tempName = [];
      if (response.data.length===0) {
        tempCard.push(<h3 style={{margin:'auto',paddingTop:'5vh'}} key={1}>Save some recipes to see them here!</h3>);
        that.setState({
          allCards: tempCard,
          shownCards: tempCard,
          names: tempName,
          id:null
        });
      } else {
        for (let i in response.data[0].recipes) {
          tempCard.push(
            <Grid item xs={3} key={i}>
              <RecipeCard
                title={response.data[0].recipes[i].title}
                image={response.data[0].recipes[i].image}
                id={response.data[0].recipes[i].id}
                onClick={() => that.openRecipe(response.data[0].recipes[i].id)}
              />
            </Grid>
          );
          tempName.push({ name: response.data[0].recipes[i].title, id: i });
        }
        that.setState({
          allCards: tempCard,
          shownCards: tempCard,
          names: tempName,
          info: response.data[0].recipes,
          id:null,
        });
      }
    });
  };

  searchSaved = searchKey => {
    let matched = filter(this.state.names, searchKey, { key: "name" });
    let tempCard = [];
    for (let i in matched) {
      tempCard.push(this.state.allCards[matched[i].id]);
    }
    this.setState({ shownCards: tempCard });
  };

  render() {
    return (
      <div className="BigDivArea">
        <BodyContainer>
          <div className="save-search-bar">
            <SavedSearch {...this.state} searchSaved={this.searchSaved} />
          </div>
          <Grid id={"search-results"} container spacing={24}>
            {this.state.shownCards}
          </Grid>
          <RecipeModal
            {...this.state}
            onClose={this.onClose}
            type="saved"
            updateSavedList={this.updateList}
          />
        </BodyContainer>
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainSave);
