import { Button, FormControl, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
    const dispatch = useDispatch();
    const { todo } = useSelector((state: any) => state.todosReducer);
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <FormControl value={todo.title}
                onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
                className="me-2" />
            <Button onClick={() => dispatch(updateTodo(todo))}
                id="wd-update-todo-click"
                className="btn btn-warning me-2"> Update </Button>
            <Button onClick={() => dispatch(addTodo(todo))}
                id="wd-add-todo-click"
                className="btn btn-success"> Add </Button>
        </ListGroup.Item>
    );
}