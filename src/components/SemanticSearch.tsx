import React, { useState } from 'react';
import { Card, Input, Button, Slider, Table, Spin } from 'antd';
import { apiService } from '../api/api';

interface SemanticSearchResult {
  id: number;
  subject: string;
  description: string;
  similarity: number;
}

const SemanticSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { 
      title: 'Similarity', 
      dataIndex: 'similarity', 
      key: 'similarity',
      render: (value: number) => `${(value * 100).toFixed(2)}%`,
      sorter: (a: SemanticSearchResult, b: SemanticSearchResult) => b.similarity - a.similarity,
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    apiService.semanticSearch(query, limit)
      .then(response => setResults(response.data))
      .catch(error => console.error('Error performing semantic search:', error))
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Semantic Search">
      <Input 
        placeholder="Enter search query" 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16 }}>
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

export default SemanticSearch;