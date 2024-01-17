## Mini React

### 目标

掌握 React 基础知识和基本原理，实现一个简单的 mini react

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
