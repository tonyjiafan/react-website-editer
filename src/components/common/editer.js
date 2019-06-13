import React, { Component } from 'react';
import E from 'wangeditor';
// import { message } from 'antd';

class Editer extends Component{
    constructor(props) {
        super(props)
        this.state = {
            content: ``
        }
        this.initEditor = this.initEditor.bind(this)
    }

    componentDidMount() {
        const _this = this 
        console.log('initEditorinitEditorinitEditorinitEditor')
        console.log(this.props)
        console.log('initEditorinitEditorinitEditorinitEditor')
        const { Section_Content } = _this.props
        _this.setState({ content: Section_Content }, () => {
            _this.initEditor()
        })
    }

    initEditor() {
        const elem = this.refs.editorElem; //获取editorElem盒子
        // const submit = this.refs.submit; //获取提交按钮
        const editor = new E(elem)  //new 一个 editorElem富文本
        editor.create() //创建

        editor.txt.html(this.state.content)  //设置富文本默认内容
        // submit.addEventListener('click', function () {  //监听点击提交按钮
        //     // 读取 html
        //     this.setState({
        //         content: editor.txt.html()  //获取富文本内容
        //     })
        // }, false)
        
        // 上传图片
        // editor.customConfig.uploadFileName = 'upfile' //置上传接口的文本流字段
        // editor.customConfig.uploadImgServer = 'https://dev.xiaomon.com/api/treeroot/v1/xxx/upload/uploadImage'//服务器接口地址
        // editor.customConfig.uploadImgHooks = {
        //     customInsert: function (insertImg, result, editor) {
        //         var url = result.url  //监听图片上传成功更新页面
        //         insertImg(url)
        //     }
        // }

        editor.customConfig.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            'code', // 插入代码
            'undo', // 撤销
            'redo' // 重复
        ]
        editor.customConfig.lang = {
            '设置标题': 'Title',
            '字号': 'Size',
            '文字颜色': 'Color',
            '设置列表': 'List',
            '有序列表': '',
            '无序列表': '',
            '对齐方式': 'Align',
            '靠左': '',
            '居中': '',
            '靠右': '',
            '正文': 'p',
            '链接文字': 'link text',
            '链接': 'link',
            '上传图片': 'Upload',
            '网络图片': 'Web',
            '图片link': 'image url',
            '插入视频': 'Video',
            '格式如': 'format',
            '上传': 'Upload',
            '创建': 'init'
        }
    }

    render() {
        return (
            <div>
                <div ref='editorElem' style={{ textAlign: 'left', minHeight: 400 }} />
                { /* <div ref="submit">提交</div> */ }
            </div>
        )
    }
}

export default Editer;