import { useState, useEffect } from "react";
import * as client from "./client";
import { ListGroup } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const fetchTodos = async () => {
        const todos = await client.fetchTodos();
        setTodos(todos);
    };
    useEffect(() => {
        fetchTodos();
    }, []);
    const removeTodo = async (todo: any) => {
        const updatedTodos = await client.removeTodo(todo);
        setTodos(updatedTodos);
    };
    const createTodo = async () => {
        const todos = await client.createTodo();
        setTodos(todos);
    };
    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            <h4>
                Todos
                <FaPlusCircle onClick={createTodo} className="wd-create-todo" />
            </h4>
            <ListGroup>
                {todos.map((todo) => (
                    <ListGroup.Item key={todo.id}>
                        <FaTrash onClick={() => removeTodo(todo)}
                            className="text-danger float-end mt-1" id="wd-remove-todo" />
                        <input type="checkbox" className="form-check-input me-2"
                            defaultChecked={todo.completed} />
                        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                            {todo.title}
                        </span>
                    </ListGroup.Item>
                ))}
            </ListGroup> <hr />
        </div>
    );
}
