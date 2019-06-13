import React, { Component } from 'react';
import { Spin } from 'antd';

// React lazy loading
const lazySpinWarp= {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100',
    background: '#29292b47',
    zIndex: '9999',
    height: '100',
    overflow: 'hidden',
}
const LazySpinStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

class LazySpin extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }

    render() {
        return (
          <div style={lazySpinWarp}>
            <div style={LazySpinStyle}>
              <Spin />
            </div>
          </div>
        )
    }
}

export default LazySpin;