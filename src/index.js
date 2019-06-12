import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';

// 路由
import Routes from './routes'
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';
// redux
import { Provider } from 'react-redux';
import configStore from './store/configStore.js';

// store
const store = configStore();

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

// 热重载
if (module.hot) {
    module.hot.accept('./routes', () => {
        render(Routes)
    })
};

serviceWorker.unregister();
