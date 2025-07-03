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
    { id: 1, title: '完成前端页面', dueDate: '2025-07-05', description: '实现任务管理系统前端页面', expanded: false },
    { id: 2, title: '整理后端接口文档', dueDate: '2025-07-10', description: '补全接口文档，便于前后端联调', expanded: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim() || !newDueDate) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTask, dueDate: newDueDate, description: newDesc, expanded: false }
    ]);
    setNewTask('');
    setNewDueDate('');
    setNewDesc('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleExpand = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, expanded: !task.expanded } : task
    ));
  };

  const handleDescChange = (id, value) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, description: value } : task
    ));
  };

  const handleDueDateChange = (id, value) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, dueDate: value } : task
    ));
  };

  return (
    <div>
      <h1>任务列表</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${getTaskColorClass(task.dueDate)}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  marginRight: 8,
                  background: getTaskColorClass(task.dueDate) === 'task-urgent'
                    ? '#ff6b6b'
                    : getTaskColorClass(task.dueDate) === 'task-warning'
                    ? '#feca57'
                    : '#1dd1a1'
                }}
                title={
                  getTaskColorClass(task.dueDate) === 'task-urgent'
                    ? '紧急'
                    : getTaskColorClass(task.dueDate) === 'task-warning'
                    ? '即将到期'
                    : '充裕'
                }
              ></span>
              <strong>{task.title}</strong>
              <button
                style={{ marginLeft: 'auto', marginRight: 8 }}
                onClick={() => handleToggleExpand(task.id)}
              >
                {task.expanded ? '收起' : '展开'}
              </button>
              <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>删除</button>
            </div>
            <div style={{ marginTop: 8 }}>
              截止：
              <input
                type="date"
                value={task.dueDate}
                onChange={e => handleDueDateChange(task.id, e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </div>
            {task.expanded && (
              <div style={{ marginTop: 8 }}>
                <textarea
                  value={task.description}
                  onChange={e => handleDescChange(task.id, e.target.value)}
                  rows={3}
                  style={{ width: '100%' }}
                  placeholder="任务详细描述"
                />
              </div>
            )}
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