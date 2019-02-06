import React, { Component } from "react";
import "./mainHome.css";

import BodyContainer from '../BodyContainer/BodyContainer';
import RecipeCard from '../RecipeCard/RecipeCard';
import Loader from '../Loader/Loader';
import { Grid } from '@material-ui/core';
import RecipeModal from "../RecipeModal/RecipeModal";

class mainHome extends Component {

  constructor (props) {
    super(props);

    this.state = {
      displayedRecipe: null
    };

    let results = [];

    for (let i = 0; i < 20; i++) {
      results.push({
        title: 'Hello World',
        image: 'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg',
        id: 'asdfqwert' + i
      });
    }

    console.log(results);

    setTimeout(() => {
      this.setState({
          results
      });
    }, 1000);
  }

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
    if (this.state.results) {
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
    } else {
      cards.push(
        <Grid item xs={12}>
          <Loader/>
        </Grid>
      );
    }

    return (
      <div className='BigDivArea'>
        <RecipeModal
          id={this.state.displayedRecipe}
          onClose={this.onModalClose}
        />

        <BodyContainer>
          <Grid id={'search-results'} container spacing={24}>
            {cards}
          </Grid>
        </BodyContainer>
      </div>
    );
  }
}

export default mainHome;
