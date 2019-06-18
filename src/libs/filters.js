// 深客隆
export function cloneObj(obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj) //序列化对象
        newobj = JSON.parse(str) //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
}


// 判断参数 是不是数组
export function isArrayFn(arr) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    } else {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
}

// 去除字符串两边的空白
function trimFn(str) {
    if (str === '' || str == null) return
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 截取富文本内容
export function replaceEditorContent(Content) {
    if (Content === '' || Content == null) return
    let Editor = Content.replace("<!DOCTYPE html>", "").replace("<html>", "").replace("<head>", "").replace("</head>", "")
            .replace("<body>", "").replace("</body>", "").replace("</html>", "");
    let str = trimFn(Editor)
    return str;
}