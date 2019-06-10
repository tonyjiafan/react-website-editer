import React, { Component } from 'react';
import { Switch, Icon } from 'antd';
import { cloneObj } from '../../../libs/filters';

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
        const _this = this
        const newState = _this.state
        const { Template_List, Basic } = data || _this.props
        newState.Tem_List = Template_List.map(e => Object.assign(e, {Click_Type: e.Template_Type}))
        newState.Current_Data = cloneObj(Basic)
        newState.Old_Data = cloneObj(Basic)

        _this.setState({
            ...newState
        }, () => {
            console.log(_this.state)
        })
    }

    componentWillMount() {
        const _this = this
        _this.settingData()
    }
    componentDidMount(nextProps) {
        const _this = this
        _this.settingData(nextProps)
    }


    render() {
        const _this = this
        console.log(_this.props)
        const { 
            TemplateWeb,
            TemplateTraditional,
            TemplateMobile,
            TemplateModern,
        } = _this.state


        return (
            <div className="web_module_warp">
                <div className="template-settings">
                    <div className="web_module_title">
                        模板适用范围
                        <label onClick={ () => _this.closeModuleWarp }>
                            <Icon className="close" type="ios-close-empty" size="40"></Icon>
                        </label>
                    </div>
                    <div className="item_list">
                        <div onClick={ () => _this.tempChange('TemplateWeb', 1) } 
                            className={ TemplateWeb ? 'li active' : 'li' } 
                            style={{
                                borderColor: TemplateWeb ? '#2d8cf0' : '',
                                background: TemplateWeb ? '#eff6ff' : '',
                            }}>
                            <Icon style={{ verticalAlign: '-1px', size: '16px' }} type="monitor" ></Icon>
                            <span>网页端</span>
                        </div>
                        <div onClick={ () => _this.tempChange('TemplateMobile', 1) } 
                            className={ TemplateMobile ? 'li active' : 'li' } 
                            style={{
                                borderColor: TemplateMobile ? '#2d8cf0' : '',
                                background: TemplateMobile ? '#eff6ff' : '',
                            }}>
                            <Icon style={{ verticalAlign: '-1px', size: '16px' }} type="iphone" ></Icon>
                            <span>移动端</span>
                        </div>
                    </div>
                    <p className="tips">系统会默认选择一个网页端模版，移动端仅是针对网页端进行适配</p>

                    <div v-if="TemplateMobile" style={{ marginBottom: '14px' }}>
                        <div className="web_module_title_1">
                            网站风格
                        </div>

                        <div className="item_list">
                            <div onClick={ () => _this.tempChange('TemplateTraditional', 2) } 
                                className={ TemplateTraditional ? 'li active' : 'li' } 
                                style={{
                                    height: '30px',
                                    lineHeight: '30px',
                                    borderColor: TemplateTraditional ? '#2d8cf0' : '',
                                    color: TemplateTraditional ? '#444' : '',
                                }}>
                                <Icon style={{ verticalAlign: '-2px', size: '18px' }} type="social-twitch-outline" ></Icon>
                                <span>传统</span>
                            </div>

                            <div onClick={ () => _this.tempChange('TemplateModern', 2) } 
                                className={ TemplateModern ? 'li active' : 'li' } 
                                style={{ 
                                    height: '30px',
                                    lineHeight: '30px',
                                    borderColor: TemplateModern ? '#2d8cf0' : '',
                                    color: TemplateModern ? '#444' : '',
                                }}>
                                <Icon style={{ verticalAlign: '-2px', size: '18px' }} type="social-pinterest-outline" ></Icon>
                                <span>现代</span>
                            </div>
                        </div>
                    </div>


                    <div className="web_module_title">
                        其它设置
                    </div>
                    <div className="swith-box">
                        <div style={{ paddingTop: '10px' }}>
                            <span style={{ marginLeft: '10px' }}>官网上展示报名人数:</span>
                            <Switch 
                            size="default"
                            className="swith_ls"
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            defaultChecked={ _this.state.Current_Data.Show_Enroll_Count }
                            onChange={ () => _this.change('Open_Enroll_Face') }
                            />
                        </div>
                        <div style={{ paddingTop: '14px' }}>
                            <span style={{ marginLeft: '10px' }}>头图上展示基本信息:</span>
                            <Switch 
                            size="default"
                            className="swith_ls"
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            defaultChecked={ _this.state.Current_Data.Whether_To_Display_Basic }
                            onChange={ () => _this.change('Whether_To_Display_Basic') }
                            />
                        </div>
                        <div style={{ paddingTop: '14px' }}>
                            <span style={{ marginLeft: '10px' }}>电子票展示版权信息:</span>
                            <Switch 
                            size="default"
                            className="swith_ls"
                            checkedChildren="开" 
                            unCheckedChildren="关" 
                            defaultChecked={ _this.state.Current_Data.Show_Ticket_Copyright }
                            onChange={ () => _this.change('Show_Ticket_Copyright') }
                            />
                        </div>
                    </div>
                </div>
                <div className="template-view">

                    {
                        TemplateWeb ? (
                            <div className="tem_li_pc">
                                <div style={{ margin: 'auto' }}>
                                    {_this.state.Tem_List.map(item => 
                                        item.Template_Type === 1 ? (
                                            <div 
                                                key={ item.Template_Code }
                                                className={ item.Is_Checked ? 'li active' : 'li' }
                                                onClick={ () => _this.changeTemp(item) }>
                                                <div className="tem_w">
                                                    <img className="view" src={ item.Template_Thumbnail } alt="" />
                                                    {item.Is_Checked ? 
                                                        (
                                                            <span className="over">
                                                                <Icon className="icon" type="checkmark" />
                                                                当前选择
                                                            </span>
                                                        ) : null }
                                                </div>
                                                <div className="text_left">
                                                    <span style={{ dispaly: !item.Is_Checked ? 'block' : 'none' }}>
                                                        点击模版使用
                                                        <Icon className="icon" type="android-arrow-dropright-circle"></Icon>
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
                                        _this.state.Tem_List.map(item => 
                                            item.Template_Type === 2 && item.App_Temp_Type === 1 ? (
                                                <div 
                                                    key={ item.Template_Code }
                                                    className={ item.Is_Checked ? 'li active' : 'li' }
                                                    onClick="changeTemp(item)">
                                                    <div className="tem_p">
                                                        <img className="view" src={item.Template_Thumbnail} alt="" />
                                                        {
                                                            item.Is_Checked ? (
                                                                <span className="over">
                                                                    <Icon className="icon" type="checkmark"></Icon>
                                                                    当前选择
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div className="text_left" style={{ textIndent: '10px' }}>
                                                        <span style={{ dispaly: !item.Is_Checked ? 'block' : 'none' }}>
                                                            点击模版使用
                                                            <Icon className="icon" type="android-arrow-dropright-circle"></Icon>
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
                                        _this.state.Tem_List.map(item => 
                                            item.Template_Type === 2 && item.App_Temp_Type === 2 ? (
                                                <div 
                                                    key={ item.Template_Code }
                                                    className={ item.Is_Checked ? 'li active' : 'li' }
                                                    onClick={ () => _this.changeTemp(item) }>
                                                    <div className="tem_p">
                                                        <img className="view" src={item.Template_Thumbnail} alt="" />
                                                        {
                                                            item.Is_Checked ? (
                                                                <span className="over">
                                                                    <Icon className="icon" type="checkmark"></Icon>
                                                                    当前选择
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div className="text_left" style={{ textIndent: '10px' }}>
                                                        <span style={{ dispaly: !item.Is_Checked ? 'block' : 'none' }}>
                                                            点击模版使用
                                                            <Icon className="icon" type="android-arrow-dropright-circle"></Icon>
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