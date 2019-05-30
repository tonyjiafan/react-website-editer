import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// 样式
import './index.less';

// 路由
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

ReactDOM.render(
        <Router>
			<div className="RootChildWarp">
				{ Routes }
			</div>
		</Router>, 
        document.getElementById('root')
    );


serviceWorker.unregister();
