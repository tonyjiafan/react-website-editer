/**
 * jy-web-flag 用来判断当前的数据内容 是否被编辑过  1 未编辑  0 已编辑 
 * Show_Modal_Template 模板选择
 * Show_Modal_Edit  模块编辑
 * Show_Moda_Module  模块添加
 * Show_Moda_Sort  模块排序
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

import React, { Component, Suspense } from 'react'
import websiteData from './webData';
import richList from './richList';
import './index.less';
import { message, Button, Tooltip } from 'antd';
import MyIcon from '../common/myIcon';
import { isArrayFn } from '../../libs/filters';
import phoneImg from '../../images/tem_phone_bg.png';

// 常用组件
import SpinComponent from '../common/spin';
import LazySpin from '../common/lazySpin';

// 业务组件
const SortMenu = React.lazy(() => import('./components/SortMenu/SortMenu')); //排序菜单
const ModuleList = React.lazy(() => import('./components/ModuleList/ModuleList')); //排序菜单
const TemplateList = React.lazy(() => import('./components/TemplateList/TemplateList')); //排序菜单
const Custom = React.lazy(() => import('./components/Custom/Custom')); //自定模块
const Introduction = React.lazy(() => import('./components/Introduction/Introduction')); //活动介绍

class WebEditWarp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			meetingId: `af026266-3d0d-c6e9-e0a7-08d6cc87db4f`,
			tempSrcPc: `http://localhost:3000/templates/tem7/index.html`,
			tempSrcMobile: `http://localhost:3000/templates/m007/index.html`,
			// tempSrcPc: `https://tonyjiafan-react-editer-app.netlify.com/template/tem7/index.html`,
			// tempSrcMobile: `https://tonyjiafan-react-editer-app.netlify.com/template/m007/index.html`,
			Preview_show: false,
			Loading: false,
			LoadingContent: true,
			Is_Pc_Warp: true,
			Show_Modal_Template: false,
			Show_Modal_Edit: false,
			Mask_Disabled: false,
			Show_Moda_Module: false,
			Show_Moda_Sort: false,
			Current_Component: '',
			Current_RichId: '', // 当前组件的RichId,富文本组件需要获取内容
			localStorageHasWebData: false,
			Rich_List: richList || [], // 富文本列表
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

		this.reactOpenModalFn = this.reactOpenModalFn.bind(this) // 模块切换时 的操作界面切换
		this.goBackList = this.goBackList.bind(this) // 返回
		this.currentSortFn = this.currentSortFn.bind(this) // 菜单排序
		this.reload = this.reload.bind(this) // 重新加载
		this.saveDataToLocalStorage = this.saveDataToLocalStorage.bind(this) // 存储数据到本地
		this.reactEnabledFn = this.reactEnabledFn.bind(this) // 是否开启模块
		this.reactDeleteFn = this.reactDeleteFn.bind(this) // 删除模块
		this.reactEditFn = this.reactEditFn.bind(this) // 编辑模块
		this.updateTemplate = this.updateTemplate.bind(this) // 更新模板
    	this.editModuleUpdate = this.editModuleUpdate.bind(this) // Modules 所有编辑后 回传的整个 数据模型
    	this.richListUpdate = this.richListUpdate.bind(this) // 富文本编辑后 更新

	}

	goBackList() {
		window.localStorage.removeItem('jy-web-flag')
		window.localStorage.removeItem(`jy-web-data-${this.state.meetingId}`)
		window.localStorage.removeItem('jy-web-richList')
		setTimeout(() => {
			this.props.history.push('/')
		}, 500);
	}
	saveDataToLocalStorage() {
		const { WebData } = this.state
		window.localStorage.setItem(`jy-web-data-${this.state.meetingId}`, JSON.stringify(WebData))
	}
	reload() {
		// 默认 结束 loading
		this.setState({ 
			Loading: false 
		}, () => {
			let Child_Window = window.frames['prewWebsite'] //获得对应iframe的window对象
			if (Child_Window.B_vue) {
				const { WebData } = this.state
				Child_Window.B_vue.updatedPageData(WebData)
			}
		})
	}
	changeWarp(str) {
		const newState = this.state
		let Str_State = str === 'PC' ? true : false

		if (Str_State !== newState.Is_Pc_Warp) {
			newState.Is_Pc_Warp = Str_State
			this.setState({ LoadingContent: true })
			setTimeout(() => {
				this.setState({
					...newState
				})
			}, 2000)
		}
	}
	richListUpdate(Rich_List) {
		this.setState({
			Rich_List
		}, () => {
			localStorage.setItem('jy-web-richList', JSON.stringify(this.state.Rich_List))
			this.reload()
		})
	}

	/*****************  唤醒菜单栏方法  ***************************/
	reactSort(params) {
		this.Preview_show = false
		this.reactOpenModalFn('Show_Moda_Sort')
	}
	// 关闭 [模块编辑] 弹出层
	reactCancelForm() {
		this.setState({
			Show_Modal_Edit: false,
			Mask_Edit_View_Change: true
		})
	}
	// 切换菜单显示
	reactOpenModalFn(strName) {
		const newState = this.state
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
		this.setState({ ...newState })
	}

	//**************** 实际执行方法 *************************/ 
	/** 
	 * 彻底删除 自定义 模块
	 * Moudels 已经删除后的完整的 Section_Data
	 * */ 
	reactDeleteFn(Moudels) {
		const newState = this.state
		newState.WebData.Section_Data = Moudels
		this.setState({
			...newState
		}, () => {
			// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
			localStorage.setItem('jy-web-flag', '0')
			this.saveDataToLocalStorage()
		})
	}
	/** 
	 * 启用/停用 模块
	 * 传递过来index 查找数据后修改
	 * 该方法用于【iframe内】【排序菜单】【模块添加菜单】使用
	 * */ 
	reactEnabledFn(params) {
		const { typeName, index } = params
		const newState = this.state

		// 如果当前的编辑状态属于打开状态  移除不可操作
		if (newState.Show_Modal_Edit) return message.warning('当前处于编辑状态，不能执行此操作！');
		if (typeName === 'module') {
			// 模块添加菜单
			newState.WebData.Section_Data[index].Enabled = true
		} else if (typeName === '') {
			// 菜单管理
			newState.WebData.Section_Data[index].Enabled = false
		} else if (typeName === 'Iframe' && index === null) {
			// Iframe子页面
			let { Current_Component, Current_RichId } = params
			let params_Id = Current_Component + Current_RichId + ''
			newState.WebData.Section_Data.forEach((e, i) => {
				let module_Id = e.Section_Code + e.Rich_Id + ''
				if (module_Id === params_Id) {
					e.Enabled = false
				}
			})
		}
		// 触发loading
		this.setState({ 
			Loading: true 
		}, () => {
			setTimeout(() => {
				this.setState({
					...newState
				}, () => {
					// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
					localStorage.setItem('jy-web-flag', '0')
					this.saveDataToLocalStorage()
					this.reload()
				})
			}, 500)
		})
	}
	/** 
	 * 编辑模块内容
	 * Current_Type 当前需要渲染的组件类型
	 * Current_Component 当前需要渲染的组件名称
	 * Current_RichId 富文本的Id 当组件是富文本组件时 才需要这个字段
	 * */ 
	reactEditFn(params) {
		const { Current_Component, Current_RichId } = params
		const newState = this.state
		if (newState.Current_Component === Current_Component && newState.Current_RichId !== Current_RichId) {
			// 先把组件置空 重新加载组件
			newState.Current_Component = ''
			setTimeout(() => {
				this.setState({
					Current_Component: Current_Component,
					Current_RichId: Current_RichId,
				})
			}, 0)
		} else {
			setTimeout(() => {
				this.setState({
					Current_Component: Current_Component,
					Current_RichId: Current_RichId,
				})
			}, 0)
		}

		if (!newState.Show_Modal_Edit) {
			this.reactOpenModalFn('Show_Modal_Edit')
		}
	}
	// Modules 所有编辑后 回传的整个 数据模型
	editModuleUpdate(Modules, isOpen = false, isChange = true) {
		console.log(Modules)
		const newState = this.state
		let flag = isArrayFn(Modules)
		flag ? newState.WebData.Section_Data = Modules : newState.WebData.Basic = Modules
		this.setState({
			...newState
		}, () => {
			// isChange 为false 组件编辑后 如果是点击的 取消按钮 则不改变
			if (isChange) {
				// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
				localStorage.setItem('jy-web-flag', '0')
			}
			this.saveDataToLocalStorage()
			this.reload()
			// isOpen 更新模板列表中的 官网上展示报名人数 swith 时，不需要清除当前模态框
			if (!isOpen) this.reactOpenModalFn('')
		})
	}
	/**
	 * 拖拽排序方法
	 * Section_Data 传递过来的参数 已经是处理好的 直接赋值
	 */ 
	currentSortFn(Back_Section_Data) {
		const newState = this.state
		const Section_Data = Back_Section_Data.map(e => e)

		newState.WebData.Section_Data = Section_Data
		this.setState({
			...newState
		}, () => {
			// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
			// localStorage.setItem('jy-web-flag', '0')
			this.saveDataToLocalStorage()
			this.reload()
		})
	}
	/**
	 * 更新选中模板【传递过来的参数 已经是处理好的 直接赋值】
	 */ 
	updateTemplate(Tem_List, Click_Type = 1, tempSrcPc, tempSrcMobile) {
		const newState = this.state
		Tem_List.forEach(e => {
			if (e.Is_Checked && e.Template_Type === 1) {
				newState.WebData.Temp_Path = e.Template_Path
				newState.WebData.Temp_Code = e.Template_Code
				newState.tempSrcPc = tempSrcPc
			} else if (e.Is_Checked && e.Template_Type === 2) {
				newState.WebData.App_Temp_Path = e.Template_Path
				newState.WebData.App_Temp_Code = e.Template_Code
				newState.tempSrcMobile = tempSrcMobile
			}
		})
		// 根据模板点击 来判断是 PC 还是 移动
		newState.Is_Pc_Warp = Click_Type === 1 ? true : false
		newState.WebData.Template_List = Tem_List
		newState.LoadingContent = false
		this.setState({ ...newState }, () => {
			// 状态为 0 代表当前有东西被修改了 而且没有被提交服务器
			localStorage.setItem('jy-web-flag', '0')
			this.saveDataToLocalStorage()
			this.reactOpenModalFn('')
			this.reload()
		})
	}

	// 装载富文本内容
	inSertEdit() {
		const newState = this.state
		newState.Rich_List.forEach(item1 => {
			newState.WebData.Section_Data.forEach(item2 => {
				if (item1.Rich_Id === item2.Rich_Id) {
					item2.Section_Content = item1.Rich_Content
				}
			})
		})

		this.setState({ ...newState }, () => {
			// 富文本内容赋值后
			this.saveDataToLocalStorage()
		})
	}

	// 在渲染前调用,在客户端也在服务端
	componentWillMount() {
		console.log('Component WILL MOUNT!')
		if (process.env.NODE_ENV === 'production') {
			this.setState({
					meetingId: 'af026266-3d0d-c6e9-e0a7-08d6cc87db4f',
					tempSrcPc: `https://tonyjiafan-react-editer-app.netlify.com/template/tem7/index.html`,
					tempSrcMobile: `https://tonyjiafan-react-editer-app.netlify.com/template/m007/index.html`,
			}, () => {
					window.A_react = this
					window.A_WebData = this.state.WebData
					localStorage.setItem('jy-web-richList', JSON.stringify(this.state.Rich_List))
					localStorage.setItem(`jy-web-data-${this.state.meetingId}`, JSON.stringify(this.state.WebData))
				}
			)
		} else {
			this.setState({ meetingId: 'af026266-3d0d-c6e9-e0a7-08d6cc87db4f' }, () => {
					window.A_react = this
					window.A_WebData = this.state.WebData
					localStorage.setItem('jy-web-richList', JSON.stringify(this.state.Rich_List))
					localStorage.setItem(`jy-web-data-${this.state.meetingId}`, JSON.stringify(this.state.WebData))
				}
			)
		}		
		// console.log(_this)
		// console.log(window)
	}
	componentDidMount() {
		this.setState({
			localStorageHasWebData: true,
			LoadingContent: false
		}, () => {console.log('Component WILL MOUNT!')})
		
	}
	componentWillReceiveProps(preProps, nextProps) {
		console.log(preProps)
		console.log('prePropsprePropspreProps')
		console.log(nextProps)
		console.log('nextPropsnextPropsnextProps')
	}

	render() {
		const {
			tempSrcPc,
			tempSrcMobile,
			localStorageHasWebData,
			Is_Pc_Warp,
			Mask_Edit_View_Change,
			View_Change_Style,
			Show_Modal_Template,
			Show_Modal_Edit,
			Show_Moda_Module,
			Show_Moda_Sort,
			Mask_Disabled,
			Current_RichId,
			Current_Component,
			Rich_List,
			WebData,
		} = this.state
		

		return (
			<div className="WebEditWarp">
				<div className="web_nav_top">
					<span className="back-btn btn-1">
						<img src={ `https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg` } alt="" />
						<span> 网页在线设计系统 </span>
					</span>
					{!Show_Modal_Edit && !Show_Modal_Template ? 
						(
							<div className="icon-coat">
								<Tooltip placement="bottom" title={`PC端`}>
									<span style={{ opacity: Is_Pc_Warp ? 1 : '.5', color: Is_Pc_Warp ? '#202020' : '' }} className="back-btn btn-2" onClick={ () => this.changeWarp('PC') }>
										<MyIcon style={{ marginTop: '10px', fontSize: '22px' }} type="icon-cl-icon-Computer" />
									</span>
								</Tooltip>
								<Tooltip placement="bottom" title={`移动端`}>
									<span style={{ opacity: !Is_Pc_Warp ? 1 : '.5', color: !Is_Pc_Warp ? '#202020' : '' }} className="back-btn btn-3" onClick={ () => this.changeWarp('Mobile') }>
										<MyIcon style={{ marginTop: '10px', fontSize: '22px' }} type="icon-cl-icon-Mobile" />
									</span>
								</Tooltip>
							</div>
						) : null
					}
					<div className="btn-4-coat"></div>
				</div>
				<div className="web_main_content">
					<div className="left_menu">
						<div className="left_item" onClick={ () => this.reactOpenModalFn('Show_Modal_Template') } style={{ background: Show_Modal_Template ? '#ff5200' : '' }}>
							<MyIcon style={{fontSize: '30px', color: Show_Modal_Template ? '#fff' : '' , marginTop: '10px'}} type="icon-layout-line" />
							<br/>
							<span style={{ color: Show_Modal_Template ? '#fff' : '' }}>网站模板</span>
						</div>
						<div className="left_item" onClick={ () => this.reactOpenModalFn('Show_Moda_Module') } style={{ background: Show_Moda_Module ? '#ff5200' : '' }}>
							<MyIcon style={{ fontSize: '30px', color: Show_Moda_Module ? '#fff' : '' , marginTop: '10px'}} type="icon-apps" />
							<br/>
							<span style={{ color: Show_Moda_Module ? '#fff' : '' }}>模块添加</span>
						</div>
						<div className="left_item" onClick={ () => this.reactOpenModalFn('Show_Moda_Sort') } style={{ background: Show_Moda_Sort ? '#ff5200' : '' }}>
							<MyIcon style={{ fontSize: '30px', color: Show_Moda_Sort ? '#fff' : '' , marginTop: '10px'}} type="icon-menu" />
							<br/>
							<span style={{ color: Show_Moda_Sort ? '#fff' : '' }}>菜单管理</span>
						</div>
						<div className="left_item" onClick={ () => this.goBackList() }>
							<MyIcon style={{ fontSize: '30px', marginTop: '10px' }} type="icon-rollback" />
							<br/>
							<span>返回管理</span>
						</div>
						{ Show_Modal_Edit || Mask_Disabled ? (
							<div className="left-menu-mask"></div>
						) :null }
						
					</div>
					<div className="right_content">
						{localStorageHasWebData && Is_Pc_Warp ? (
							<iframe
								title="pc"
								className="web_pc_iframe"
								src={ `${tempSrcPc}?${this.state.meetingId}` }
								name="prewWebsite"
								id="prewWebsite"
								frameBorder="0"
								scrolling="yes" />
						) : (localStorageHasWebData && !Is_Pc_Warp ? (
								<div className="web-phone-warp" 
									style={{ left: !Mask_Edit_View_Change ? '-25%' : '0px' }}>
									<div className="web-phone-content">
										<p className="phone_title">{ WebData.Basic.Meeting_Name }</p>
										<div className="conten-box">
											<iframe
												title="mobile"
												src={ `${tempSrcMobile}?${this.state.meetingId}` }
												name="prewWebsite" 
												id="prewWebsite"
												frameBorder="0" 
												scrolling="yes" 
												style={{ width: '100%', height: '100%', background: '#fff' }} />
										</div>
									</div>
									<img className="web-phone-bg" src={ phoneImg } alt="" />  
								</div>
							) : null)
						}
						{this.state.LoadingContent ? (
							<div className="noneContent">
								<SpinComponent 
									color={ `#0d6cff` } 
									iconType={ `ellipsis` } 
									wrapperClassName={ `noneContent` } 
									spinning={ this.state.LoadingContent } />
							</div>
						) : null}
					</div>
					
					{Show_Modal_Template ? (
							<div className="modal-mask-template">
								<div className="modal-content-template" >
									<Suspense fallback={<LazySpin />}>
										<TemplateList
										Template_List={ WebData.Template_List }
										Basic={ WebData.Basic }
										updateTemplate={ this.updateTemplate }
										editModuleUpdate={ this.editModuleUpdate } />
									</Suspense>
								</div>
							</div>
						) : 
						null
					}
					{Show_Modal_Edit ? (
							<div className="modal-mask-edit" style={ !Mask_Edit_View_Change ? View_Change_Style : null }>
								<div className="modal-content" style={{ width: Mask_Edit_View_Change ? '900px' : '100%' }}>
									<label className="change-icon" onClick={ () => this.setState({ Mask_Edit_View_Change: !Mask_Edit_View_Change }) }>
										切换视图
									</label>
									<h1>  编辑 {Current_Component} 业务组件   </h1>
									
									<Suspense fallback={ <LazySpin /> }>
										{/* 自定义 */}
										{Current_Component === 'Custom' ? (
											<Custom
												Is_Pc_Warp={ Is_Pc_Warp }
												Section_Data={ WebData.Section_Data } 
												Basic={ WebData.Basic }
												Current_RichId={ Current_RichId }
												Current_Component={ Current_Component }
												Rich_List={ Rich_List }
												editModuleUpdate={ this.editModuleUpdate }
												richListUpdate={ this.richListUpdate } />
											) : null
										}
										{/* 活动介绍 */}
										{Current_Component === 'Introduction' ? (
											<Introduction
												Is_Pc_Warp={ Is_Pc_Warp }
												Section_Data={ WebData.Section_Data } 
												Basic={ WebData.Basic }
												Current_RichId={ Current_RichId }
												Current_Component={ Current_Component }
												Rich_List={ Rich_List }
												editModuleUpdate={ this.editModuleUpdate }
												richListUpdate={ this.richListUpdate } />
											) : null
										}
									</Suspense>

									<Button onClick={ () => this.reactCancelForm() }> 退出编辑 </Button>
								</div>
							</div>
						) : 
						null
					}
					{Show_Moda_Module ? (
							<div className="modal-mask-add-module">
								<div className="modal-content">
									<Suspense fallback={<LazySpin />}>
										<ModuleList 
										Module_List={ WebData.Section_Data}
										reactEnabled={ this.reactEnabledFn }
										reactDelete={ this.reactDeleteFn } />
									</Suspense>
								</div>
							</div>
						) : 
						null
					}
					{Show_Moda_Sort ? (
							<div className="modal-mask-sort">
								<div className="modal-content">
									<Suspense fallback={<LazySpin />}>
										<SortMenu 
										reactEnabled={ this.reactEnabledFn }
										currentSort={ this.currentSortFn } 
										Section_Data={ WebData.Section_Data } />
									</Suspense>
								</div>
							</div>
						) : 
						null
					}
				</div>
				{this.state.Loading ? (
					<div className="spinWarp">
						<SpinComponent 
							color={ `#0d6cff` } 
							iconType={ `more` } 
							wrapperClassName={ `spinWarp` } 
							spinning={ this.state.Loading } />
					</div>
				) : null}
			</div>
		)
	}
}

export default WebEditWarp;
