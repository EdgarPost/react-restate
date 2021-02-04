import React, { Fragment, useEffect, useState } from "react";

import "./styles.css";
import { useNode } from "./shared";
import { counterNode, todoListNode, userNode } from "./nodes";

function MyCounter({ id }) {
  const [count] = useNode(counterNode, id);

  return (
    <div>
      counter {id}: {count}
    </div>
  );
}

function MyCounterControls({ id }) {
  const [_, { increment, incrementLazy, decrement }] = useNode(counterNode, id);

  return (
    <div>
      counter {id} controls:
      <button onClick={increment}>+</button>
      <button onClick={incrementLazy}>++</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

function MyName({ id }) {
  const [name] = useNode(userNode, id, (state) => state.name);

  return (
    <div>
      <h1>name: {name}</h1>
    </div>
  );
}

function Age({ id }) {
  const [age] = useNode(userNode, id, (state) => state.age);

  return (
    <div>
      <h1>age: {age}</h1>
    </div>
  );
}

function MyProfile({ id }) {
  const [state, { setName, anniversary, load }] = useNode(
    userNode,
    id,
    (state) => ({
      ...state,
      loading: !state.id
    })
  );

  useEffect(() => {
    const i = setInterval(() => anniversary(), 100000);
    return () => clearInterval(i);
  }, [anniversary]);

  useEffect(() => {
    load(id);
  }, [load, id]);

  return (
    <div>
      Loading: {state.loading.toString()}
      <br />
      ID: "{state.id}"
      <input
        onChange={(e) => setName(e.target.value)}
        value={state.name}
      />{" "}
      {state.age}
    </div>
  );
}

const TodoList = ({ name }) => {
  const [todos] = useNode(todoListNode, name);

  return (
    <div>
      <ul>
        {todos.map(({ id, title, completed }) => (
          <TodoItem
            name={name}
            key={id}
            id={id}
            title={title}
            completed={completed}
          />
        ))}
        <NewTodo name={name} />
      </ul>
    </div>
  );
};

const Animation = ({ id }) => {
  const [timestamp, { set }] = useNode(counterNode, id);

  useEffect(() => {
    function step(timestamp2) {
      set(timestamp2);
      window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }, [set]);

  return <div>anim: {timestamp}</div>;
};

const AnimationRead = ({ id }) => {
  const [timestamp] = useNode(counterNode, id);

  return <div>anim: {timestamp}</div>;
};

const SomeComponent = ({ children }) => {
  return <div>Some Component with kids: {children}</div>;
};

const TodoItem = ({ name, id, title, completed }) => {
  const [_, { remove, toggle }] = useNode(todoListNode, name);

  return (
    <li key={id}>
      <input
        type="checkbox"
        checked={!!completed}
        onChange={() => toggle(id)}
      />
      <span
        style={{
          textDecoration: completed ? "line-through" : "none"
        }}
      >
        {title} {completed ? "Y" : "N"}
      </span>
      <button onClick={() => remove(id)}>Delete</button>
    </li>
  );
};

const FirstTodo = ({ name }) => {
  const [firstItem] = useNode(todoListNode, name, (todos) => todos[0]);

  useEffect(() => {
    console.log("firstItem", firstItem);
  }, [firstItem]);

  if (!firstItem) {
    return null;
  }

  return (
    <h2>
      {firstItem.title} {firstItem.completed ? "Y" : "N"}
    </h2>
  );
};

const NewTodo = ({ name }) => {
  const [text, setText] = useState("");
  const [_, { add }] = useNode(todoListNode, name);
  const addTodo = () => {
    add(text);
    setText("");
  };
  return (
    <li>
      <input
        value={text}
        placeholder="Enter title..."
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
    </li>
  );
};

function CounterGroup() {
  const [count1] = useNode(counterNode, "1");
  const [count2] = useNode(counterNode, "2");

  return new Array(1000).fill().map((_, index) => (
    <Fragment key={index}>
      <MyCounter id="1" count={count1} />
      <MyCounter id="2" count={count2} />
    </Fragment>
  ));
}

export default function App() {
  return (
    <div>
      <Animation id="anim-1" />
      <Animation id="anim-2" />
      <AnimationRead id="anim-1" />
      <AnimationRead id="anim-2" />
      <FirstTodo name="A" />
      <FirstTodo name="B" />
      <MyName id="1" />
      <MyProfile id="1" />
      <MyCounterControls id="1" />
      <MyCounterControls id="2" />
      {/* <CounterGroup /> */}
      {new Array(1000).fill().map((_, index) => (
        <Fragment key={index}>
          <MyCounter id="1" />
          <MyCounter id="2" />
        </Fragment>
      ))}
      <hr />
      <TodoList name="A" />
      <TodoList name="B" /> */}
      <SomeComponent>
        <SomeComponent>
          {/* <AnimationRead id="anim-1" /> */}
          <SomeComponent>{/* <AnimationRead id="anim-2" /> */}</SomeComponent>
          <MyCounter id="2" />
          <Age id="1" />
        </SomeComponent>
      </SomeComponent>
    </div>
  );
}
