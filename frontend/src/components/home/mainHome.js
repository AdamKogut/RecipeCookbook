import React, { Component } from "react";
import axios from "axios";
import "./mainHome.css";
import { connect } from "react-redux";

import BodyContainer from "../BodyContainer/BodyContainer";
import RecipeCard from "../RecipeCard/RecipeCard";
import Loader from "../Loader/Loader";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import RecipeModal from "../RecipeModal/RecipeModal";
import AdvancedSearch from "../AdvancedSearch/AdvancedSearch";

class mainHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedRecipe: null,
      results: null,
      searchBarValue: "",
      isLoadingSearch: false,
      searchType: "default",
      advancedSearch: {},
      eingre: false
    };
  }

  search = () => {
    const searchValue = this.state.searchBarValue;
    if (this.state.searchType === "random") {
      this.setState({
        searchType: "default"
      });
    }

    // Empty search base case
    if (searchValue === "") {
      this.clearResults();

      return;
    }

    // Render the loader while we wait for results
    this.setState({
      isLoadingSearch: true
    });

    let query = {
      query: searchValue,
      number: "16",
      instructionsRequired: true
    };

    if (this.state.searchType === "advanced") {
      query = {
        ...query,
        ...this.state.advancedSearch,
        includedIngredients: null,
        excludedIngredients: null
      };

      if (
        this.state.advancedSearch.includedIngredients != undefined &&
        this.state.advancedSearch.includedIngredients.selectedItem.length
      ) {
        let array = this.state.advancedSearch.includedIngredients.selectedItem;
        let string = "";

        for (let i = 0; i < array.length; i++) {
          string += array[i];
          if (i + 1 < array.length) string += ",";
        }

        query.includeIngredients = string;
      }

      if (
        this.state.advancedSearch.excludedIngredients != undefined &&
        this.state.advancedSearch.excludedIngredients.selectedItem.length
      ) {
        let array = this.state.advancedSearch.excludedIngredients.selectedItem;
        let string = "";

        for (let i = 0; i < array.length; i++) {
          string += array[i];
          if (i + 1 < array.length) string += ",";
        }

        query.excludeIngredients = string;
      }
    }

    // Set the results once we get them back from the server
    axios.post("http://localhost:8080/search", query).then(response => {
      if (this.state.searchType !== "random")
        this.setState({
          results: response.data.body.results,
          isLoadingSearch: false
        });
    });
  };

  excludeIngredients = () => {
    this.setState(
      {
        eingre: !this.state.eingre,
        searchType: !this.state.eingre ? "advanced" : "default"
      },
      () => {
        //TODO: fix diet stuff when added
        if (this.props.auth&&this.state.eingre) {
          let that = this;
          axios
            .get("http://localhost:8080/excludedIngredients", {
              headers: { googleId: that.props.auth }
            })
            .then(function(response) {
              // console.log(response.data);
              if (that.state.advancedSearch.excludedIngredients != undefined) {
                let e =
                  that.state.advancedSearch.excludedIngredients.selectedItem;
                for (let i in response.data.excludedIngredients) {
                  e.push(response.data.excludedIngredients[i]);
                }
                that.setState({
                  advancedSearch: {
                    ...that.state.advancedSearch,
                    excludedIngredients: { selectedItem: e },
                  }
                });
              } else if (response.data.excludedIngredients[0] != "") {
                that.setState({
                  advancedSearch: {
                    ...that.state.advancedSearch,
                    excludedIngredients: {
                      selectedItem: response.data.excludedIngredients
                    }
                  }
                });
              }
              if(that.state.advancedSearch.diet==undefined||that.state.advancedSearch.diet==""){
                that.setState({
                  advancedSearch:{
                    ...that.state.advancedSearch,
                    diet:response.data.diet,
                  }
                })
              }
            });
        }
      }
    );
  };

  componentDidMount = () => {
    this.randomSearch();
  };

  randomSearch = () => {
    this.setState({
      searchType: "random"
    });

    // Render the loader while we wait for results
    this.setState({
      isLoadingSearch: true
    });

    // Set the results once we get them back from the server
    axios
      .post("http://localhost:8080/randomsearch", {
        number: 16
      })
      .then(response => {

        if (this.state.searchType === "random") {
          this.setState({
            results: response.data.body.recipes,
            isLoadingSearch: false
          });
        }
      });
  };

  clearResults = () => {
    this.setState({
      results: null,
      isLoadingSearch: false
    });
  };

  onRecipeClick = id => {
    this.setState({
      displayedRecipe: id
    });
  };

  onModalClose = () => {
    this.setState({
      displayedRecipe: null
    });
  };

  render() {
    // Build out the Results list
    const cards = [];
    if (this.state.isLoadingSearch) {
      cards.push(
        <Grid item xs={12} key={0}>
          <Loader />
        </Grid>
      );
    } else if (this.state.results) {
      for (let i = 0; i < this.state.results.length; i++) {
        const recipe = this.state.results[i];

        cards.push(
          <Grid item xs={3} key={"Recipe" + i}>
            <RecipeCard
              title={recipe.title}
              image={recipe.image}
              id={recipe.id}
              onClick={this.onRecipeClick}
            />
          </Grid>
        );
      }
    }

    return (
      <div className="BigDivArea">
        <RecipeModal
          id={this.state.displayedRecipe}
          onClose={this.onModalClose}
          type="search"
        />

        <BodyContainer>
          <TextField
            id={"recipe-search-bar"}
            value={this.state.searchBarValue}
            label={"Search for a Recipe"}
            type={"search"}
            fullWidth
            onChange={event => {
              this.setState({
                searchBarValue: event.target.value
              });
            }}
            onKeyPress={e => {
              if (e.key === "Enter") {
                this.search();
              }
            }}
            inputProps={{
              style: {
                fontSize: 25
              }
            }}
          />

          <br />
          <br />

          <div id={"search-toolbar"}>
            <Button
              variant="contained"
              color={
                this.state.searchType === "random" ? "secondary" : "default"
              }
              onClick={() => {
                if (this.state.searchType !== "random") this.randomSearch();
                else this.setState({ searchType: "default" });
              }}
            >
              Random
            </Button>

            <Button
              variant="contained"
              color={
                this.state.searchType === "myIngredients"
                  ? "secondary"
                  : "default"
              }
              onClick={() => {
                if (this.state.searchType !== "myIngredients") {
                  this.setState({ searchType: "myIngredients" });
                  this.clearResults();
                } else {
                  this.setState({ searchType: "default" });
                }
              }}
            >
              Using my Ingredients
            </Button>

            <Button
              variant="contained"
              color={
                this.state.searchType === "advanced" ? "secondary" : "default"
              }
              onClick={() => {
                if (this.state.searchType !== "advanced") {
                  this.setState({ searchType: "advanced" });
                  this.clearResults();
                } else {
                  this.setState({ searchType: "default" });
                }
              }}
            >
              Advanced
            </Button>
            {this.props.auth
              ? <FormControlLabel
                  style={{ paddingLeft: "10px" }}
                  control={
                    <Switch
                      checked={this.state.eingre}
                      color="primary"
                      onChange={this.excludeIngredients}
                    />
                  }
                  label="Apply Saved Settings"
                />
              : <div />}
          </div>

          <AdvancedSearch
            expanded={this.state.searchType === "advanced"}
            onUpdate={state => {
              this.setState({
                advancedSearch: state
              });
            }}
          />

          <Grid id={"search-results"} container spacing={24}>
            {cards}
          </Grid>
        </BodyContainer>
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainHome);
