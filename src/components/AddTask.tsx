import React, { useState, useCallback, useMemo } from 'react';
import { Card, Form, Input, Button, List, message, Switch } from 'antd';
import { debounce } from 'lodash';
import { apiService } from '../api/api';

const { TextArea } = Input;

interface SimilarTask {
  id: number;
  subject: string;
  description: string;
  similarity: number;
}

const AddTask: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<SimilarTask[]>([]);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<SimilarTask[]>([]);
  const [isHybridSearch, setIsHybridSearch] = useState(false);

  const processSearchResults = (data: any[]): SimilarTask[] => {
    return data.map(item => ({
      id: item.id || 0,
      subject: item.subject || '',
      description: item.description || '',
      similarity: isHybridSearch ? (item.score || 0) : (item.similarity || 0)
    }));
  };

  const searchSimilarTasks = useMemo(
    () => debounce(async (query: string, field: 'subject' | 'description') => {
      if (query.length < 3) {
        field === 'subject' ? setSubjectSuggestions([]) : setDescriptionSuggestions([]);
        return;
      }
      
      try {
        const response = isHybridSearch
          ? await apiService.hybridSearch(query, 5, 0.5)
          : await apiService.searchSimilarTasks(query, 0.7, 5);
        
        const processedResults = processSearchResults(response.data);
        
        field === 'subject' 
          ? setSubjectSuggestions(processedResults)
          : setDescriptionSuggestions(processedResults);
      } catch (error) {
        console.error('Error searching similar tasks:', error);
      }
    }, 300),
    [isHybridSearch]
  );

  const onFinish = useCallback(async (values: any) => {
    setLoading(true);
    try {
      await apiService.addTask(values.subject, values.description);
      message.success('Task added successfully');
      form.resetFields();
      setSubjectSuggestions([]);
      setDescriptionSuggestions([]);
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task');
    }
    setLoading(false);
  }, [form]);

  const selectSuggestion = useCallback((task: SimilarTask, field: 'subject' | 'description') => {
    if (field === 'subject') {
      form.setFieldsValue({ 
        subject: task.subject,
        description: task.description 
      });
      setSubjectSuggestions([]);
      setDescriptionSuggestions([]);
    } else {
      form.setFieldsValue({ [field]: task[field] });
      setDescriptionSuggestions([]);
    }
  }, [form]);

  const renderSuggestions = useCallback((suggestions: SimilarTask[], field: 'subject' | 'description') => (
    <List
      size="small"
      dataSource={suggestions}
      renderItem={(item) => (
        <List.Item
          onClick={() => selectSuggestion(item, field)}
          style={{ cursor: 'pointer' }}
        >
          <List.Item.Meta
            title={item[field]}
            description={`Similarity: ${(item.similarity * 100).toFixed(2)}%`}
          />
        </List.Item>
      )}
    />
  ), [selectSuggestion]);

  return (
    <Card 
      title="Add New Task"
      extra={
        <Switch
          checkedChildren="Hybrid"
          unCheckedChildren="Semantic"
          checked={isHybridSearch}
          onChange={(checked) => {
            setIsHybridSearch(checked);
            setSubjectSuggestions([]);
            setDescriptionSuggestions([]);
          }}
        />
      }
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
          <Input 
            placeholder="Enter task subject" 
            onChange={(e) => searchSimilarTasks(e.target.value, 'subject')}
          />
        </Form.Item>
        {subjectSuggestions.length > 0 && (
          <Card size="small" title="Similar Subjects" style={{ marginBottom: 16 }}>
            {renderSuggestions(subjectSuggestions, 'subject')}
          </Card>
        )}
        
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea 
            rows={4} 
            placeholder="Enter task description"
            onChange={(e) => searchSimilarTasks(e.target.value, 'description')}
          />
        </Form.Item>
        {descriptionSuggestions.length > 0 && (
          <Card size="small" title="Similar Descriptions" style={{ marginBottom: 16 }}>
            {renderSuggestions(descriptionSuggestions, 'description')}
          </Card>
        )}
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(AddTask);