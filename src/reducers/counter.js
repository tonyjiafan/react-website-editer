
import { ADD, CUT } from '../constants';
import { message } from 'antd';

const number = (state = 0, action = {}) => {
	console.log(state)
	console.log(action)
	const { number } = action
	switch (action.type) {
		case ADD:
            return state + number;
		case CUT:
			if (state === 0) {
				message.warning('不能小于0!')
				return state
			} else {
				return state - 1
			}
		default:
			return state
	}
}

export default number;
