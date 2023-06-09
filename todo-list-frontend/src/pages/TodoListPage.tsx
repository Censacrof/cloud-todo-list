import { FC } from "react";
import { BoardComponent } from "../components/BoardComponent";

export const TodoListPage: FC = function TodoListPage() {
  return (
    <div className="flex flex-col items-center">
      <h1>Todo List</h1>
      <BoardComponent />
    </div>
  );
};
