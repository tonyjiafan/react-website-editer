import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import uniqueId from 'lodash/uniqueId'; // 生成ID


// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }))

// 一个小功能，以帮助我们重新排序结果
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // 一些基本的样式，使项目看起来更好一点
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // 拖动时更改背景颜色
  background: isDragging ? 'lightgreen' : 'grey',

  // 在draggables上应用的样式
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
})



class Tuzhuai extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: []
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  	componentWillMount() {
		console.log(this.props)
		console.log(getItems(10))
		
        const _this = this
        const { Section_Data } = _this.props
        _this.setState({
            items: Section_Data
        }, function() {
            console.log(_this.state.items)
        })

        // 处理默认事件
        document.body.ondrop = event => {
            event.preventDefault();
            event.stopPropagation();
        };
    }

  onDragEnd(result) {
    // 掉到了名单之外
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState({
      items
    })
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
				<Draggable 
					key={ `${item.Section_Code}-${item.Rich_Id}` } 
					draggableId={ `${item.Section_Code}-${item.Rich_Id}` } 
					index={index}
				>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.Section_Name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default Tuzhuai;