import logger from 'redux-logger';
import thunk from 'redux-thunk'; // 处理异步任务时 action 无法解析函数的情况
import reduxPromise from 'redux-promise-middleware'; // 生成action，省去冗余代码
// redux调试插件
import {
    composeWithDevTools
} from 'redux-devtools-extension';
/**
 * redux相关引入
 * applyMiddleware 中间件
 */
import {
    createStore,
    applyMiddleware
} from 'redux';
//react-redux相关引入
import rootReducers from './reducers';

const configStore = preloadedState => {
    const store = createStore(
        rootReducers,
        preloadedState,
        composeWithDevTools(
            applyMiddleware(
                logger, 
                thunk, 
                reduxPromise
            )
        )
    )

    // 热加载
    if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
            module.hot.accept('./reducers', () => {
                store.replaceReducer(rootReducers)
            })
        }
    }

    return store
}

export default configStore;
