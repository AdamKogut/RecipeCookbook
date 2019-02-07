import React from 'react';
import './BodyContainer.css';

class BodyContainer extends React.Component {
  render () {
    return (
      <div id={'body-container'}>
        {this.props.children}
      </div>
    );
  }
}

export default BodyContainer;