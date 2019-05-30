import React, {
	Component
} from 'react';
import websiteData from './webData';
import './index.less'

// 组件
import SortMenu from './components/SortMenu/SortMenu'; //排序菜单
// import ModulesList from './conmponents/ModuleList'; //模块菜单
// import TemplateList from './conmponents/TemplateList'; //模板菜单


import { Icon } from 'antd'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1219293_3pjl5z7tuio.js' // 在 iconfont.cn 上生成
})

class WebEditWarp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			meetingId: '',
			// qr_Code: qr_Code,
			Preview_show: false,
			spinShow: false,
			Is_Pc_Warp: true,
			Show_Modal_Template: false,
			Show_Modal_Edit: false,
			Mask_Disabled: false,
			Show_Moda_Module: false,
			Show_Moda_Sort: false,
			Current_Component: '',
			Current_RichId: '', // 当前组件的RichId,富文本组件需要获取内容
			localStorageHasWebData: false,
			Rich_List: [], // 富文本列表
			include_viewList: [],
			Mask_Edit_View_Change: true, // 切换编辑时的全屏、半屏
			View_Change_Style: {
				width: '50%',
				paddingRight: '20px',
				paddingLeft: '20px',
				paddingBottom: '80px',
				right: '0px',
				left: '50%'
			},

			// 基本数据模型
			WebData: websiteData,
		}

		this.vueOpenModalFn = this.vueOpenModalFn.bind(this)
		this.goBackList = this.goBackList.bind(this)
	}

	// 事件
	vueOpenModalFn(strName) {
		const _this = this
		const newState = _this.state
		const str = ['Show_Modal_Template', 'Show_Modal_Edit', 'Show_Moda_Module', 'Show_Moda_Sort']

		newState.Preview_show = false
		str.forEach((e) => {
			if (strName === e) {
				newState[strName] = !newState[strName]
			} else {
				newState[e] = false
			}
		})

		if (strName === 'Show_Modal_Edit') {
			newState.Mask_Edit_View_Change = newState.Is_Pc_Warp ? true : false
		} else if (strName === '' || strName === 'Show_Moda_Sort') {
			newState.Mask_Edit_View_Change = true
		}

		_this.setState({
			...newState
		})

	}

	goBackList(ss) {
		console.log(ss)
	}

	// 在渲染前调用,在客户端也在服务端
	componentWillMount() {
		console.log('Component WILL MOUNT!')
		const _this = this
		_this.setState({	
				meetingId: 'af026266-3d0d-c6e9-e0a7-08d6cc87db4f'
			},
			function() {
				window.A_vue = _this
				window.A_WebData = _this.state.WebData
				localStorage.setItem(`jy-web-data-${_this.state.meetingId}`, JSON.stringify(_this.state.WebData))
				setTimeout(() => {
					_this.setState({
						localStorageHasWebData: true
					})
				}, 2000)
			}
		)

		console.log(_this)
		console.log(window)
	}

	// 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，
	// 可以通过this.getDOMNode()来进行访问。 如果你想和其他JavaScript框架一起使用，
	// 可以在这个方法中调用setTimeout, setInterval或者发送AJAX请求等操作(防止异步操作阻塞UI)
	componentDidMount() {
		console.log('Component DID MOUNT!')
	}

	// // 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
	// componentWillReceiveProps(newProps) {
	// 	console.log('Component WILL RECEIVE PROPS!')
	// }

	// // 返回一个布尔值。在组件接收到新的props或者state时被调用。
	// // 在初始化时或者使用forceUpdate时不被调用。可以在你确认不需要更新组件时使用
	// shouldComponentUpdate(newProps, newState) {
	// 	return true
	// }

	// // 在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用。
	// componentWillUpdate(nextProps, nextState) {
	// 	console.log('Component WILL UPDATE!')
	// }

	// // 在组件完成更新后立即调用。在初始化时不会被调用。
	// componentDidUpdate(prevProps, prevState) {
	// 	console.log('Component DID UPDATE!')
	// }

	// // 在组件从 DOM 中移除之前立刻被调用。
	// componentWillUnmount() {
	// 	console.log('Component WILL UNMOUNT!')
	// }

	render() {
		const {
			localStorageHasWebData,
			Is_Pc_Warp,
			Mask_Edit_View_Change,
			View_Change_Style,
			Show_Modal_Template,
			Show_Modal_Edit,
			Show_Moda_Module,
			Show_Moda_Sort,
		} = this.state
		return (
			<div className="WebEditWarp">
				<div className="web_nav_top" />
				<div className="web_main_content">
					<div className="left_menu">
						<div className="left_item" onClick={ () => this.vueOpenModalFn('Show_Modal_Template') } style={{ background: Show_Modal_Template ? '#ff5200' : '' }}>
							<MyIcon style={{fontSize: '34px', color: Show_Modal_Template ? '#fff' : '' , marginTop: '10px'}} type="icon-layout-line" ></MyIcon>
							<br/>
							<span style={{ color: Show_Modal_Template ? '#fff' : '' }}>网站模板</span>
						</div>

						<div className="left_item" onClick={ () => this.vueOpenModalFn('Show_Moda_Module') } style={{ background: Show_Moda_Module ? '#ff5200' : '' }}>
							<MyIcon style={{ fontSize: '36px', color: Show_Moda_Module ? '#fff' : '' , marginTop: '10px'}} type="icon-apps" />
							<br/>
							<span style={{ color: Show_Moda_Module ? '#fff' : '' }}>模块添加</span>
						</div>

						<div className="left_item" onClick={ () => this.vueOpenModalFn('Show_Moda_Sort') } style={{ background: Show_Moda_Sort ? '#ff5200' : '' }}>
							<MyIcon style={{ fontSize: '34px', color: Show_Moda_Sort ? '#fff' : '' , marginTop: '10px'}} type="icon-menu" />
							<br/>
							<span style={{ color: Show_Moda_Sort ? '#fff' : '' }}>菜单管理</span>
						</div>
						
						<div className="left_item" onClick={ this.goBackList('hfihui') }>
							<MyIcon style={{ fontSize: '34px', marginTop: '10px' }} type="icon-rollback" />
							<br/>
							<span>返回管理</span>
						</div>
					</div>
					<div className="right_content">
						{localStorageHasWebData && Is_Pc_Warp ? (
							<iframe
								title="pc"
								className="web_pc_iframe"
								src={ `http://localhost:3000/tem1/index.html?${this.state.meetingId}` }
								name="prewWebsite"
								id="prewWebsite"
								frameBorder="0"
								scrolling="yes"
							/>
						) : (
							<div className="none-content">
								努力加载中...
							</div>
						)}
					</div>
					
					{
						Show_Modal_Template ? (
							<div className="modal-mask-template">
								<div className="modal-content-template" >
									弹出层 选择网站模板
								</div>
							</div>
						) : 
						null
					}
					{
						Show_Modal_Edit ? (
							<div className="modal-mask-edit" style={ !Mask_Edit_View_Change ? View_Change_Style : '' }>
								<div className="modal-content" style={{ width: Mask_Edit_View_Change ? '900px' : '100%' }}>
									<label className="change-icon" onClick={ this.setState({ Mask_Edit_View_Change: !Mask_Edit_View_Change }) }>
										切换视图
									</label>
									业务组件
								</div>
							</div>
						) : 
						null
					}
					{
						Show_Moda_Module ? (
							<div className="modal-mask-add-module">
								<div className="modal-content">
									模块添加
								</div>
							</div>
						) : 
						null
					}
					{
						Show_Moda_Sort ? (
							<div className="modal-mask-sort">
								<div className="modal-content">
									<SortMenu Section_Data={ this.state.WebData.Section_Data }/>
								</div>
							</div>
						) : 
						null
					}
					
					
				</div>
			</div>
		)
	}
}

export default WebEditWarp;
