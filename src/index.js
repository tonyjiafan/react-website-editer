import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';

// 路由
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

import { Provider } from 'react-redux';
import rootReducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
// 处理异步任务时 action 无法解析函数的情况
import thunk from 'redux-thunk';

// redux调试插件
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

const store = createStore(rootReducers,
	composeWithDevTools(
		applyMiddleware(
			logger,
			thunk,
		)
	)
);
//热更新实现
const render = RoutesComponent => {
    ReactDOM.render(
		<Provider store= { store }>
			<AppContainer>
				<Router>
					<div className="RootChildWarp">
						{ RoutesComponent }
					</div>
				</Router>
			</AppContainer>
		</Provider>,
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
