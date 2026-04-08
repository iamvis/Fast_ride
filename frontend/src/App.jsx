import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoaderScreen from './components/LoaderScreen'

const UserLogin = lazy(() => import('./pages/UserLogin'))
const UserSignup = lazy(() => import('./pages/UserSignup'))
const CaptainLogin = lazy(() => import('./pages/CaptainLogin'))
const CaptainSignup = lazy(() => import('./pages/CaptainSignup'))
const Start = lazy(() => import('./pages/Start'))
const Home = lazy(() => import('./pages/Home'))
const UserProtetWrapper = lazy(() => import('./pages/UserProtetWrapper'))
const UserLogout = lazy(() => import('./pages/UserLogout'))
const CaptainHome = lazy(() => import('./pages/CaptainHome'))
const CaptainLogout = lazy(() => import('./pages/CaptainLogout'))
const CaptainProtectWrapper = lazy(() => import('./pages/CaptainProtectWrapper'))
const Riding = lazy(() => import('./pages/Riding'))
const CapatainRiding = lazy(() => import('./pages/CapatainRiding'))
const App = () => {
  
  return (
    <Suspense fallback={<LoaderScreen title="Loading Fastride" subtitle="Preparing the next screen and its trip data." />}>
      <div>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/riding' element={<Riding />} />
          <Route path='/captain-riding' element={<CapatainRiding />} />
          <Route path='/signup' element={<UserSignup />} />
          <Route path='/captain-login' element={<CaptainLogin />} />
          <Route path='/captain-signup' element={<CaptainSignup />} />
          <Route path='/home' element={
            <UserProtetWrapper>
              <Home />
            </UserProtetWrapper>
          } />
          <Route path='/user/logout' element={
            <UserProtetWrapper>
              <UserLogout />
            </UserProtetWrapper>
          } />
          <Route path='/captain-home' element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          } />
          <Route path='/captain/logout' element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          } />
        </Routes>
      </div>
    </Suspense>
  )
}

export default App
