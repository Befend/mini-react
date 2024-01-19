import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, "hello world, my mini react!");
let count = 16
let props = { id: "11111111" }
function Counter({num}) {
  function handleClick() {
    console.log("click", count);
    count++
    props = {}
    React.update()
  }
  return (
    <div>
      <div {...props}>count:{count}
        <button onClick={handleClick}>click</button>
      </div>
    </div>
  )
}

let showFoo = true
function CreateCounter() {
  function Foo() {
    return <div>foo</div>
  }
  const bar = <div>bar</div>

  function show() {
    showFoo = !showFoo
    React.update()
  }
  return (
    <div>
      <div>删除旧的，创建新的：</div>
      <div>{showFoo ? <Foo/> : bar}</div>
      <button onClick={show}>changeShow</button>
    </div>
  )
}

let showBar = false
function DeleteCounter() {
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  )
  const bar = <div>bar</div>

  function show() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      <div>删除多余节点：</div>
      <div>{showBar ? foo : bar}</div>
      <button onClick={show}>changeShow</button>
    </div>
  )
}

function CounterContainer() {
  return <Counter num={10}></Counter>
}

function CaseCounter() {
  const bar = <div>bar</div>

  function handleClick() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      <div>删除edge case：</div>
      counter
      <div>{showBar && bar}</div>
      <button onClick={handleClick}>changeShow</button>
    </div>
  )
}

let appCount = 1;
function AppCounter() {
  const update = React.update()
  function handleClick() {
    appCount++
    update()
  }
  return (
    <div>
      <h1>App</h1>
      {appCount}
      <button onClick={handleClick}>appClick</button>
    </div>
  )
}

let fooCount = 1;
function FooCounter() {
  const update = React.update()
  function handleClick() {
    fooCount++
    update()
  }
  return (
    <div>
      <h1>Foo</h1>
      {fooCount}
      <button onClick={handleClick}>fooClick</button>
    </div>
  )
}

let barCount = 1;
function BarCounter() {
  const update = React.update()
  function handleClick() {
    barCount++
    update()
  }
  return (
    <div>
      <h1>App</h1>
      {barCount}
      <button onClick={handleClick}>barClick</button>
    </div>
  )
}

function StateCounter() {
  const [count, setCount] = React.useState(16)
  const [bar, setBar] = React.useState('bar')
  function handleClick() {
    setCount(c => c + 1)
    setBar('bar')
  }
  return (
    <div>
      <div>stateCounter</div>
      <div>{count}</div>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}

function App() {
  return (
    <div>
      hello world, my mini react!
      <div>befend</div>
      {/* <CounterContainer/> */}
      {/* <CreateCounter/> */}
      {/* <DeleteCounter/> */}
      {/* <CaseCounter/> */}
      {/* <AppCounter/>
      <FooCounter/>
      <BarCounter/> */}
      <StateCounter/>
    </div>
  )
}

export default App;