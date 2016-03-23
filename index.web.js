import React from 'react';
import ReactDOM from 'react-dom';

require('./vendor/react-fake-native');

import UI from './src/UI/UI';

ReactDOM.render(<UI />, document.getElementById('ui'));