import React from "react"
import "./GroceryList.css";

import { Table, TableBody, TableCell, TableRow, Paper, Button, Fab, IconButton, Icon } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

class GroceryList extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const ingredients = this.props.list.list.split("\n");

    const ingredientsTable = (
      <Table>
        <TableBody>
          {ingredients.map(row => (
            <TableRow key={row}>
              <TableCell component="th" scope="row">
                {row}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    return (
      <div>
        <h1 className={"grocery-list-header"}>
          {this.props.list.title}

          <IconButton
            className={"grocery-list-edit-button"}
            onClick={() => {
              this.props.onDelete(this.props.list.title);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          <IconButton
            className={"grocery-list-edit-button"}
            onClick={() => {
              this.props.onEdit(this.props.list);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </h1>

        <Paper className={"grocery-list-ingredients-container"}>
          {ingredientsTable}
        </Paper>
      </div>
    );
  }
}

export default GroceryList;