;(function (win, doc, $, undefined) {
    /*
     * parentWindow 容器的顶层对象
     * hoverId 当前hover元素的 Id
     * domInfo 元素上携带的 参数
     */
    var ModuleMask = function (parentWindow, hoverId, domInfo) {
        this.parentWindow = parentWindow || window.top
        this.div = doc.getElementById(hoverId)
        this.hoverId = hoverId
        this.domInfo = JSON.stringify(domInfo)

        // 初始
        this.init()
    }

    // 对象中的 方法
    ModuleMask.prototype = {
        constructor: ModuleMask,
        init: function () {
            const _this = this
            _this.createdEle(_this.domInfo)
        },

        // 创建模态层
        createdEle: function (domInfo) {
            const _this = this
            let btnsObj = _this.createBtnAndClass(domInfo)
            let modalEle = ''
            // console.log(JSON.parse(domInfo));
            if (JSON.parse(domInfo).ElementName == 'Basic') {
                // btnsObj.modal.appendChild(btnsObj.bannerBtn)
                btnsObj.modal.appendChild(btnsObj.pageHeadBtn)
                modalEle = btnsObj.modal
            } else {
                btnsObj.modal.appendChild(btnsObj.deleteBtn)
                btnsObj.modal.appendChild(btnsObj.editBtn)
                btnsObj.modal.appendChild(btnsObj.sortBtn)
                modalEle = btnsObj.modal
            }
            _this.div.appendChild(modalEle)
        },

        // 创建 按钮绑定 参数
        createBtnAndClass: function (domInfo) {
            const _this = this
            let modal = doc.createElement('div')
            modal.classList.add('hover-modal')
            modal.setAttribute('BtnData', domInfo)

            let sortBtn = doc.createElement('span')
            sortBtn.classList.add('modal-btn', 'sort-btn')
            sortBtn.setAttribute('BtnData', domInfo)
            sortBtn.innerHTML = '排序'

            let editBtn = doc.createElement('span')
            editBtn.classList.add('modal-btn', 'edit-btn')
            editBtn.setAttribute('BtnData', domInfo)
            editBtn.innerHTML = '编辑'

            let deleteBtn = doc.createElement('span')
            deleteBtn.classList.add('modal-btn', 'del-btn')
            deleteBtn.setAttribute('BtnData', domInfo)
            deleteBtn.innerHTML = '移除'

            // let bannerBtn = doc.createElement('span')
            // bannerBtn.classList.add('modal-btn', 'banner-btn')
            // bannerBtn.setAttribute('BtnData', domInfo)
            // bannerBtn.innerHTML = '背景设置'

            let pageHeadBtn = doc.createElement('span')
            pageHeadBtn.classList.add('modal-btn', 'banner-btn')
            pageHeadBtn.setAttribute('BtnData', domInfo)
            pageHeadBtn.innerHTML = '页头设置'

            return {
                modal,
                sortBtn,
                editBtn,
                deleteBtn,
                // bannerBtn,
                pageHeadBtn
            }
        },

        // 删除
        removeEle: function () {
            const _this = this
            let removeObj = _this.div.lastElementChild
            removeObj.parentNode.removeChild(removeObj)
        },

        // 模态层 按钮点击后
        maskBtnCick: function (eventData, fnName) {
            const _this = this
            let elType = JSON.parse(eventData).ElementType
            let elName = JSON.parse(eventData).ElementName
            let elRichId = JSON.parse(eventData).ElementRichId
            let params
            if (fnName === 'vueEnabledFn') {
                params = {
                    index: null,
                    typeName: 'Iframe',
                    Current_Type: elType,
                    Current_Component: elName,
                    Current_RichId: elRichId
                }
            } else {
                params = {
                    Current_Type: elType,
                    Current_Component: elName,
                    Current_RichId: elRichId
                }
            }

            // console.log('PARAMS', params)
            _this.parentWindow.A_vue[fnName](params)
        }
    },

    // 绑定window对象
    win.ModuleMask = ModuleMask
})(window, document, jQuery)
