function createTextNode(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				const isTextNode =
					typeof child === "string" || typeof child === "number"
				return isTextNode ? createTextNode(child) : child
			}),
		},
	}
}

// work in progress
let wipRoot = null
let currentRoot = null
//  下一个工作单元 (fiber结构)
let nextUnitOfWork = null
let deletions = []
let wipFiber = null

function render(el, container) {
	wipRoot = {
		dom: container,
		props: {
			children: [el],
		},
	}
	nextUnitOfWork = wipRoot
}

function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(type)
}

function updateProps(dom, nextProps, prevProps) {
	// 1. old有，new无，删除节点
	Object.keys(prevProps).forEach((key) => {
		if (key !== "children") {
			if (!(key in nextProps)) {
				dom.removeAttribute(key)
			}
		}
	})
	// 2. old无，new有，添加节点
	// 3. old有，new有，修改节点
	Object.keys(nextProps).forEach((key) => {
		if (key !== "children") {
			if (nextProps[key] !== prevProps[key]) {
				if (/^on/.test(key)) {
					const eventType = key.substring(2).toLocaleLowerCase()
					dom.removeEventListener(eventType, prevProps[key])
					dom.addEventListener(eventType, nextProps[key])
				} else {
					dom[key] = nextProps[key]
				}
			}
		}
	})
}

function reconcileChildren(fiber, children) {
	// const children = fiber.props.children
	let oldFiber = fiber.alternate?.child
	let prevChild = null
	children.forEach((child, index) => {
		const isSameType = oldFiber && oldFiber.type === child.type
		let newFiber
		if (isSameType) {
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: oldFiber.dom,
				effectTag: "update",
				alternate: oldFiber,
			}
		} else {
			if (child) {
				newFiber = {
					type: child.type,
					props: child.props,
					child: null,
					parent: fiber,
					sibling: null,
					dom: null,
					effectTag: "placement",
				}
			}
			oldFiber && deletions.push(oldFiber)
		}
		if (oldFiber) {
			oldFiber = oldFiber.sibling
		}

		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevChild.sibling = newFiber
		}
		if (newFiber) {
			prevChild = newFiber
		}
	})

	while (oldFiber) {
		deletions.push(oldFiber)
		oldFiber = oldFiber.sibling
	}
}

function updateFunctionComponent(fiber) {
	stateHooks = []
	effectHooks = []
	stateHookIndex = 0
	wipFiber = fiber
	const children = [fiber.type(fiber.props)]
	// 3. 转换链表，设置好指针
	reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
	if (!fiber.dom) {
		// 1. 创建dom
		const dom = (fiber.dom = createDom(fiber.type))
		// 2. 处理props
		updateProps(dom, fiber.props, {})
	}

	const children = fiber.props.children
	// 3. 转换链表，设置好指针
	reconcileChildren(fiber, children)
}

/**
 * 执行当前工作单元的工作
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
	const isFunctionComponent = typeof fiber.type === "function"
	if (isFunctionComponent) {
		updateFunctionComponent(fiber)
	} else {
		updateHostComponent(fiber)
	}

	// 4. 返回下一个要执行的任务
	if (fiber.child) {
		return fiber.child
	}

	let nextFiber = fiber
	while (nextFiber) {
		if (nextFiber.sibling) return nextFiber.sibling
		nextFiber = nextFiber.parent
	}
}

//  任务调度
function workLoop(deadline) {
	//  是否中断
	let shouldYeild = false
	while (!shouldYeild && nextUnitOfWork) {
		nextUnitOfWork = performWorkOfUnit(nextUnitOfWork)
		if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
			nextUnitOfWork = undefined
		}
		shouldYeild = deadline.timeRemaining() < 1
	}
	// 统一提交
	if (!nextUnitOfWork && wipRoot) {
		commitRoot()
	}
	//  任务放到下次执行
	requestIdleCallback(workLoop)
}

function commitRoot() {
	deletions.forEach(commitDeletion)
	// 统一提交任务
	commitWork(wipRoot.child)
	commitEffectHooks()
	currentRoot = wipRoot
	wipRoot = null
	deletions = []
}

function commitDeletion(fiber) {
	if (fiber.dom) {
		let fiberParent = fiber.parent
		while (!fiberParent.dom) {
			fiberParent = fiberParent.parent
		}
		fiberParent.dom.removeChild(fiber.dom)
	} else {
		commitDeletion(fiber.child)
	}
}

// 提交任务
function commitWork(fiber) {
	if (!fiber) return
	let fiberParent = fiber.parent
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent
	}
	if (fiber.effectTag === "update") {
		updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
	} else if (fiber.effectTag === "placement") {
		if (fiber.dom) {
			fiberParent.dom.append(fiber.dom)
		}
	}

	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

function commitEffectHooks() {
	function run(fiber) {
		if (!fiber) return
		if (!fiber.alternate) {
			// init
			fiber.effectHooks?.forEach((hook) => {
				hook.cleanup = hook.callback()
			})
		} else {
			// update
			// deps 有没有发生改变
			fiber.effectHooks?.forEach((newHook, index) => {
				if (newHook.deps.length > 0) {
					const oldEffectHook = fiber.alternate?.effectHooks[index]

					// some
					const needUpate = oldEffectHook?.deps.some((oldDep, i) => {
						return oldDep !== newHook.deps[i]
					})

					needUpate && (newHook.cleanup = newHook?.callback())
				}
			})
		}
		run(fiber.child)
		run(fiber.sibling)
	}

	function runCleanup(fiber) {
		if (!fiber) return

		fiber.alternate?.effectHooks?.forEach((hook) => {
			if (hook.deps.length > 0) {
				hook.cleanup && hook.cleanup()
			}
		})

		runCleanup(fiber.child)
		runCleanup(fiber.sibling)
	}

	runCleanup(wipRoot)
	run(wipRoot)
}

//  开启任务调度
requestIdleCallback(workLoop)

function update() {
	let currentFiber = wipFiber
	return () => {
		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
		}
		// wipRoot = {
		// 	dom: currentRoot.dom,
		// 	props: currentRoot.props,
		// 	alternate: currentRoot,
		// }
		nextUnitOfWork = wipRoot
	}
}

// 收集所有stateHook
let stateHooks = []
let stateHookIndex = 0
function useState(initial) {
	let currentFiber = wipFiber
	const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
	const stateHook = {
		state: oldHook ? oldHook.state : initial,
		queue: oldHook ? oldHook.queue : [],
	}

	stateHook.queue.forEach((action) => {
		stateHook.state = action(stateHook.state)
	})
	stateHook.queue = []

	stateHookIndex++
	stateHooks.push(stateHook)
	currentFiber.stateHooks = stateHooks

	function setState(action) {
		// 前置求值
		const eagerState =
			typeof action === "function" ? action(stateHook.state) : action
		// 相同的话，返回
		if (eagerState === stateHook.state) return

		// 判断是否为函数类型，不是，则构造成函数
		const currentAction = typeof action === "function" ? action : () => action
		stateHook.queue.push(currentAction)

		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
		}
		nextUnitOfWork = wipRoot
	}
	return [stateHook.state, setState]
}

let effectHooks = []
function useEffect(callback, deps) {
	const effectHook = {
		callback,
		deps,
		cleanup: undefined,
	}
	effectHooks.push(effectHook)
	wipFiber.effectHooks = effectHooks
}

const React = {
	render,
	createElement,
	update,
	useState,
	useEffect,
}

export default React
