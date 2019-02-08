import React from 'react';
import './AdvancedSearch.css';

import {Collapse, FormControl, Grid, InputLabel, MenuItem, Paper, Select} from "@material-ui/core";
import IngredientsAutocomplete from "../IngredientsAutocomplete/IngredientsAutocomplete";

const options = {
  cuisine: [
    'african',
    'chinese',
    'japanese',
    'korean',
    'vietnamese',
    'thai',
    'indian',
    'british',
    'irish',
    'french',
    'italian',
    'mexican',
    'spanish',
    'middle eastern',
    'jewish',
    'american',
    'cajun',
    'southern',
    'greek',
    'german',
    'nordic',
    'eastern european',
    'caribbean',
    'latin american'
  ],
  diet: [
    'pescetarian',
    'lacto vegetarian',
    'ovo vegetarian',
    'vegan',
    'vegetarian'
  ],
  intolerances: [
    'dairy',
    'egg',
    'gluten',
    'peanut',
    'sesame',
    'seafood',
    'shellfish',
    'soy',
    'sulfite',
    'tree nut',
    'wheat'
  ],
  type: [
    'main course',
    'side dish',
    'dessert',
    'appetizer',
    'salad',
    'bread',
    'breakfast',
    'soup',
    'beverage',
    'sauce',
    'drink'
  ],
};

class AdvancedSearch extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      includedIngredients: {
        inputValue: '',
        selectedItem: []
      },
      excludedIngredients: {
        inputValue: '',
        selectedItem: []
      },
      cuisine: '',
      diet: '',
      intolerances: '',
      type: ''
    }
  }

  update = (property) => {
    const state = {
      ...this.state,
      ...property
    };

    this.setState(state);
    this.props.onUpdate(state);
  };

  render () {
    let selectOptions = {
      cuisine: [],
      diet: [],
      intolerances: [],
      type: []
    };

    for (let key in options) {
      // skip loop if the property is from prototype
      if (!options.hasOwnProperty(key))
        continue;

      for (let i = 0; i < options[key].length; i++) {
        selectOptions[key].push(
          <MenuItem value={options[key][i]} key={options[key][i]}>{options[key][i]}</MenuItem>
        );
      }
    }

    return (
      <div id={'advanced-search'}>
        <Collapse in={this.props.expanded}>
          <Paper>
            <Grid container spacing={16}>
              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="cuisine">Cuisine</InputLabel>
                  <Select
                    value={this.state.cuisine}
                    onChange={(event) => {
                      this.update({ [event.target.name]: event.target.value });
                    }}
                    inputProps={{
                      name: 'cuisine',
                      id: 'cuisine',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {selectOptions.cuisine}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="diet">Diet</InputLabel>
                  <Select
                    value={this.state.diet}
                    onChange={(event) => {
                      this.update({ [event.target.name]: event.target.value });
                    }}
                    inputProps={{
                      name: 'diet',
                      id: 'diet',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {selectOptions.diet}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="intolerances">Intolerances</InputLabel>
                  <Select
                    value={this.state.intolerances}
                    onChange={(event) => {
                      this.update({ [event.target.name]: event.target.value });
                    }}
                    inputProps={{
                      name: 'intolerances',
                      id: 'intolerances',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {selectOptions.intolerances}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="type">Type</InputLabel>
                  <Select
                    value={this.state.type}
                    onChange={(event) => {
                      this.update({ [event.target.name]: event.target.value });
                    }}
                    inputProps={{
                      name: 'type',
                      id: 'type',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {selectOptions.type}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <IngredientsAutocomplete
                  label={'Included Ingredients'}
                  onChange={(state) => {
                    this.update({
                      includedIngredients: state
                    });
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <IngredientsAutocomplete
                  label={'Excluded Ingredients'}
                  onChange={(state) => {
                    this.update({
                      excludedIngredients: state
                    });
                  }}
                />
              </Grid>

            </Grid>
          </Paper>
        </Collapse>
      </div>
    );
  }
}

export default AdvancedSearch;