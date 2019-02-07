import React from 'react';
import './AdvancedSearch.css';

import {Collapse, FormControl, Grid, InputLabel, MenuItem, Paper, Select} from "@material-ui/core";
import IngredientsAutocomplete from "../IngredientsAutocomplete/IngredientsAutocomplete";

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
    return (
      <div id={'advanced-search'}>
        <Collapse in={this.props.expanded}>
          <Paper>
            <Grid container spacing={12}>
              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="cuisine">Cuisine</InputLabel>
                  <Select
                    inputProps={{
                      name: 'cuisine',
                      id: 'cuisine',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="diet">Diet</InputLabel>
                  <Select
                    inputProps={{
                      name: 'diet',
                      id: 'diet',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="intolerances">Intolerances</InputLabel>
                  <Select
                    inputProps={{
                      name: 'intolerances',
                      id: 'intolerances',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={'advanced-search-input'}>
                  <InputLabel htmlFor="type">Type</InputLabel>
                  <Select
                    inputProps={{
                      name: 'type',
                      id: 'type',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
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