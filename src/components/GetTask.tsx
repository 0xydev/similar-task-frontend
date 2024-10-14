import React, { useState } from 'react';
import { Card, Input, Button, Descriptions, Spin, message } from 'antd';
import { apiService } from '../api/api';

interface Task {
  id: number;
  subject: string;
  description: string;
}

const GetTask: React.FC = () => {
  const [taskId, setTaskId] = useState('');
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    apiService.getTask(parseInt(taskId))
      .then(response => setTask(response.data))
      .catch(error => {
        console.error('Error fetching task:', error);
        message.error('Task not found');
        setTask(null);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Get Task">
      <Input 
        placeholder="Enter Task ID" 
        value={taskId} 
        onChange={e => setTaskId(e.target.value)}
        style={{ width: 200, marginRight: 16 }}
      />
      <Button type="primary" onClick={handleSearch}>Search</Button>

      {loading && <Spin />}

      {task && (
        <Descriptions title="Task Details" style={{ marginTop: 20 }}>
          <Descriptions.Item label="ID">{task.id}</Descriptions.Item>
          <Descriptions.Item label="Subject">{task.subject}</Descriptions.Item>
          <Descriptions.Item label="Description">{task.description}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

export default GetTask;