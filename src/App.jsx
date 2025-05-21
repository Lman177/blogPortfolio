// src/App.jsx
import './App.css'; // giữ nguyên nếu là global css
import Header from './features/Header/Header'
import Home from './features/Home'; // đây là phần page chuyển từ `page.js`
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div lang="en" >
      
        <Header />

      <Home />
    </div>
  );
}

export default App;
