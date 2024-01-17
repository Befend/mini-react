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
    <div {...props}>count:{count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

function CounterContainer() {
  return <Counter num={10}></Counter>
}

function App() {
  return (
    <div>
      hello world, my mini react!
      <CounterContainer></CounterContainer>
      <div>befend</div>
      <Counter num={20}></Counter>
    </div>
  )
}

export default App;