import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

