import { RestHandler, rest } from "msw";
import { BASE_URL, getGetBoardEndpoint } from "../api/api";
import { BoardType, TaskCollectionType } from "../datamodel/todoList";

const _boards = new Map<string, BoardType>();
_boards.set("my-board", {
  id: "my-board",
  collections: [
    {
      id: "todo-0",
      name: "TODO",
      tasks: [
        {
          id: "T-0",
          name: "Do stuff",
          description: "Got stuff to do",
        },
      ],
    },
    {
      id: "done-0",
      name: "Done",
      tasks: [],
    },
  ],
});

const handleGetBoard = rest.get(
  BASE_URL + getGetBoardEndpoint(":boardId"),
  (req, res, ctx) => {
    const { boardId } = req.params;

    const board = _boards.get(boardId as string);
    if (!board) {
      return res(ctx.status(404));
    }

    board.collections = (board.collections as TaskCollectionType[]).map(
      (c) => c
    );

    return res(ctx.status(200), ctx.json(board));
  }
);

export const handlers: RestHandler[] = [handleGetBoard];
