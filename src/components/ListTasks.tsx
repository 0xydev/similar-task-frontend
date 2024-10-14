import React, { useState, useEffect } from 'react';
import { Table, Card, message, Select } from 'antd';
import { apiService } from '../api/api';

const { Option } = Select;

interface Task {
  id: number;
  subject: string;
  description: string;
}

const ListTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [showAll, setShowAll] = useState(false);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
  ];

  const fetchTasks = (page: number, pageSize: number) => {
    setLoading(true);
    const limit = showAll ? 1000 : pageSize; // Use a large number for "All"
    apiService.listTasks(limit, (page - 1) * (showAll ? 0 : pageSize))
      .then(response => {
        console.log('API Response:', response.data);
        if (Array.isArray(response.data)) {
          setTasks(response.data);
          setPagination({
            ...pagination,
            current: page,
            total: showAll ? response.data.length : response.data.length + (page - 1) * pageSize
          });
        } else {
          throw new Error('Invalid data structure');
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        message.error('Failed to fetch tasks. Please try again later.');
        setTasks([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks(pagination.current, pagination.pageSize);
  }, [showAll]);

  const handleTableChange = (newPagination: any) => {
    if (!showAll) {
      fetchTasks(newPagination.current, newPagination.pageSize);
    }
  };

  const handlePageSizeChange = (value: number | string) => {
    if (value === 'all') {
      setShowAll(true);
      setPagination({ ...pagination, pageSize: tasks.length, current: 1 });
    } else {
      setShowAll(false);
      const newPageSize = Number(value);
      setPagination({ ...pagination, pageSize: newPageSize, current: 1 });
      fetchTasks(1, newPageSize);
    }
  };

  return (
    <Card 
      title="List Tasks" 
      extra={
        <Select 
          defaultValue={pagination.pageSize} 
          style={{ width: 120 }} 
          onChange={handlePageSizeChange}
        >
          <Option value={10}>10 / page</Option>
          <Option value={20}>20 / page</Option>
          <Option value={50}>50 / page</Option>
          <Option value={100}>100 / page</Option>
          <Option value="all">Tümü</Option>
        </Select>
      }
    >
      <Table 
        columns={columns} 
        dataSource={tasks} 
        rowKey="id"
        pagination={showAll ? false : pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default ListTasks;