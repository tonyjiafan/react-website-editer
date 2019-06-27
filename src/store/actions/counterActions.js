import { ADD, CUT } from '../constants';

export const addNumber = (number) => {
	return {
		type: ADD,
		number
	}
}

export const cutNumber = (number) => {
	// 异步任务 必须配合 redux-thunk这样的库来处理成函数 再返回
	return dispatch => {
		setTimeout(() => {
			dispatch({
				type: CUT,
				number
			})
		}, 2000)
	}
}
