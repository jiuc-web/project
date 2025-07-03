import { useState } from 'react';

function getTaskColorClass(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  if (diffHours < 24) return 'task-urgent';
  if (diffHours < 72) return 'task-warning';
  return 'task-normal';
}

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: '完成前端页面', dueDate: '2025-07-05' },
    { id: 2, title: '整理后端接口文档', dueDate: '2025-07-10' }
  ]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim() || !newDueDate) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTask, dueDate: newDueDate }
    ]);
    setNewTask('');
    setNewDueDate('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <h1>任务列表</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${getTaskColorClass(task.dueDate)}`}>
            <div>
              <strong>{task.title}</strong>
              <span style={{ float: 'right', fontSize: 12 }}>
                截止：{task.dueDate}
              </span>
            </div>
            <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>删除</button>
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
        <button onClick={handleAddTask} style={{ marginLeft: 8 }}>添加任务</button>
      </div>
    </div>
  );
}