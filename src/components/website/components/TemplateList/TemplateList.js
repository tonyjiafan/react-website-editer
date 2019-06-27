import React, { Component } from 'react';
import { Switch, Icon, message } from 'antd';
import MyIcon from '../../../common/myIcon';
import { cloneObj } from '../../../../libs/filters';
import './TemplateList.less';

class TemplateList extends Component{ 
    constructor(props) {
        super(props);
        this.state = {
            meetingId: '',
            Tem_List: [],
            TemplateWeb: true,
            TemplateMobile: false,
            TemplateTraditional: true,
            TemplateModern: false,
            Current_Data: {}, // 拷贝后，提取的当前模块的模型
			Old_Data: {}, // 拷贝后，提取的当前模块的模型(取消操作是使用)
        };
    }

    settingData(data) {
        const newState = this.state
        const { Template_List, Basic } = data || this.props
        newState.Tem_List = Template_List.map(e => Object.assign(e, {Click_Type: e.Template_Type}))
        newState.Current_Data = cloneObj(Basic)
        newState.Old_Data = cloneObj(Basic)

        this.setState({
            ...newState
        }, () => {
            console.log(this.state)
        })
    }
    // 更新模板选择
    changeTemp(item) {
        const Tem_List = this.state.Tem_List.map(e => e)
        const { Template_Type, Template_Code, Is_Checked } = item

        if (Is_Checked) {
            message.info('当前已选中，请勿重复选择！')
        } else {
            let tempSrcPc = ''
            let tempSrcMobile = ''
            Tem_List.forEach(e => {
                if (e.Template_Type === Template_Type && e.Template_Code === Template_Code) {
                    e.Is_Checked = true
                    if (process.env.NODE_ENV === 'production') {
                        e.Template_Type === 1 ? tempSrcPc = e.Prd_Url : tempSrcMobile = e.Prd_Url
                    } else {
                        e.Template_Type === 1 ? tempSrcPc = e.Dev_Url : tempSrcMobile = e.Dev_Url
                    }
                    
                } else if (e.Template_Type === Template_Type && e.Template_Code !== Template_Code) {
                    e.Is_Checked = false
                }
            })
            this.props.updateTemplate(Tem_List, item.Click_Type, tempSrcPc, tempSrcMobile)
        }
    }
    // PC 移动端  模板容器切换
    tempChange(params, num) {
        const newState = this.state
        let str = num === 1 ? ['TemplateWeb', 'TemplateMobile'] : ['TemplateModern', 'TemplateTraditional']
        str.forEach((e) => {
            if (e === params) {
                newState[params] = true
            } else {
                newState[e] = false
            }
        })
        this.setState({
            ...newState
        })
    }
    // 关闭菜单
    closeModuleWarp() {
        const parentThis = window.A_react
        parentThis.setState({
            Show_Modal_Template: false
        })
    }
    change(name, checked) {
        const newState = this.state
        newState.Current_Data[name] = !checked
        this.setState({
            ...newState
        }, () => {
            // 更新 父组件的 整个 Basic
            this.props.editModuleUpdate(this.state.Current_Data, true)
        })
    }


    componentWillMount() {
        this.settingData()
    }
    componentDidMount(nextProps) {
        this.settingData(nextProps)
    }

