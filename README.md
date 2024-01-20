## Mini React

### 目标

掌握 React 基础知识和基本原理，实现一个简单的 mini react
仓库链接：[https://github.com/Befend/mini-react](https://github.com/Befend/mini-react)

### 任务

#### day01

1. 了解 React 的 VDom 原理
2. 小步走，逐步优化代码，从 VDom 的静态到动态地创建
3. 从 js 到 jsx 的语法转换
4. 补充简单的单元测试方式

#### day02

1. 实现任务调度器

- 利用把大任务拆分到多个 task 里完成的解决思路，解决 dom 树特别大，导致渲染卡顿的问题，采用 requestIdleCallback 分帧预算

2. 实现 fiber 架构
   把树结构转变成链表结构 child -> sibling -> parent

- 创建 dom
- 把 dom 添加到父级容器内
- 设置 dom 的 props
- 建立关系 child/sibling/parent
- 返回下一个节点

## day03

1. 实现统一提交
   如果中途有可能没空余时间用户会看到渲染一半的 dom，那么就利用计算结束后统一添加到屏幕里

2. 实现 function component

- fiber.type()返回的是 vDom
- 由于返回的是个 element 数据 children 为 element[]需要套上处理成数组
- 没有 vDom 属性得继续向上查找
- fiber.props
- 处理 child 为 string | number 类型

## day04

阶段复习

1. 初步实现 React 的 VDom 原理，初次接触 jsx 的语法

2. 实现任务调度器和 fiber 架构

- 实现递归创建 dom，大量数据时容易卡顿。
- 采用 requestIdleCallback 分帧预算。
- 把树结构转变成链表结构 child -> sibling -> parent

3. 支持函数式组件

- 需要区分 vdom 的 type 属性
- 组件不需要创建 dom，调用 type 函数，将返回值作为 child
- append 以及 查找组件的兄弟节点，需要递归查找

## day05

1. 实现事件绑定
   判断节点的属性是否以 on 开始的，截取并绑定在 dom 的 addEventListener 上

2. 实现 props
   对比 new tree 和 old tree？如何找到老节点？如何 diff dom

- new 没有， old 有，删除
- new 有，old 没有，添加
- new 有，old 有，更新

## day06

实现 diff 更新

1. type 不一样时，删除旧的，创建新的，使用 deletions 收集进行统一删除
2. 新的比老的短时，删除多余的节点，用循环来处理 oldFiber，并且让 oldFiber 指向它的兄弟节点，直到删除完所有的节点
3. 判断隐藏或显示组件
4. 优化了更新组件，避免不需要更新的组件重复计算浪费资源，开始节点：updateFunctionComponent 的时候，把当前的节点赋值给 wipFiber 全局变量, update 的时候利用闭包的特性，把当前的节点赋值给存到 currentFiber 中，结束节点：判断下一个任务是不是兄弟节点

## day07

1. 实现 useState
   利用 currentFiber 的 stateHooks 收集 stateHook，其中 currentFiber 的 alternate 里的 stateHooks[stateHookIndex]为旧的 hooks

2. 批量执行 action
   利用 stateHook 的 queue 属性来收集 action，最后批量执行 action

3. 提前检测，减少不必要的更新
   设置 eagerState 前置求值，如果他的值和 stateHook.state 的值一样，就不更新了

## day08

1. 实现 useEffect

- useEffect 是一个 hook 函数，它接收一个函数作为参数，并返回一个函数。
- useEffect 调用的时机是在 React 完成对 DOM 的渲染之后，并且浏览器完成绘制之前。
- useEffect 的第二个参数是依赖数组，不指定的时候副作用指挥在组件渲染后执行一次，如果指定了依赖数组，那么只有当依赖数组中的值发生变化时，副作用才会执行。
- 通过 fiber.alternate 来判断是初始化还是更新，如果是更新则需要检测依赖项是否发生变化。利用 some 方法来判断依赖项是否发生变化。
- 在 updateFuncionComponent 函数中初始化 effectHooks=[]
- 利用 effectHooks 统一收集，最后批量执行 effectHook.callback

2. 实现 cleanup，其作用是为了清空副作用

cleanup 就是 effectHook 中的 callback 执行的时候，会先执行 cleanup 中的函数，然后执行 callback 中的函数,当 deps 为空的时候不会调用返回的 cleanup
cleanup 的作用是为了清空副作用
