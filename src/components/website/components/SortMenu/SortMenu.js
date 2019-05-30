import React, {
	Component
} from 'react';
import './SortMenu.less';

import { Icon } from 'antd';
const MyIcon = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1219293_3pjl5z7tuio.js' // 在 iconfont.cn 上生成
});

/**
 * Show_Modal_Template 模板选择
 * Show_Modal_Edit  模块编辑
 * Show_Moda_Module  模块添加
 * Show_Moda_Sort  模块排序
 **/

/** 
 * Basic 1 基本信息
 * Introduction 2 活动介绍
 * Guest 3 嘉宾介绍
 * Schedule 4 活动日程
 * Partner 5合作伙伴
 * Reception 6 会务接待
 * Guide 7 参会指南
 * Custom 8 自定义栏目
 * News 9 活动动态
 * */

// import { cloneObj } from '../../../libs/filters.js';


class SortMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			Menus: [],
		}

		this.settingData = this.settingData.bind(this)
		this.vueEdit = this.vueEdit.bind(this)
		this.vueEnabled = this.vueEnabled.bind(this)
		this.closeModuleWarp = this.closeModuleWarp.bind(this)
		this.getdata = this.getdata.bind(this)
		this.changeSort = this.changeSort.bind(this)
	}

	// 获取栏目列表
	settingData() {
		const _this = this
		const {
			Section_Data
		} = _this.props
		let menus = Section_Data.map(e => Object.assign(e))

		_this.setState({
			Menus: menus
		})
    }

    vueEdit(item) {
        // const _this = this
        console.log(item)
        const { Section_Code, Rich_Id, Section_Type } = item
        let params = {
                Current_Type: Section_Type,
                Current_Component: Section_Code, 
                Current_RichId: Rich_Id + '',
            }
        window.A_vue.vueEditFn(params)
    }

    vueEnabled(index) {
        const _this = this
        // 调用父组件的 排序方法
        _this.$emit('vueEnabled', {index: index, typeName: ''})
    }
    // 关闭菜单
    closeModuleWarp() {
        // const _this = this
        window.A_vue.Show_Moda_Sort = false
    }

    // 拖拽事件
    getdata(evt) {
        // console.log(evt.draggedContext)
    }
    changeSort(evt) {
        // log(evt)
        const _this = this
        // 调用父组件的 排序方法
        _this.$emit('currentSort', _this.Menus)
    }

	componentWillMount() {
		console.log(this.props)
        this.settingData()
        // 处理默认事件
        document.body.ondrop = event => {
            event.preventDefault();
            event.stopPropagation();
        };
    }
    
	// 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，
	// 可以通过this.getDOMNode()来进行访问。 如果你想和其他JavaScript框架一起使用，
	// 可以在这个方法中调用setTimeout, setInterval或者发送AJAX请求等操作(防止异步操作阻塞UI)
	componentDidMount() {
		console.log('Component DID MOUNT!')
	}

	// 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
	componentWillReceiveProps(newProps) {
		console.log('Component WILL RECEIVE PROPS!')
	}

	// 返回一个布尔值。在组件接收到新的props或者state时被调用。
	// 在初始化时或者使用forceUpdate时不被调用。可以在你确认不需要更新组件时使用
	shouldComponentUpdate(newProps, newState) {
		return true
	}

	// 在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用。
	componentWillUpdate(nextProps, nextState) {
		console.log('Component WILL UPDATE!')
	}

	// 在组件完成更新后立即调用。在初始化时不会被调用。
	componentDidUpdate(prevProps, prevState) {
		console.log('Component DID UPDATE!')
	}

	// 在组件从 DOM 中移除之前立刻被调用。
	componentWillUnmount() {
		console.log('Component WILL UNMOUNT!')
	}

	render() {
		const {
			Menus
		} = this.state

		return (
			<div className="SortMenu">
                <div className="web_module_warp">
                    <div className="web_module_title">
                        菜单管理
                        <label onClick={ () => this.closeModuleWarp }>
                            <Icon className="close" style={{ fontSize: '20px'}} type="close" />
                        </label>
                    </div>
                    <ul style={{ padding: "10px" }}>
                        <li>
                            {
                                Menus.map((item, index) => 
                                    <span className="tuo-zhuai-item-warp dargDiv" key={ item.Section_Code + "-" + item.Rich_Id }>
                                        <span className="tuo-zhuai-tag">
                                            <MyIcon style={{ fontSize: '20px', color: '#888'}} type="icon-align-justify" />
                                        </span>
                                        <span className="tuo-zhuai-text">{ item.Section_Name }</span>

                                        <span className="edit-box seeting-box">
                                            <label onClick={ () => this.vueEdit(item) }>
                                                <MyIcon className="hover-icon" style={{ fontSize: '19px'}} type="icon-tianxie" />
                                            </label>
                                        </span>
                                        <span className="delete-box seeting-box">
                                            <label onClick={ () => this.vueEnabled(index) }>
                                                <MyIcon className="hover-icon" style={{ fontSize: '21px', marginTop: '5px'}} type="icon-trash-alt" />
                                            </label>
                                        </span>
                                    </span>
                                )
                            }
                        </li>
                        <p style={{ textAlign: "center", padding: "6px 0px 12px", marginTop: "20px" }}>
                            出现 <MyIcon type="icon-move1"  style={{ verticalAlign: "-2px", fontSize: "16px", color: "#2a2a2b" }} /> 按住拖动排序
                        </p>
                    </ul>
                </div>
            </div>
		)
	}
}

export default SortMenu;
