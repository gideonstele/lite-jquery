# lite-jquery
jQuery-like library, but pure.

### 实现进度

#### Core

##### ✅ 选择器/DomReady

 - selector, [context]
 - element
 - elementArray
 - lite-jquery object
 - HTML String
 - ()
 - function

##### ✅ Length
##### ✅ each
##### ✅ toArray
##### ✅ extend
  只实现`jQuery.extend`，未实现`jQuery.fn.extend`

##### 筛选

 - 查找
   * ❌ children
   * ✅ closest
   * ✅ find
   * ❌ next
   * ❌ nextAll
   * ❌ prev
   * ❌ prevAll
   * ❌ sibings
   * ❌ parent
   * ❌ parents
 - 过滤
   * ✅ eq
   * ✅ first
   * ✅ last
   * ✅ is
   * ❌ not
   * ❌ slice
   * ❌ has
   * ✅ map
 - 串联
   * add
   * end

##### 属性

 - ✅ attr(name|properties|key,val)
 - ✅ removeAttr(name)
 - ✅ hasAttr(name)
 - ✅ prop(name|properties)
 - ❌ removeProp(name)
 - ✅ val(value)
 - ❌ html(HTMLString)
 - ❌ text(text)
 - ✅ addClass(className)
 - ✅ removeClass(className)
 - ✅ hasClass(className)
 - ✅ toggleClass

##### CSS

 - ❌ css(name|properties|key,val)
 - ❌ offset
 - ❌ position
 - ❌ scrollTop
 - ❌ scrollLeft
 - ❌ height / innerHeight / outerHeight
 - ❌ width / innerWidth / outerWidth

##### 事件

 **移植了`jQuery`的事件系统，支持`namespace`**

 - ✅ on(eventsObject|event[, selector], fn, options{data, capture})
 - ✅ off(event[, selector], fn)
 - ✅ one
 - ❌ trigger

**事件对象**

 eventObject
   - ❌ currentTarget
   - ❌ data
   - ❌ delegateTarget
   - ❌ preventDefault
   - ❌ isDefaultPrevented
   - ❌ isPropagationStopped
   - ❌ namespace
   - ❌ pageX/pageY
   - ❌ type
   - ❌ timeStamp

##### 文档处理

 - 内部插入
    * ❌ append
    * ❌ appendTo
    * ❌ prepend
    * ❌ prependTo
 - 外部插入
    * ❌ after
    * ❌ before
    * ❌ insertAfter
    * ❌ insertBefore
 - 包裹
    * ❌ wrap
    * ❌ unwrap
    * ❌ wrapAll
 - 替换
    * ❌ replaceWith
    * ❌ replaceAll
 - 删除
    * ❌ empty
    * ❌ remove
 - 复制
    * ❌ clone
