import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './components/Home';
import PostLead from './components/PostLead';
import GetAllLeads from './components/GetAllLeads';
import Register from './components/Register';
import Login from './components/Login';
import GetMyLeads from './components/GetMyLeads';
import EditLead from './components/EditLead';

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/post-lead' element={<PostLead/>}/>
            <Route path='/get-all-leads' element={<GetAllLeads/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/my-leads' element={<GetMyLeads/>}/>
            <Route path='/edit-lead/:id' element={<EditLead/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter