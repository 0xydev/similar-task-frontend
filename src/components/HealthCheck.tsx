import React, { useState, useEffect } from 'react';
import { Card, Spin, Result, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { apiService } from '../api/api';

interface HealthStatus {
  status: 'OK' | 'Error';
  qdrant_connection: 'OK' | 'Error';
}

const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.healthCheck()
      .then(response => {
        setHealth(response.data as HealthStatus);
      })
      .catch(() => {
        setHealth({ status: 'Error', qdrant_connection: 'Error' });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" />;

  const StatusIcon = ({ status }: { status: 'OK' | 'Error' }) => (
    status === 'OK' ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />
  );

  return (
    <Card title="Health Check">
      {health ? (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Result
            status={health.status === 'OK' ? 'success' : 'error'}
            title={`System Status: ${health.status}`}
            subTitle={health.status === 'OK' ? 'All systems are running correctly' : 'There might be some issues with the services'}
          />
          <Card type="inner" title="Detailed Status">
            <p><StatusIcon status={health.status} /> Overall System Status: {health.status}</p>
            <p><StatusIcon status={health.qdrant_connection} /> Qdrant Connection: {health.qdrant_connection}</p>
          </Card>
        </Space>
      ) : (
        <Result
          status="error"
          title="Failed to fetch health status"
          subTitle="There was an error while trying to fetch the health status"
        />
      )}
    </Card>
  );
};

export default HealthCheck;