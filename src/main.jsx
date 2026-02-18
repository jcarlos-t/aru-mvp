import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Camera from './pages/Camera.jsx'
import Conversation from './pages/Conversation.jsx'
import InterviewSelection from './pages/InterviewSelection.jsx'
import InterviewMode from './pages/InterviewMode.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import Nosotros from './pages/Nosotros.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/camera" element={<Camera />} />
                <Route path="/conversation" element={<Conversation />} />
                <Route path="/interview-selection" element={<InterviewSelection />} />
                <Route path="/interview-mode" element={<InterviewMode />} />
                <Route path="/como-funciona" element={<ComoFunciona />} />
                <Route path="/nosotros" element={<Nosotros />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)

