import React, {
	Component
} from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addNumber } from '../../actions/commonActions';

class NumberInput extends Component {
	static propTypes = {
		number: PropTypes.number.isRequired,
		addNumber: PropTypes.func.isRequired
	}

	render() {
		console.log(this.props)
		return (
			<div style={{ marginBottom: 20 }}>
				<Button type="ghost">{ this.props.number }</Button>
				<Button type="ghost" onClick={ () => this.props.addNumber(1) } >+</Button>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		number: state.number
	}
}

export default connect(mapStateToProps, {
	addNumber
})(NumberInput);