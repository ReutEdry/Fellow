import React from 'react'
import { Routes, Route } from 'react-router'
import { AppHeader } from './cmps/AppHeader'
import { HomePage } from './pages/HomePage'
import { Workspace } from './pages/Workspace'
import { BoardDetails } from './pages/BoardDetails'
import { LoginSignup } from './pages/LoginSignup'
import { TaskDetails } from './cmps/Task/TaskDetails/TaskDetails'
import { SearchBoard } from './pages/SearchBoard'
import { useState, useEffect } from 'react';
import { HomeHeader } from './cmps/HomeHeader'
import { useLocation } from 'react-router-dom/dist'
import { loadUsers, login } from './store/actions/user.actions'
import { useSelector } from 'react-redux'

export function App() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation()
    const user = useSelector(storeState => storeState.userModule.user)
    const [isLogin, setIsLogin] = useState(true)


    useEffect(() => {
        onLoadUsers()
    }, [user])

    async function onLoadUsers() {
        console.log('app:', user);
        if (user?.fullname === 'Guest') return
        try {
            await loadUsers()
            if (!user) {
                await login({ username: 'Guest', password: '1234' })
                setIsLogin(true)
            } else {
                setIsLogin(false)
            }
        } catch (err) {
            console.log('Can not load users', err)
        }
    }



    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        };
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    return (
        <div>
            {(location.pathname !== '/login') && ((location.pathname === '/') ? <HomeHeader isLogin={isLogin} /> : <AppHeader />)}
            <main>
                <Routes>
                    {windowWidth < 920 ? (
                        <Route path="/" element={<LoginSignup />} />
                    ) : (
                        <Route path="/" element={<HomePage />} />
                    )}
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/search" element={<SearchBoard />} />
                    <Route path="/board/:boardId" element={<BoardDetails />}>
                        <Route path=":groupId/:taskId" element={<TaskDetails />} />
                    </Route>
                    <Route path="/login" element={<LoginSignup />} />
                </Routes>
            </main>
        </div>
    );
}

