import './App.css';
import DataTable from './DataTable';
import TodoForm from './components/todoForm';
import { useEffect, useState } from 'react';

function App() {

  const[todos, setTodos] = useState([]);
  const[formSubmitted, setFormSubmitted] = useState(false);
  const[editRowKey, setEditRowKey] = useState("");

  const [newtodo, setNewtodo] = useState({
    id: "",
    timeStamp: "",
    title: "",
    description: "",
    dueDate: "",
    tags: "Primary",
    status: "Open",
    action: ""
  });

  const AddTodo = (e) => {
    // setFormSubmitted(prev => !prev)
    const time_stamp = new Date().toLocaleDateString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    var today = new Date();
    var due_date = new Date(newtodo.dueDate)
    if (today.getTime() >= due_date.getTime()) {
        alert("Choose a future date")
        return
    }

    setNewtodo({
      ...newtodo, 
      ["timeStamp"] : time_stamp,
      ["id"] : Math.floor(Math.random()*100 + 1),
    })

    console.log("newtodo", newtodo)

    setTodos(oldTodos => [...oldTodos, newtodo])
  }

  const handleDelete = (value) => {
    const dataSource = [...todos];
    const filteredData = dataSource.filter((item) => item.id !== value.id);
    setTodos(filteredData);
  }

  const isEditing = (record) => {
      return record.id === editRowKey;
  }

  const toggleFormSubmit = () => {
    setFormSubmitted(prev => !prev)
  }

  useEffect(() => {
    AddTodo()
  }, [formSubmitted])

  useEffect(() => {
    setTodos([])
  }, [])

  return (
    <div className="App">
      <TodoForm newtodo={newtodo} setNewtodo={setNewtodo} 
      onClickHandle={toggleFormSubmit} />
      <DataTable todos={todos} handleDelete={handleDelete} isEditing={isEditing} 
      setEditRowKey={setEditRowKey} setTodos={setTodos}/>
      
    </div>
  );
}

export default App;
