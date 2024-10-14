import React, { useState } from 'react';
import { Card, Input, Button, Slider, Table, Spin } from 'antd';
import { apiService } from '../api/api';

interface HybridSearchResult {
  id: number;
  subject: string;
  description: string;
  score: number;
}

const HybridSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [semanticWeight, setSemanticWeight] = useState(0.5);
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState<HybridSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { 
      title: 'Score', 
      dataIndex: 'score', 
      key: 'score',
      render: (value: number) => value.toFixed(4),
      sorter: (a: HybridSearchResult, b: HybridSearchResult) => b.score - a.score,
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    apiService.hybridSearch(query, limit, semanticWeight)
      .then(response => setResults(response.data))
      .catch(error => console.error('Error performing hybrid search:', error))
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Hybrid Search">
      <Input 
        placeholder="Enter search query" 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16 }}>
        <span>Semantic Weight: </span>
        <Slider 
          min={0}
          max={1}
          step={0.1}
          value={semanticWeight}
          onChange={setSemanticWeight}
          style={{ width: 200, display: 'inline-block', marginLeft: 8, marginRight: 16 }}
        />
        <span>Limit: </span>
        <Slider 
          min={1}
          max={50}
          step={1}
          value={limit}
          onChange={setLimit}
          style={{ width: 200, display: 'inline-block', marginLeft: 8 }}
        />
      </div>
      <Button type="primary" onClick={handleSearch}>Search</Button>

      {loading && <Spin style={{ marginTop: 20 }} />}

      <Table 
        columns={columns} 
        dataSource={results}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
    </Card>
  );
};

export default HybridSearch;