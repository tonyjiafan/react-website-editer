import React, {
	Component
} from 'react';

import './ModuleList.less';

import {
	Icon,
	Modal,
	// Button,
	message
} from 'antd';

class ModuleList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			moudels: [],
		}

		this.settingData = this.settingData.bind(this) //初始设置
	}

	// 设置初始数据
	settingData(data) {
		const newState = this.state

		newState.moudels = data || this.props.Module_List.map(e => e)
		this.setState({
			...newState
		}, () => {
			// console.dir('传递进来的菜单顺序 :')
			// console.dir(this.state.menus)
		})
	}
	// 关闭菜单
    closeModuleWarp() {
        const parentThis = window.A_react
        parentThis.setState({
            Show_Moda_Module: false
        })
    }
	// 开启模块使用  module参数代表 来自哪个菜单的操作
	changeEnabled(Enabled, index) {
		// 模块没有开启才能添加
		if (!Enabled) { 
			this.props.reactEnabled({ index: index, typeName: 'module' })
		}
	}
	// 彻底删除 自定义 模块
	reactDeleteModule(index, Rich_Id) {
		const confirm = Modal.confirm
		const moudels = this.state.moudels.map(e => e)
		confirm({
			title: '删除',
			content: '模块删除后无法恢复，确定要删除吗？',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				message.loading('正在执行中...', 2)
    			.then(() => {
					moudels.splice(index, 1)
					message.success('删除成功！', 1)
					setTimeout(() => {
						this.props.reactDelete(moudels)
					}, 500)
				})
			},
			onCancel() {
				message.info('取消操作了！')
			}
		})
	}

	// 唤醒菜单
	changeCurrentView() {
		const parentThis = window.A_react
		let params = {
			Current_Type: 8,
			Current_Component: 'Custom',
			Current_RichId: 'NewRich',
		}

		parentThis.reactEditFn(params)
	}

	componentWillMount() {
		console.log(this.props)
		this.settingData()
	}
    componentWillReceiveProps(nextProps) {
        this.settingData(nextProps.Module_List)
    }

	render() {
		return (
			<div className="web_module_warp">
				<div className="web_module_title">
					系统模块
					<label onClick={ () => this.closeModuleWarp() }>
						<Icon className="close" style={{ fontSize: '20px'}} type="close" />
					</label>
				</div>
				<ul className="padd" style={{ padding: "10px" }}>
					{this.state.moudels.map((item, index) => 
						item && item.Section_Type !== 8 ? 
						(<li 
							key={ index }
							onClick={ () => this.changeEnabled(item.Enabled, index) }
							className={ item.Enabled ? 'li disabled hover' : 'li li-nomar-hover' }>
							{
								item.Section_Code === 'Guest' ? 
								<Icon className="li-icon" type="user" style={{ fontSize: "32px" }} /> : (
									item.Section_Code === 'Partner' ?
									<Icon className="li-icon" type="usergroup-add" style={{ fontSize: "32px" }} /> :
									(
										item.Section_Code === 'Introduction' ?
										<Icon className="li-icon" type="project" style={{ fontSize: "32px" }} /> :
										(
											item.Section_Code === 'Schedule' ?
											<Icon className="li-icon" type="dashboard" style={{ fontSize: "32px" }} /> :
											(
												item.Section_Code === 'Reception' ?
												<Icon className="li-icon" type="wifi" style={{ fontSize: "32px" }} /> : 
												(
													item.Section_Code === 'Guide' ?
													<Icon className="li-icon" type="build" style={{ fontSize: "32px" }} /> :
													(
														item.Section_Code === 'News' ?
														<Icon className="li-icon" type="link" style={{ fontSize: "32px" }} /> : null
													)
												)
											)
										)
									)
								)
							}
							<div className="ti">{ item.Section_Name }</div>
								{ item.Enabled ? <div className="hover_block">该模块已存在</div> : null }
							</li>
						) : null
					)}
					<div className="clear"></div>
				</ul>

				<div className="web_module_title">
					添加自定义模块
				</div>
				<ul className="padd" style={{ padding: "10px" }}>
					<li className="li li-nomar-hover" onClick={ this.changeCurrentView }>
						<Icon className="li-icon" type="container" style={{ fontSize: "32px" }} />
						<div className="ti">文本编辑</div>
					</li>
					<div className="clear"></div>
				</ul>

				<div className="web_module_title">
					自定义模块管理
				</div>

				<ul className="customize_modules" style={{ padding: "10px" }}>
					{this.state.moudels.map((item, index) => {
						return (
								item.Section_Type === 8 ? 
								(<li 
									key={ item.Rich_Id }
									className={ item.Enabled ? "li disabled hover" : "li" }
									style={{ 
										borderColor: item.Enabled ? "" : "#9E9E9E" ,
										background: item.Enabled ? "" : "#fff" ,
									}}>
									<div className="ti">{ item.Section_Name }</div>
									{ item.Enabled ? <div className="hover_block">该模块已存在</div> : <div className="del-btn" onClick={ () => this.reactDeleteModule(index, item.Rich_Id) }>删除</div> }
									{ !item.Enabled ? <div className="just-btn" onClick={ () => this.changeEnabled(item.Enabled, index) }>使用模块</div> : null }
								</li>
								) : null
							)
						})
					}
					<div className="clear"></div>
				</ul>
			</div>
		)
	}
}


export default ModuleList;
