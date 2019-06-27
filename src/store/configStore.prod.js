import thunk from 'redux-thunk'; // 处理异步任务时 action 无法解析函数的情况
import reduxPromise from 'redux-promise-middleware'; // 生成action，省去冗余代码
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
        applyMiddleware(
            thunk,
            reduxPromise
        )
    )
    return store
}

export default configStore;
