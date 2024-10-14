import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin, Empty } from 'antd';
import { apiService } from '../api/api';

interface Stats {
  distance: string;
  name: string;
  point_count: number;
  vector_count: number | null;
  vector_size: number;
}

const CollectionStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getCollectionStats()
      .then(response => setStats(response.data))
      .catch(error => {
        console.error('Error fetching stats:', error);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" />;

  if (!stats) return <Empty description="No collection stats available" />;

  return (
    <Card title="Collection Statistics">
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Collection Name" value={stats.name} />
        </Col>
        <Col span={8}>
          <Statistic title="Distance Metric" value={stats.distance} />
        </Col>
        <Col span={8}>
          <Statistic title="Point Count" value={stats.point_count} />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Statistic title="Vector Count" value={stats.vector_count || 'N/A'} />
        </Col>
        <Col span={8}>
          <Statistic title="Vector Size" value={stats.vector_size} />
        </Col>
      </Row>
    </Card>
  );
};

export default CollectionStats;