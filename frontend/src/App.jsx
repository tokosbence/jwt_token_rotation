import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Main from './pages/MainProtected';
import PrivateRoute from '../utils/PrivateRoute';

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp/>}/>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Main/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
