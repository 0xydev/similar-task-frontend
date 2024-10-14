import React, { useState, useEffect } from 'react';
import { Card, Slider, Button, Table, Spin, message, Switch } from 'antd';
import { apiService } from '../api/api';

interface DuplicateTask {
  task1: { id: number; subject: string; description: string };
  task2: { id: number; subject: string; description: string };
  similarity: number;
}

interface CachedData {
  duplicates: DuplicateTask[];
  timestamp: number;
  threshold: number;
}

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const FindDuplicates: React.FC = () => {
  const [threshold, setThreshold] = useState(0.9);
  const [duplicates, setDuplicates] = useState<DuplicateTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [useCachedData, setUseCachedData] = useState(true);

  const columns = [
    { title: 'Task 1 ID', dataIndex: ['task1', 'id'], key: 'task1Id' },
    { title: 'Task 1 Subject', dataIndex: ['task1', 'subject'], key: 'task1Subject' },
    { title: 'Task 2 ID', dataIndex: ['task2', 'id'], key: 'task2Id' },
    { title: 'Task 2 Subject', dataIndex: ['task2', 'subject'], key: 'task2Subject' },
    { 
      title: 'Similarity', 
      dataIndex: 'similarity', 
      key: 'similarity', 
      render: (value: number) => `${(value * 100).toFixed(2)}%`,
      sorter: (a: DuplicateTask, b: DuplicateTask) => b.similarity - a.similarity,
    },
  ];

  useEffect(() => {
    const cachedData = localStorage.getItem('findDuplicatesCache');
    if (cachedData) {
      const parsedData: CachedData = JSON.parse(cachedData);
      const now = new Date().getTime();
      if (now - parsedData.timestamp < CACHE_EXPIRY && parsedData.threshold === threshold) {
        setDuplicates(parsedData.duplicates);
      }
    }
  }, [threshold]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const cachedData = localStorage.getItem('findDuplicatesCache');
      if (useCachedData && cachedData) {
        const parsedData: CachedData = JSON.parse(cachedData);
        const now = new Date().getTime();
        if (now - parsedData.timestamp < CACHE_EXPIRY && parsedData.threshold === threshold) {
          setDuplicates(parsedData.duplicates);
          message.info('Using cached data');
          setLoading(false);
          return;
        }
      }

      const response = await apiService.findDuplicates(threshold);
      const formattedDuplicates = response.data.map((item: any[]) => ({
        task1: { id: item[0], subject: item[3], description: '' },
        task2: { id: item[1], subject: item[4], description: '' },
        similarity: item[2],
      }));
      setDuplicates(formattedDuplicates);
      localStorage.setItem('findDuplicatesCache', JSON.stringify({
        duplicates: formattedDuplicates,
        timestamp: new Date().getTime(),
        threshold: threshold
      }));
      message.success(`Found ${formattedDuplicates.length} duplicate tasks`);
    } catch (error) {
      console.error('Error finding duplicates:', error);
      message.error('Failed to find duplicate tasks. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <Card title="Find Duplicates">
      <Slider 
        min={0.5}
        max={1}
        step={0.01}
        value={threshold}
        onChange={setThreshold}
        marks={{ 0.5: '50%', 0.75: '75%', 1: '100%' }}
        style={{ width: 300, marginBottom: 20 }}
      />
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={useCachedData}
          onChange={setUseCachedData}
          checkedChildren="Use Cache"
          unCheckedChildren="Always New"
          style={{ marginRight: 16 }}
        />
        <Button type="primary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Find Duplicates'}
        </Button>
      </div>

      {loading && (
        <Card style={{ marginTop: 20 }}>
          <Spin />
          <p>Searching for duplicate tasks. This may take several minutes. Please wait...</p>
        </Card>
      )}

      {!loading && duplicates.length > 0 && (
        <Table 
          columns={columns} 
          dataSource={duplicates}
          rowKey={(record) => `${record.task1.id}-${record.task2.id}`}
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && duplicates.length === 0 && (
        <Card style={{ marginTop: 20 }}>
          <p>No duplicate tasks found or no results to display.</p>
        </Card>
      )}
    </Card>
  );
};

export default FindDuplicates;