import { useState } from "react"

import Header from "./../components/Header"
import Footer from "./../components/Footer"
import "@/assets/css/style.css"

type Todo = { id: number; title: string }

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [nextId, setNextId] = useState(1)
  const [newTodo, setNewTodo] = useState("")
  const [edittingTodo, setEdittingTodo] = useState<Todo>({ id: -1, title: "" })

  const addTodo = (): void => {
    setTodos([...todos, { id: nextId, title: newTodo }])
    setNextId(nextId + 1)
    setNewTodo("")
  }

  const removeTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const moveUp = (i: number): void => {
    const res: Todo[] = [...todos]
    const tmp: Todo = res[i]
    res[i] = res[i - 1]
    res[i - 1] = tmp
    setTodos(res)
  }

  const moveDown = (i: number): void => {
    const res: Todo[] = [...todos]
    const tmp: Todo = res[i]
    res[i] = res[i + 1]
    res[i + 1] = tmp
    setTodos(res)
  }

  const editTodo = (todo: Todo): void => {
    setEdittingTodo(todo)
  }

  const fixTodo = (todo: Todo): void => {
    setTodos(todos.map((todo) => (todo.id === edittingTodo.id ? edittingTodo : todo)))
    setEdittingTodo({ id: -1, title: "" })
  }

  return (
    <>
      <Header />
      <ul>
        {todos.map((todo, i) => (
          <li key={todo.id}>
            {edittingTodo.id === todo.id ? (
              <>
                <input
                  value={edittingTodo.title}
                  onChange={(e) => {
                    setEdittingTodo({ ...edittingTodo, title: e.target.value })
                  }}
                ></input>
                <button
                  type="button"
                  onClick={() => {
                    fixTodo(todo)
                  }}
                >
                  確定
                </button>
              </>
            ) : (
              <span>{todo.title}</span>
            )}
            <button onClick={() => removeTodo(todo.id)}>削除</button>
            {i > 0 && <button onClick={() => moveUp(i)}>↑</button>}
            {i < todos.length - 1 && <button onClick={() => moveDown(i)}>↓</button>}
            <button onClick={() => editTodo(todo)}>編集</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value)
          }}
        ></input>
        <button onClick={addTodo}>追加</button>
      </div>
      <Footer />
    </>
  )
}
