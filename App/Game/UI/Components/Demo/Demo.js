import Demo, {props as P} from 'react-demo';

Demo.P = P;

// Demo.createProps = function(componentClass, values) {
//     var props = Object.assign({}, componentClass.propTypes);

//     for (key in props) {
//         if (values[key]) {
//             props[key] = P[props[key].type](values[key]);
//         } else if (componentClass.defaultProps[key]) {
//             props[key] = P[props[key].type](componentClass.defaultProps[key]);
//         }
//     }

//     return props;
// };

// Demo.createProps(Chat);

export default Demo;