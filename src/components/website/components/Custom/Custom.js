import React, { Component, Suspense } from 'react';
import {
    message,
    Form,
    Input,
    Button
} from 'antd';
import LazySpin from '../../../common/lazySpin';
import { cloneObj, replaceEditorContent} from '../../../../libs/filters';
import './Custom.less';

const Editer = React.lazy(() =>
    import ('../../../common/editer'));

const formItemLayout = {
    labelCol: {
        span: 3
    },
    wrapperCol: {
        span: 21
    }
}
const formTailLayout = {
    labelCol: {
        span: 3
    },
    wrapperCol: {
        span: 4,
        offset: 18
    }
}

class CustomForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Modules_Data: [], // 拷贝的模型
            Old_Modules_Data: [], // 拷贝的模型
            Current_Data: {}, // 拷贝后，提取的当前模块的模型
            Current_Rich_List: [], // 拷贝的 富文本列表
            Old_Rich_List: [], // 拷贝的 富文本列表
        }
        this.updateContent = this.updateContent.bind(this)
    }

    componentDidMount() {
        const _this = this
        _this.settingData()
        // console.log(_this.props)
    }

    componentWillReceiveProps(nextProps) {
        const _this = this
        _this.settingData(nextProps)
    }

    // 处理数据模型
    settingData(data) {
        const _this = this
        const newCloneObj = _this.state
        const {
            Section_Data,
            Current_Component,
            Current_RichId,
            Rich_List
        } = data || _this.props
        newCloneObj.Modules_Data = cloneObj(Section_Data)
        newCloneObj.Old_Modules_Data = cloneObj(Section_Data)
        newCloneObj.Current_Rich_List = cloneObj(Rich_List)
        newCloneObj.Old_Rich_List = cloneObj(Rich_List)

        _this.setState({ ...newCloneObj
        }, () => {
            const newState = _this.state
            // 新增自定义
            if (Current_RichId === 'NewRich') {
                newState.Current_Data = {
                    Enabled: false,
                    Is_Custom: true,
                    Is_Rich: true,
                    Rich_Id: '',
                    Section_Code: 'Custom',
                    Section_Content: '',
                    Section_Name: '自定义',
                    Section_Type: 8,
                }
            } else {
                newState.Modules_Data.forEach(e => {
                    // Rich_Id 有值代表是修改
                    if (e.Section_Code === Current_Component && e.Rich_Id === Current_RichId) {
                        newState.Current_Data = e
                    }
                })
            }
            _this.setState({ ...newState
            }, () => {
                // 获取当前的富文本内容
                _this.getContent()
            })
        })
    }
    // 获取富文本的内容
    getContent() {
        const _this = this
        const newState = _this.state
        if (newState.Current_Data.Rich_Id && newState.Current_Data.Rich_Id !== '') {
            newState.Current_Rich_List.forEach(e => {
                if (e.Rich_Id === newState.Current_Data.Rich_Id) {
                    newState.Current_Data.Section_Content = e.Rich_Content
                }
            })
        }
        _this.setState({ ...newState
        })
    }
    // 往当前的 Modules_Data 中插入新增的 富文本
    editorInModules(Rich_Content, Rich_Id, Section_Name) {
        const _this = this
        const newState = _this.state
        const {
            Current_Data
        } = newState

        newState.Current_Data.Enabled = true
        newState.Current_Data.Section_Name = Section_Name
        // 将当前编辑模块 插入整体列表中
        newState.Modules_Data.concat([Current_Data])
        // 将编辑的富文本 整理好
        newState.Current_Rich_List.concat(
            [{
                Rich_Content,
                Rich_Id
            }]
        )
        _this.setState({ ...newState
        }, () => {
            // 更新 父组件的 整个 Section_Data 和 父组件的 Rich_List 
            _this.props.editModuleUpdate(_this.state.Modules_Data)
            _this.props.richListUpdate(_this.state.Current_Rich_List)
        })
    }
    // 修改当前富文本列表中的内容
    editorUpdate(Rich_Content, Rich_Id, Section_Name) {
        const _this = this
        const newState = _this.state
        // 更新 当前整个 Current_Rich_List
        newState.Current_Rich_List.forEach(e => {
            if (e.Rich_Id === Rich_Id) {
                e.Rich_Content = Rich_Content
            }
        })
        newState.Modules_Data.forEach(e => {
            if (e.Section_Type === 8 && e.Rich_Id === Rich_Id) {
                e.Section_Name = Section_Name
            }
        })
        _this.setState({ ...newState
        }, () => {
            // 更新 父组件的 整个 Section_Data 和 父组件的 Rich_List 
            _this.props.editModuleUpdate(_this.state.Modules_Data)
            _this.props.richListUpdate(_this.state.Current_Rich_List)
        })
    }
    updateContent(Content) {
        const newState = this.state
        newState.Current_Data.Section_Content = Content
        this.setState({ ...newState
        })
    }
    // 取消编辑
    cancelForm = () => {
        const _this = this
        const parentThis = window.A_vue
        const {
            Old_Modules_Data,
            Old_Rich_List
        } = _this.state

        // 更新 父组件的 整个 Section_Data 和 父组件的 Rich_List 
        _this.props.editModuleUpdate(Old_Modules_Data, false, false)
        _this.props.richListUpdate(Old_Rich_List)
        parentThis.vueCancelForm()
    }

    submit = () => {
        this.props.form.validateFields(err => {
            const formValue = this.props.form.getFieldsValue()
            if (formValue.Section_Name.length > 10) return message.warning('模块名称不能超过10个字符！')

            if (!err) {
                const _this = this
                const newState = _this.state
                // 处理富文本内容 （replaceEditorContent 处理富文本json的放方法）
                let editorStr = replaceEditorContent(newState.Current_Data.Section_Content)

                // 验证截取后的富文本是不是空内容
                if (editorStr === '' || editorStr == null) {
                    message.info('请先编辑点什么吧!')
                } else {
                    const {
                        Rich_Id
                    } = newState.Current_Data
                    newState.Current_Data.Section_Content = editorStr
                    // 判断是修改 还是 新增-false 修改-true
                    if (!Rich_Id) {
                        // 给当前模块对象 赋值
                        newState.Current_Data.Rich_Id = `Rich_Id-${Date.now()}`
                        _this.setState({ ...newState
                        }, () => {
                            _this.editorInModules(_this.state.Current_Data.Section_Content, _this.state.Current_Data.Rich_Id, formValue.Section_Name)
                        })
                    } else {
                        _this.setState({ ...newState
                        }, () => {
                            _this.editorUpdate(_this.state.Current_Data.Section_Content, _this.state.Current_Data.Rich_Id, formValue.Section_Name)
                        })
                    }
                    message.success('提交成功！')
                }
            } else {
                message.warning('请填写模块名称！')
            }
        })
    }


    render() {
        const _this = this
        const {
            getFieldDecorator
        } = _this.props.form

        return (
            <div className="Custom">
                {
                    _this.state.Current_Data.Section_Type === 8 ? (
                    <div className="">
                        <Form.Item {...formItemLayout} label="模块名称">
                            {getFieldDecorator('Section_Name', {
                                rules: [{
                                    required: true,
                                    message: '请填写',
                                }],
                                initialValue: _this.state.Current_Data.Section_Name
                            })(<Input placeholder="请填写模块名称" />)}
                        </Form.Item>
                        <div className="edit-coat">
                            <Suspense fallback={<LazySpin />} >
                                <Editer updateContent={ _this.updateContent } Section_Content={ _this.state.Current_Data.Section_Content } />
                            </Suspense>
                        </div>
                        <Form.Item {...formTailLayout}>
                            <Button type="ghost" onClick={ _this.cancelForm } style={{ marginRight: 20 }}>取消</Button>
                            <Button type="primary" onClick={ _this.submit }>保存</Button>
                        </Form.Item>
                    </div>
                  ) : null
                }
            </div>
        )
    }
}

const Custom = Form.create({
    name: 'dynamic_rule'
})(CustomForm)

export default Custom;
