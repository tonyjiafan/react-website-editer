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
	}

	// 获取栏目列表
	settingData() {
		const _this = this
		const {
			Section_Data
		} = _this.props
		let menus = []
		menus = Section_Data.map(e => Object.assign(e))

		_this.setState({
			Menus: menus
		})
	}

	componentWillMount() {
		console.log(this.props)
		this.settingData()
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
                                                <MyIcon className="hover-icon" style={{ fontSize: '21px'}} type="icon-trash-alt" />
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
