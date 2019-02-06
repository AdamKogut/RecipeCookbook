import React, { Component } from "react";
import "./mainHome.css";

import BodyContainer from '../BodyContainer/BodyContainer';
import RecipeCard from '../RecipeCard/RecipeCard';
import { Grid } from '@material-ui/core';

class mainHome extends Component {

  constructor (props) {
    super(props);

    let results = [];

    for (let i = 0; i < 20; i++) {
      results.push({
        title: 'Hello World',
        image: 'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg',
        id: 'asdfqwert'
      });
    }

    console.log(results);

    this.state = {
      results
    };
  }

  render () {
    const cards = [];
    for (let i = 0; i < this.state.results.length; i++) {
      const recipe = this.state.results[i];

      cards.push(
        <Grid item xs={3} key={'Recipe' + Math.random()}>
          <RecipeCard title={recipe.title} image={recipe.image} id={recipe.id} />
        </Grid>
      );
    }

    console.log(cards);

    return (
      <div className='BigDivArea'>
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
