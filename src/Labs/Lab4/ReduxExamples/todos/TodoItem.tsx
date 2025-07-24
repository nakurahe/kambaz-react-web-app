import { Button, ListGroup } from "react-bootstrap";

export default function TodoItem({ todo, deleteTodo, setTodo }: {
    todo: { id: string; title: string };
    deleteTodo: (id: string) => void;
    setTodo: (todo: { id: string; title: string }) => void;
}) {
    return (
        <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
            <span>{todo.title}</span>
            <div>
                <Button onClick={() => setTodo(todo)}
                    id="wd-set-todo-click"
                    className="me-2"> Edit </Button>
                <Button onClick={() => deleteTodo(todo.id)}
                    id="wd-delete-todo-click"
                    className="btn btn-danger"> Delete </Button>
            </div>
        </ListGroup.Item>);
}