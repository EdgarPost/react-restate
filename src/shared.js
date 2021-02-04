import EventEmitter from "events";
import { useEffect, useCallback, useMemo, useRef, useState } from "react";

const em = new EventEmitter();
const states = new Map();
const actions = new Map();
// const states = {};
// const actions = {};

const events = {};

// export const addMiddleware = (fn) => {
//   em.on("update", fn);
// };

// addMiddleware(console.log);

export const createNode = (name, initialValue, originalActions) => {
  const createId = (id) => {
    const key = name + "." + id;

    if (states.get(key)) {
      return {
        state: states.get(key),
        actions: actions.get(key)
      };
    }

    // if (states[key]) {
    //   return {
    //     state: states[key],
    //     actions: actions[key]
    //   };
    // }

    const newActions = {};
    Object.keys(originalActions).forEach((actionName) => {
      const originalAction = originalActions[actionName];
      const updateState = (state) => {
        states.set(key, state);
        // states[key] = state;
        events["update." + key] && events["update." + key].apply(this, [state]);
        em.emit("update." + key, state);
      };

      newActions[actionName] = function (...args) {
        if (Array.isArray(originalAction)) {
          const [preFn, postFn] = originalAction;

          const preFnResult = preFn(...args);

          const handleResult = (result) => {
            const prevState = states.get(key);
            // const prevState = states[key];
            const nextState = postFn(prevState, result);
            updateState(nextState);
          };

          if (typeof preFnResult.then === "function") {
            return preFn(...args).then(handleResult);
          } else {
            handleResult(preFnResult);
          }
        } else {
          const prevState = states.get(key);
          // const prevState = states[key];
          const nextState = originalAction(prevState, ...args);
          updateState(nextState);
        }
      };
    });

    states.set(key, initialValue);
    actions.set(key, newActions);
    // states[key] = initialValue;
    // actions[key] = newActions;

    return {
      state: states.get(key),
      actions: actions.get(key)
      // state: states[key],
    };
  };

  // const getState = (key) => states[key];
  const getState = (key) => states.get(key);

  return { name, states, actions, createId, getState };
};

export const useNode = (
  node,
  id = "__internalDefault__",
  select = (a) => a
) => {
  const key = node.name + "." + id;
  const selectRef = useRef(select);

  const { state, actions } = useMemo(() => node.createId(id), [node, id]);
  const [localState, setLocalState] = useState(() => selectRef.current(state));

  const setSelectedState = useCallback((state) => setLocalState(selectRef.current(state)), [
    selectRef
  ]);

  useEffect(() => {
    em.on("update." + key, setSelectedState);

    return () => {
      em.off("update." + key, setSelectedState);
    };
  }, [key, setSelectedState]);

  useEffect(() => {
    const state = node.getState(key);
    setSelectedState(state);
  }, [key, node, setSelectedState]);

  return [localState, actions];
};