    render() {
        const { 
            TemplateWeb,
            TemplateTraditional,
            TemplateMobile,
            TemplateModern,
        } = this.state

        return (
            <div className="web_module_warp">
                <div className="template-settings">
                    <div className="web_module_title">
                        模板适用范围
                        <label onClick={ () => this.closeModuleWarp() }>
                            <Icon className="close" type="close" style={{fontSize: '20px'}} />
                        </label>
                    </div>
                    <div className="item_list">
                        <div onClick={ () => this.tempChange('TemplateWeb', 1) } 
                            className={ TemplateWeb ? 'li active' : 'li' } 
                            style={{
                                borderColor: TemplateWeb ? '#2d8cf0' : '',
                                background: TemplateWeb ? '#eff6ff' : '',
                            }}>
                            <MyIcon style={{ verticalAlign: '-2px', size: '16px' }} type="icon-monitor" />
                            <span>网页端</span>
                        </div>
                        <div onClick={ () => this.tempChange('TemplateMobile', 1) } 
                            className={ TemplateMobile ? 'li active' : 'li' } 
                            style={{
                                borderColor: TemplateMobile ? '#2d8cf0' : '',
                                background: TemplateMobile ? '#eff6ff' : '',
                            }}>
                            <MyIcon style={{ verticalAlign: '-2px', size: '16px' }} type="icon-mobile-android" />
                            <span>移动端</span>
                        </div>
                    </div>
                    <p className="tips">系统会默认选择一个网页端模版，移动端仅是针对网页端进行适配</p>

                    {
                        TemplateMobile ? (
                            <div style={{ marginBottom: '14px' }}>
                                <div className="web_module_title_1">
                                    网站风格
                                </div>
                                <div className="item_list">
                                    <div onClick={ () => this.tempChange('TemplateTraditional', 2) } 
                                        className={ TemplateTraditional ? 'li active' : 'li' } 
                                        style={{
                                            height: '30px',
                                            lineHeight: '30px',
                                            borderColor: TemplateTraditional ? '#2d8cf0' : '',
                                            color: TemplateTraditional ? '#444' : '',
                                        }}>
                                        <MyIcon style={{ verticalAlign: '-2px', size: '18px', marginRight: '2px', color: TemplateTraditional ? '#2d8cf0' : '#999' }} type="icon-liebiao" />
                                        <span>传统</span>
                                    </div>

                                    <div onClick={ () => this.tempChange('TemplateModern', 2) } 
                                        className={ TemplateModern ? 'li active' : 'li' } 
                                        style={{ 
                                            height: '30px',
                                            lineHeight: '30px',
                                            borderColor: TemplateModern ? '#2d8cf0' : '',
                                            color: TemplateModern ? '#444' : '',
                                        }}>
                                        <MyIcon style={{ verticalAlign: '-2px', size: '18px', marginRight: '2px', color: TemplateModern ? '#2d8cf0' : '#999' }} type="icon-apps" />
                                        <span>现代</span>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    
                    <div className="web_module_title">
                        其它设置
                    </div>
                    <div className="swith-box">
                        <div style={{ paddingTop: '10px' }}>
                            <span style={{ marginLeft: '10px' }}>网站上展示报名人数:</span>
                            <Switch 
                            size="default"
                            className="swith_ls"
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            checked={ this.state.Current_Data.Show_Enroll_Count }
                            onChange={ () => this.change('Show_Enroll_Count', this.state.Current_Data.Show_Enroll_Count) }
                            />
                        </div>
                        <div style={{ paddingTop: '14px' }}>
                            <span style={{ marginLeft: '10px' }}>横幅上展示基本信息:</span>
                            <Switch 
                            size="default"
                            className="swith_ls"
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            checked={ this.state.Current_Data.Whether_To_Display_Basic }
                            onChange={ () => this.change('Whether_To_Display_Basic', this.state.Current_Data.Whether_To_Display_Basic) }
                            />
                        </div>
                        <div style={{ paddingTop: '14px' }}>
                            <span style={{ marginLeft: '10px' }}>页面上展示版权信息:</span>
                            <Switch 
                            size="default"
                            className="swith_ls"
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            disabled={true}
                            checked={ this.state.Current_Data.Show_Ticket_Copyright }
                            onChange={ () => this.change('Show_Ticket_Copyright', this.state.Current_Data.Show_Ticket_Copyright) }
                            />
                        </div>
                    </div>
                </div>
                <div className="template-view">
                    {
                        TemplateWeb ? (
                            <div className="tem_li_pc">
                                <div style={{ margin: 'auto' }}>
                                    {this.state.Tem_List.map(item => 
                                        item.Template_Type === 1 ? (
                                            <div 
                                                key={ item.Template_Code }
                                                className={ item.Is_Checked ? 'li active' : 'li' }
                                                onClick={ () => this.changeTemp(item) }>
                                                <div className="tem_w">
                                                    <img className="view" src={ item.Template_Thumbnail } alt="" />
                                                    {item.Is_Checked ? 
                                                        (
                                                            <span className="over">
                                                                <Icon className="icon" type="check" />
                                                                当前选择
                                                            </span>
                                                        ) : null }
                                                </div>
                                                <div className="text_left">
                                                    <span className="span" style={{ dispaly: !item.Is_Checked ? 'block' : 'none' }}>
                                                        点击模版使用
                                                        <Icon className="icon" type="check-circle" />
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null 
                                    )}
                                </div>
                            </div>
                        ) : null 
                    }

                    {
                        TemplateMobile && TemplateTraditional ? (
                            <div className="tem_li_phone">
                                <div style={{ margin: 'auto' }}>
                                    {
                                        this.state.Tem_List.map(item => 
                                            item.Template_Type === 2 && item.App_Temp_Type === 1 ? (
                                                <div 
                                                    key={ item.Template_Code }
                                                    className={ item.Is_Checked ? 'li active' : 'li' }
                                                    onClick={ () => this.changeTemp(item) }>
                                                    <div className="tem_p">
                                                        <img className="view" src={item.Template_Thumbnail} alt="" />
                                                        {
                                                            item.Is_Checked ? (
                                                                <span className="over">
                                                                    <Icon className="icon" type="check" />
                                                                    当前选择
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div className="text_left" style={{ textIndent: '10px' }}>
                                                        <span className="span" style={{ dispaly: !item.Is_Checked ? 'block' : 'none' }}>
                                                            点击模版使用
                                                            <Icon className="icon" type="check-circle" />
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null  
                                        )
                                    }
                                </div>
                            </div>
                        ) : null
                    }

                    {
                        TemplateMobile && TemplateModern ? (
                            <div className="tem_li_phone">
                                <div style={{ margin: 'auto' }}>
                                    {
                                        this.state.Tem_List.map(item => 
                                            item.Template_Type === 2 && item.App_Temp_Type === 2 ? (
                                                <div 
                                                    key={ item.Template_Code }
                                                    className={ item.Is_Checked ? 'li active' : 'li' }
                                                    onClick={ () => this.changeTemp(item) }>
                                                    <div className="tem_p">
                                                        <img className="view" src={item.Template_Thumbnail} alt="" />
                                                        {
                                                            item.Is_Checked ? (
                                                                <span className="over">
                                                                    <Icon className="icon" type="check" />
                                                                    当前选择
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div className="text_left" style={{ textIndent: '10px' }}>
                                                        <span className="span" style={{ dispaly: !item.Is_Checked ? 'block' : 'none' }}>
                                                            点击模版使用
                                                            <Icon className="icon" type="check-circle" />
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null  
                                        )
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                </div>
                <div className="clear"></div>
            </div>
        )
    }
}

export default TemplateList;