import React from 'react';
import './RecipeCard.css';

import { Card, CardHeader, CardMedia } from '@material-ui/core';

class RecipeCard extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.title}
        />

        <CardMedia
          className={'recipe-media'}
          image={this.props.image}
          title="Yeet"
        />
      </Card>
    );
  }
}

export default RecipeCard;