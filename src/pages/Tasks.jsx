import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';

function getTaskColorClass(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  if (diffHours < 24) return 'task-urgent';
  if (diffHours < 72) return 'task-warning';
  return 'task-normal';
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    fetchTasks().then(res => {
      if (res.data.code === 0) setTasks(res.data.data);
    });
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim() || !newDueDate) return;
    const res = await createTask({ title: newTask, dueDate: newDueDate, description: newDesc });
    if (res.data.code === 0) {
      setTasks([...tasks, res.data.data]);
      setNewTask('');
      setNewDueDate('');
      setNewDesc('');
    } else {
      alert(res.data.msg || '添加失败');
    }
  };

  const handleDeleteTask = async (id) => {
    const res = await deleteTask(id);
    if (res.data.code === 0) {
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      alert(res.data.msg || '删除失败');
    }
  };

  const handleUpdateDueDate = async (id, value) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, dueDate: value });
    if (res.data.code === 0) {
      setTasks(tasks.map(t => t.id === id ? { ...t, dueDate: value } : t));
    } else {
      alert(res.data.msg || '修改失败');
    }
  };

  return (
    <div>
      <h1>任务列表</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${getTaskColorClass(task.dueDate)}`}>
            <div>
              <strong>{task.title}</strong>
              <button className="delete-btn" onClick={() => handleDeleteTask(task.id)} style={{ float: 'right' }}>删除</button>
            </div>
            <div>
              截止：
              <input
                type="date"
                value={task.dueDate}
                onChange={e => handleUpdateDueDate(task.id, e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </div>
            <div>
              {task.description}
            </div>
          </div>
        ))}
      </div>
      <div className="task-add">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="新任务名称"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={e => setNewDueDate(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <input
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="任务描述"
          style={{ marginLeft: 8, width: 160 }}
        />
        <button onClick={handleAddTask} style={{ marginLeft: 8 }}>添加任务</button>
      </div>
    </div>
  );
}