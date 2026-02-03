import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // 👈 ADD THIS LINE
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');


  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
    setIsLoaded(true);
  }, []);





  // Function to add a task
  const addTask = () => {
    console.log("Add button clicked"); // 👈 TEST LINE
    if (!input.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInput('');
  };
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };
  const saveEdit = (id) => {
    if (!editingText.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );

    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };





  return (
    <div className="container">
      <h1>My To-Do List</h1>

      {/* Input + Button */}
      <input
        type="text"
        placeholder="Enter a task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTask();
          }
        }}
      />

      <button onClick={addTask}>Add</button>
      {tasks.length === 0 && (
        <p>No tasks yet. Add one above 👆</p>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />

            {editingId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEdit(task.id);
                    }
                  }}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  className={task.completed ? 'completed' : ''}
                >
                  {task.text}
                </span>

                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>

        ))}
      </ul>

    </div>
  );
}

export default App;