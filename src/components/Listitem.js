import React from "react";

export default function Listitem({ name, EditTodo, deleteTodo }) {
  return (
    <li className="list-group-item d-flex">
      <button onClick={EditTodo} className="btn btn-info  ">
        U
      </button>
      <span className="m-auto">{name}</span>
      <button onClick={deleteTodo} className="btn btn-danger ">
        x
      </button>
    </li>
  );
}
