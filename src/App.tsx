import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HeartTwoTone,
  BarChartOutlined,
  UnorderedListOutlined,
  FileSearchOutlined,
  CopyOutlined,
  SearchOutlined,
  BuildOutlined,
  BulbOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
import HealthCheck from './components/HealthCheck';
import CollectionStats from './components/CollectionStats';
import ListTasks from './components/ListTasks';
import GetTask from './components/GetTask';
import FindDuplicates from './components/FindDuplicates';
import SearchSimilarTasks from './components/SearchSimilarTasks';
import HybridSearch from './components/HybridSearch';
import SemanticSearch from './components/SemanticSearch';
import AddTask from './components/AddTask';

const { Content, Sider } = Layout;

const logoUrl = "https://www.ulakhaberlesme.com.tr/Ulak/img/ulak-haberlesme-beyaz-logo.svg";

const SideMenu: React.FC = () => {
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    switch (path) {
      case '/': return '1';
      case '/stats': return '2';
      case '/list': return '3';
      case '/get': return '4';
      case '/duplicates': return '5';
      case '/similar': return '6';
      case '/hybrid': return '7';
      case '/semantic': return '8';
      case '/add': return '9';
      default: return '1';
    }
  };

  return (
    <>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <img 
          src={logoUrl} 
          alt="ULAK Logo" 
          style={{ 
            height: '40px',
            marginBottom: '24px'
          }} 
        />
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
        <Menu.Item key="1" icon={<HeartTwoTone />}>
          <Link to="/">Health Check</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<BarChartOutlined />}>
          <Link to="/stats">Collection Stats</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UnorderedListOutlined />}>
          <Link to="/list">List Tasks</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<FileSearchOutlined />}>
          <Link to="/get">Get Task</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<CopyOutlined />}>
          <Link to="/duplicates">Find Duplicates</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<SearchOutlined />}>
          <Link to="/similar">Search Similar Tasks</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<BuildOutlined />}>
          <Link to="/hybrid">Hybrid Search</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<BulbOutlined />}>
          <Link to="/semantic">Semantic Search</Link>
        </Menu.Item>
        <Menu.Item key="9" icon={<PlusCircleOutlined />}>
          <Link to="/add">Add Task</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} theme="dark">
          <SideMenu />
        </Sider>
        <Layout style={{ padding: '24px 24px 24px' }}>
          <Content 
            style={{ 
              background: '#fff', 
              padding: 24, 
              margin: 0, 
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<HealthCheck />} />
              <Route path="/stats" element={<CollectionStats />} />
              <Route path="/list" element={<ListTasks />} />
              <Route path="/get" element={<GetTask />} />
              <Route path="/duplicates" element={<FindDuplicates />} />
              <Route path="/similar" element={<SearchSimilarTasks />} />
              <Route path="/hybrid" element={<HybridSearch />} />
              <Route path="/semantic" element={<SemanticSearch />} />
              <Route path="/add" element={<AddTask />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;