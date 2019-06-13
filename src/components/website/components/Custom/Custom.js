import React, { Component, Suspense } from 'react';
import { message, Form, Input, Button } from 'antd';
import LazySpin from '../../../common/lazySpin';
const Editer = React.lazy(() => import('../../../common/editer'));

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
}
const formTailLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 17, offset: 3}
}

class CustomForm extends Component{
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        console.log(this.props)
       
    }

    submit = () => {
        this.props.form.validateFields(err => {
            if (!err) {
                console.info('success')
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <div className="Custom">
                <div className="">
                    <Form.Item {...formItemLayout} label="模块名称">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写',
                                },
                            ],
                        })(<Input placeholder="请填写模块名称" />)}
                    </Form.Item>
                    <Form.Item {...formTailLayout}>
                        <Button type="primary" onClick={this.submit}>
                            Check
                        </Button>
                    </Form.Item>
                </div>

                <Suspense fallback={<LazySpin />} >
                    <Editer />
                </Suspense>
            </div>
        )
    }
}

const Custom = Form.create({ name: 'dynamic_rule' })(CustomForm)

export default Custom;