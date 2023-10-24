import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { appHeaderSvg } from './Svgs'
import { useEffect, useState } from 'react'

export function AppHeader() {
    const boardStyle = useSelector((storeState) => storeState.boardModule.board.style) || null
    const [brightClass, setBrightClass] = useState(true)
    const board = useSelector((storeState) => storeState.boardModule.board)


    useEffect (()=>{
if (boardStyle) {
    setBrightClass (boardStyle?.isBright)
} else setBrightClass(true)
    },[board])

    return (
        <header className='app-header' style={{ backgroundColor: `rgb(${boardStyle?.dominantColor.rgb})` || 'white' }}>
            <section className='nav-links'>
                <button className= {'app-header-btn nav-link-btn menu' + (brightClass? ' dark-btn' : ' light-btn')}>{appHeaderSvg.menu}</button>
                <div className={'logo' + (brightClass? ' dark-btn' : ' light-btn')}>
                    <img src='https://res.cloudinary.com/dehxwadkk/image/upload/v1696466880/logo_transparent_dz6ld4.png' alt="" />
                </div>
                <section className='links'>
                    <NavLink to={"/workspace"}>
                        <button  className={'app-header-btn nav-link-btn link ' + (brightClass? ' dark-btn' : ' light-btn')}><span>Workspaces</span> {appHeaderSvg.arrowDown}</button>
                    </NavLink>
                    <button className={'app-header-btn nav-link-btn link ' + (brightClass? ' dark-btn' : ' light-btn')}><span>Recent</span> {appHeaderSvg.arrowDown}</button>
                    <button className={'app-header-btn nav-link-btn link ' + (brightClass? ' dark-btn' : ' light-btn')}> <span>Starred</span> {appHeaderSvg.arrowDown}</button>
                    <button className={'app-header-btn nav-link-btn link ' + (brightClass? ' dark-btn' : ' light-btn')}>Templats {appHeaderSvg.arrowDown}</button>
                </section>
                <button className={'create-btn' + (brightClass? ' dark-btn' : ' light-btn')}>Create</button>
            </section>

            <section className='nav-info'>
                <div className={'search-input' + (brightClass? ' dark-btn' : ' light-btn')} >
                    <span>{appHeaderSvg.search}</span>
                    <input type="text" placeholder='Search' />
                </div>
                <button className = {'app-header-btn user-info' + (brightClass? ' dark-btn' : ' light-btn')}>{appHeaderSvg.notifications}</button>
                <div className = {'app-header-btn user-info' + (brightClass? ' dark-btn' : ' light-btn')} >
                    <img src="https://res.cloudinary.com/dpwmxprpp/image/upload/v1696367658/1642589384427_hywpod.jpg" alt="" />
                </div>
            </section>
        </header>
    )
}