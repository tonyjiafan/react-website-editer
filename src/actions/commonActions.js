import { ADD } from '../constants';

export const addNumber = (number) => {
	return {
		type: ADD,
		number
	}
}
