import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';

// 路由
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

// ReactDOM.render(
//         <Router>
// 			<div className="RootChildWarp">
// 				{ Routes }
// 			</div>
// 		</Router>, 
//         document.getElementById('root')
//     );

//热更新实现
const render = Component => {
    ReactDOM.render(
		<AppContainer>
			<Router>
				<div className="RootChildWarp">
					{ Component }
				</div>
			</Router>
		</AppContainer>,
      document.getElementById('root')
    )
};

// 渲染路由文件 更新视图
render(Routes);

if (module.hot) {
    module.hot.accept('./routes', () => {
        render(Routes)
    })
};

serviceWorker.unregister();
