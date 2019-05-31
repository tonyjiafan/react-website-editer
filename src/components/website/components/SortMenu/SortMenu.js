import React, {
	Component
} from 'react';
import './SortMenu.less';

import { Icon } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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


// 一个小功能，以帮助我们重新排序结果
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
    // 一些基本的样式，使项目看起来更好一点
    userSelect: 'none',
    // 拖动时更改背景颜色 当前的item元素
    background: isDragging ? '#fff' : '#e2e9ec',
    display: isDragging ? 'inline-block' : '',
    outline: isDragging ? '2px dashed #2d8cf0' : '',
    margin: isDragging ? '12px auto' : '6px auto',
    borderRadius: isDragging ? '0px' : '2px',

    // 在draggables上应用的样式
    ...draggableStyle
})

const getListStyle = isDraggingOver => ({
    // 拖拽时候 修改容器的样式
    background: isDraggingOver ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0)',
})


class SortMenu extends Component {
	constructor(props) {
		super(props);
        this.state = {
            menus: []
        }

        this.onDragEnd = this.onDragEnd.bind(this)
    }

    onDragEnd(result) {
        const _this = this
        // 掉到了名单之外
        if (!result.destination) return

        const menus = reorder(
            _this.state.menus,
            result.source.index,
            result.destination.index
        )

        _this.setState({ menus }, function () {
            _this.props.currentSort(_this.state.menus)
        })
    }

	componentWillMount() {
        console.log(this.props)
        const _this = this
        const { Section_Data } = _this.props
        _this.setState({
            menus: Section_Data
        }, function() {
            console.log(_this.state.menus)
        })

        // 处理默认事件
        document.body.ondrop = event => {
            event.preventDefault();
            event.stopPropagation();
        };
    }

	render() {
        const _this = this

		return (
			<div className="SortMenu">
                <div className="web_module_warp">
                    <div className="web_module_title">
                        菜单管理
                        <label onClick={ () => _this.closeModuleWarp }>
                            <Icon className="close" style={{ fontSize: '20px'}} type="close" />
                        </label>
                    </div>
                    <div style={{ padding: "10px" }}>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>

                                    {_this.state.menus.map((item, index) => (
                                        <Draggable 
                                        key={ `${item.Section_Code}-${item.Rich_Id}` } 
                                        draggableId={ `${item.Section_Code}-${item.Rich_Id}` } 
                                        index={index}>

                                        {(provided, snapshot) => (
                                            <span className="tuo-zhuai-item-warp dargDiv"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                            )}>

                                                <span className="tuo-zhuai-tag">
                                                    <MyIcon style={{ fontSize: '20px', color: '#888'}} type="icon-align-justify" />
                                                </span>
                                                <span className="tuo-zhuai-text">{ item.Section_Name }</span>

                                                <span className="edit-box seeting-box">
                                                    <label onClick={ () => _this.vueEdit(item) }>
                                                        <MyIcon className="hover-icon" style={{ fontSize: '19px'}} type="icon-tianxie" />
                                                    </label>
                                                </span>
                                                <span className="delete-box seeting-box">
                                                    <label onClick={ () => _this.vueEnabled(index) }>
                                                        <MyIcon className="hover-icon" style={{ fontSize: '21px', marginTop: '5px'}} type="icon-trash-alt" />
                                                    </label>
                                                </span>
                                            </span>

                                        )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                            </Droppable>
                        </DragDropContext>
                        <p style={{ textAlign: "center", padding: "6px 0px 12px", marginTop: "20px" }}>
                            出现 <MyIcon type="icon-move1"  style={{ verticalAlign: "-2px", fontSize: "16px", color: "#2a2a2b" }} /> 按住拖动排序
                        </p>
                    </div>
                </div>
            </div>
		)
	}
}

export default SortMenu;
