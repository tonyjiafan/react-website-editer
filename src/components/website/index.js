import React, { Component } from 'react';
import websiteData from './webData';
import './index.less';

// 组件
import SortMenu from './components/SortMenu/SortMenu'; //排序菜单
// import Tuzhuai from './components/SortMenu/examples'; //排序菜单

// import ModulesList from './conmponents/ModuleList'; //模块菜单
// import TemplateList from './conmponents/TemplateList'; //模板菜单


import { Icon } from 'antd'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1219293_3pjl5z7tuio.js' // 在 iconfont.cn 上生成
})

/**
 * jy-web-flag 用来判断当前的数据内容 是否被编辑过  1 未编辑  0 已编辑 
 * */ 

/**
 * Show_Modal_Template 模板选择
 * Show_Modal_Edit  模块编辑
 * Show_Moda_Module  模块添加
 * Show_Moda_Sort  模块排序
 * */

/** 
 * Basic 1 基本信息
 * Introduction 2 活动介绍
 * Guest 3 嘉宾介绍
 * Schedule 4 活动日程
 * Partner 5 合作伙伴
 * Reception 6 会务接待
 * Guide 7 参会指南
 * Custom 8 自定义栏目
 * News 9 活动动态
 * */ 

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
		this.currentSortFn = this.currentSortFn.bind(this)
		this.relooad = this.relooad.bind(this)
		this.saveDataToLocalStorage = this.saveDataToLocalStorage.bind(this)
	}

	goBackList(ss) {
		const _this = this
		console.log(_this.props)
		_this.props.history.push('/');
	}

	// 存储数据变化 到本地
	saveDataToLocalStorage() {
		const _this = this
		const { WebData } = _this.state
		window.localStorage.setItem(`jy-web-data-${_this.meetingId}`, JSON.stringify(WebData))
	}

	// 刷新页面
	relooad() {
		console.log('reload8888888888')
		const _this = this
		const { WebData } = _this.state
		console.log(WebData)
		
		let Child_Window = window.frames['prewWebsite'] //获得对应iframe的window对象
		console.log(Child_Window)
		Child_Window.B_vue.updatedPageData(WebData)
	}
	
	changeWarp(str) {
		const _this = this
		_this.Is_Pc_Warp = str == 'PC' ? true : false
	}

	/*****************  唤醒菜单栏方法  ***************************/
	// 菜单拖拽排序
	vueSort(params) {
		const _this = this
		_this.Preview_show = false
		_this.vueOpenModalFn('Show_Moda_Sort')
	}
	// 关闭 [模块编辑] 弹出层
	vueCancelForm() {
		const _this = this
		_this.Show_Modal_Edit = false
	}
	// 切换菜单显示
	vueOpenModalFn(strName) {
		const _this = this
		const newState = _this.state
		const str = ['Show_Modal_Template', 'Show_Modal_Edit', 'Show_Moda_Module', 'Show_Moda_Sort']

		newState.Preview_show = false
		str.forEach((e) => {
			strName === e ? newState[strName] = !newState[strName] : newState[e] = false
		})

		if (strName === 'Show_Modal_Edit') {
			newState.Mask_Edit_View_Change = newState.Is_Pc_Warp ? true : false
		} else if (strName === '' || strName === 'Show_Moda_Sort') {
			newState.Mask_Edit_View_Change = true
		}
		_this.setState({ ...newState })
	}

	//**************** 实际执行方法 *************************/ 

	/** 
	 * 彻底删除 自定义 模块
	 * Moudels 已经删除后的完整的 Section_Data
	 * */ 
	vueDeleteFn(Moudels) {
		const _this = this
		_this.WebData.Section_Data = Moudels

		// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
		localStorage.setItem('jy-web-flag', '0')

		_this.saveDataToLocalStorage()
	}
	/** 
	 * 启用/停用 模块
	 * 传递过来index 查找数据后修改
	 * 该方法用于【iframe内】【排序菜单】【模块添加菜单】使用
	 * */ 
	vueEnabledFn(params) {
		// log('vueEnabledFn', params)
		const _this = this
		const { typeName, index } = params
		const { Section_Data } = _this.WebData

		// 如果当前的编辑状态属于打开状态  移除不可操作
		if (_this.Show_Modal_Edit) return _this.$Message.info('当前处于编辑状态，不能执行此操作！')

		// 增加 loading 效果，为了解决 多个自定义连续删除时无效问题
		_this.spinShow = true

		if (typeName == 'module') {
			// 模块添加菜单
			_this.$set(Section_Data[index], 'Enabled', true)
			_this.spin(500)

		} else if (typeName == '') {
			// 菜单管理
			_this.$set(Section_Data[index], 'Enabled', false)
			_this.spin(500)

		} else if (typeName == 'Iframe' && index == null) {
			// Iframe子页面
			let { Current_Component, Current_RichId } = params
			let params_Id = Current_Component + Current_RichId + ''

			Section_Data.forEach((e, i) => {
				let module_Id = e.Section_Code + e.Rich_Id + ''
				if (module_Id == params_Id) {
					e.Enabled = false
				}
			})
			_this.spin(500)

		}

		// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
		localStorage.setItem('jy-web-flag', '0')

		_this.saveDataToLocalStorage()
		_this.relooad()
	}

	/** 
	 * 编辑模块内容
	 * Current_Type 当前需要渲染的组件类型
	 * Current_Component 当前需要渲染的组件名称
	 * Current_RichId 富文本的Id 当组件是富文本组件时 才需要这个字段
	 * */ 
	vueEditFn(params) {
		const _this = this
		const {Current_Type, Current_Component, Current_RichId} = params

		// 自定义模块的 视图组件 是复用的，存在多个自定义 在移动端编辑时 可以无缝唤醒 当前的自定义组件
		// 如果 组件名字是同一个 就判断 Current_RichId 是否是同一个
		if (_this.Current_Component == Current_Component && _this.Current_RichId != Current_RichId) {
			// 先把组件置空 重新加载组件
			_this.Current_Component = ''
			setTimeout(() => {
				_this.Current_Component = Current_Component
				_this.Current_RichId = Current_RichId
			}, 100)
		} else {
			_this.Current_Component = Current_Component
			_this.Current_RichId = Current_RichId
		}

		if (!_this.Show_Modal_Edit) {
			_this.vueOpenModalFn('Show_Modal_Edit')
		}
	}

	// Modules 所有编辑后 回传的整个 数据模型
	editModuleUpdate(Modules, isOpen = false, isChange = true) {
		const _this = this
		let flag = _this.isArrayFn(Modules)
		
		if (flag) {
			// log('数组对象', Modules)
			_this.WebData.Section_Data = Modules
		} else {
			// log('json对象', Modules)
			_this.WebData.Basic = Modules
		}

		// isChange 为false 组件编辑后 如果是点击的 取消按钮 则不改变
		if (isChange) {
			// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
			localStorage.setItem('jy-web-flag', '0')
		}

		_this.saveDataToLocalStorage()
		_this.relooad()

		// isOpen 更新模板列表中的 官网上展示报名人数 swith 时，不需要清除当前模态框
		if (!isOpen) _this.vueOpenModalFn('')

		// log(_this.WebData.Section_Data)
	}

	/**
	 * 拖拽排序方法
	 * Section_Data 传递过来的参数 已经是处理好的 直接赋值
	 */ 
	currentSortFn(Section_Data) {
		const _this = this
		const newState = _this.state

		newState.WebData.Section_Data = Section_Data
		_this.setState({
			...newState
		}, () => {
			// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
			// localStorage.setItem('jy-web-flag', '0')
			_this.saveDataToLocalStorage()
			_this.relooad()
		})
	}

	/**
	 * 更新选中模板 
	 * Temp_Path
	 * Temp_Code
	 * App_Temp_Path
	 * App_Temp_Code
	 * Tem_List 传递过来的参数 已经是处理好的 直接赋值
	 */ 
	updateTemplate(Tem_List, Click_Type = 1) {
		const _this = this
		Tem_List.forEach(e => {
			if (e.Is_Checked && e.Template_Type == 1) {
				_this.WebData.Temp_Path = e.Template_Path
				_this.WebData.Temp_Code = e.Template_Code
			} else if (e.Is_Checked && e.Template_Type == 2) {
				_this.WebData.App_Temp_Path = e.Template_Path
				_this.WebData.App_Temp_Code = e.Template_Code
			}
		})

		// 根据模板点击 来判断是 PC 还是 移动
		_this.Is_Pc_Warp = Click_Type == 1 ? true : false

		_this.WebData.Template_List = Tem_List

		// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
		localStorage.setItem('jy-web-flag', '0')

		_this.saveDataToLocalStorage()
		
		_this.$nextTick(function() {
			_this.relooad()
		})

		_this.vueOpenModalFn('')
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
						
						<div className="left_item" onClick={ () => this.goBackList('点击返回') }>
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
									<SortMenu currentSort={ this.currentSortFn } Section_Data={ this.state.WebData.Section_Data }/>
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
