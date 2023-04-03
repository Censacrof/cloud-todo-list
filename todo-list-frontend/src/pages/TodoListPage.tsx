import { FC } from "react";
import { TodoList } from "../components/TodoList";

export const TodoListPage: FC = function TodoListPage() {
  return (
    <div className="flex flex-col items-center">
      <h1>Todo List</h1>
      <TodoList />
    </div>
  );
};
