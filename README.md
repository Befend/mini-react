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
