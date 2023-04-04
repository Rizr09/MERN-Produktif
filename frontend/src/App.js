import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import NewData from './components/NewData';
import EditData from './components/EditData';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/newData" element={<><Navbar /><NewData /></>} />
        <Route path="/editData/:id" element={<><Navbar /><EditData /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
