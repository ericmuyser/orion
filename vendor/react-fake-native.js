var React = require('react');

React.StyleSheet = {
    create: function(styles) {
        return styles;
    }
};


React.View = React.createClass({
  displayName: "View",

  render: function render() {
    return React.createElement(
      "div",
      { style: this.props.style },
      this.props.children
    );
  }
});

React.Text = React.createClass({
  displayName: "Text",

  render: function render() {
    return React.createElement(
      "div",
      null,
      this.props.children
    );
  }
});

// React.View = React.createClass({
//   render: function() {
//     return (
//       <div style={this.props.style}>
//         {this.props.children}
//       </div>
//     );
//   }
// });

// React.Text = React.createClass({
//   render: function() {
//     return (
//       <div>
//         {this.props.children}
//       </div>
//     );
//   }
// });

window.View = React.View;
window.Text = React.Text;