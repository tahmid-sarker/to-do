import { useState, useEffect } from 'react'
import { TodoProvider } from './contexts'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'

function App() {
  const [todos, setTodos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTodos, setFilteredTodos] = useState([])

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo
      )
    )
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const filtered = todos.filter((todo) =>
        todo.todo.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTodos(filtered)
    }
  }

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'))
    if (storedTodos && storedTodos.length > 0) {
      setTodos(storedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    setFilteredTodos(todos)
  }, [todos])

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your To Do List</h1>

          {/* Search box */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Todos..."
              className="w-full border border-black/10 rounded-lg px-3 py-1.5 outline-none bg-white/20"
              value={searchQuery}
              onChange={handleSearch}
              onKeyUp={handleKeyPress}
            />
          </div>

          {/* Todo form */}
          <div className="mb-4">
            <TodoForm />
          </div>

          {/* Todo items list */}
          <div className="flex flex-wrap gap-y-3">
            {filteredTodos.map((todo) => (
              <div key={todo.id} className="w-full">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App