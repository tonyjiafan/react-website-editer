import React, { Component } from 'react';
import { Icon, Spin } from 'antd';

const styles = {
    spinCoat: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}

class SpinComponent extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }

    render() {
        const _this = this
        const {
          wrapperClassName,
          size = 'large',
          spinning,
          color = '#ff7225',
          iconType = 'loading'
        } = _this.props
        
        const antIcon = <Icon type={ iconType } style={{ fontSize: 70, color: color }} spin />

        return (
            <div style={styles.spinCoat}>
                <Spin
                    size={size}
                    wrapperClassName={wrapperClassName}
                    indicator={antIcon}
                    spinning={spinning}
                />
            </div>
        )
    }
}

export default SpinComponent;