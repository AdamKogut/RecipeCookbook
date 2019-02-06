import React, { Component } from "react";
import "./mainHome.css";

import BodyContainer from '../BodyContainer/BodyContainer';
import RecipeCard from '../RecipeCard/RecipeCard';
import Loader from '../Loader/Loader';
import { Grid, TextField } from '@material-ui/core';
import RecipeModal from "../RecipeModal/RecipeModal";

class mainHome extends Component {

  constructor (props) {
    super(props);

    this.state = {
      displayedRecipe: null,
      results: null,
      searchBarValue: '',
      isLoadingSearch: false
    };
  }

  search = () => {
    const searchValue = this.state.searchBarValue;

    // Empty search base case
    if (searchValue === '') {
      this.setState({
        results: null,
        isLoadingSearch: false
      });

      return;
    }

    // **** Test code to simulate a search
    let results = [];

    for (let i = 0; i < 20; i++) {
      results.push({
        title: 'Hello World',
        image: 'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg',
        id: 'asdfqwert' + i
      });
    }

    // Render the loader while we wait for results
    this.setState({
      isLoadingSearch: true
    });

    // Set the TEST results once we get them back from the server
    setTimeout(() => {
      this.setState({
        results,
        isLoadingSearch: false
      });
    }, 1000);
  };

  onRecipeClick = (id) => {
    this.setState({
      displayedRecipe: id
    });
  };

  onModalClose = () => {
    this.setState({
      displayedRecipe: null
    });
  };

  render () {

    // Build out the Results list
    const cards = [];
    if (this.state.isLoadingSearch) {
      cards.push(
        <Grid item xs={12}>
          <Loader/>
        </Grid>
      );
    } else if (this.state.results) {
      for (let i = 0; i < this.state.results.length; i++) {
        const recipe = this.state.results[i];

        cards.push(
          <Grid item xs={3} key={'Recipe' + i}>
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
      <div className='BigDivArea'>
        <RecipeModal
          id={this.state.displayedRecipe}
          onClose={this.onModalClose}
        />

        <BodyContainer>
          <TextField
            id={'recipe-search-bar'}
            value={this.state.searchBarValue}
            label={'Search for a Recipe'}
            type={'search'}
            fullWidth
            onChange={(event) => {
              this.setState({
                searchBarValue: event.target.value
              })
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                this.search();
              }
            }}
          />

          <br/>
          <br/>

          <Grid id={'search-results'} container spacing={24}>
            {cards}
          </Grid>
        </BodyContainer>
      </div>
    );
  }
}

export default mainHome;
