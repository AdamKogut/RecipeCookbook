import React from 'react';
import './RecipePrinter.css';

import ReactToPrint from 'react-to-print';
import {AppBar, Button, Modal, Paper, Tab, Tabs} from "@material-ui/core";

class RecipePrinter extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      printing: false
    }
  }

  render () {
    if (!this.props.recipe)
      return null;

    return (
      <div className={'recipe-printer'}>
        <ReactToPrint
          trigger={() => <Button variant="contained">Print</Button>}
          content={() => this.componentRef}
          onBeforePrint={() => {
            this.setState({
              printing: true
            });
          }}
          onAfterPrint={() => {
            this.setState({
              printing: false
            });
          }}
        />
        <div id={'print-box'}>
          <PrintableRecipe
            ref={el => (this.componentRef = el)}
            recipe={this.props.recipe}
            printing={this.state.printing}
          />
        </div>
      </div>
    );
  }
}

class PrintableRecipe extends React.Component {
  render () {
    const recipe = this.props.recipe;

    let content;
    if (recipe.title) {
      const ingredients = [];
      const instructions = [];

      for (let i = 0; i < recipe.extendedIngredients.length; i++) {
        ingredients.push(
          <li key={'ingredient' + i}>
            { recipe.extendedIngredients[i].original }
          </li>
        );
      }

      for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
        instructions.push(
          <li key={'ingredient' + i}>
            { recipe.analyzedInstructions[0].steps[i].step }
          </li>
        );
      }

      content = (
        <div>
          <h1 id={'recipe-print-title'}>
            {recipe.title}
          </h1>

          <img id={'recipe-print-image'} src={recipe.image} />

          <h1 className={'recipe-print-subtitle'}>
            Ingredients
          </h1>
          <div className={'recipe-print-content'}>
            <ul>
              {ingredients}
            </ul>
          </div>

          <h1 className={'recipe-print-subtitle'}>
            Instructions
          </h1>
          <div className={'recipe-print-content'}>
            <ul>
              {instructions}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <Paper className={'print-container'}>
        {content}
      </Paper>
    );
  }
}

export default RecipePrinter