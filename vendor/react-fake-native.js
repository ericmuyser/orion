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
      this.props,
      this.props.children
    );
  }
});

React.Text = React.createClass({
  displayName: "Text",

  render: function render() {
    return React.createElement(
      "div",
      this.props,
      this.props.children
    );
  }
});

React.Img = React.createClass({
  displayName: "Img",

  render: function render() {
    return React.createElement(
      "img",
      this.props
    );
  }
});

window.View = React.View;
window.Text = React.Text;
window.Img = React.Img;