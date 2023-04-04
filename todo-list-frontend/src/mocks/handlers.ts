import { RestHandler, rest } from "msw";
import { BASE_URL, getGetBoardEndpoint } from "../api/api";
import { BoardType } from "../datamodel/todoList";

const handleGetBoard = rest.get(
  BASE_URL + getGetBoardEndpoint("*"),
  (req, res, ctx) => {
    const { boardId } = req.params;

    const board: BoardType = {
      id: boardId as string,
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
    };

    return res(ctx.status(200), ctx.json(board));
  }
);

export const handlers: RestHandler[] = [handleGetBoard];
