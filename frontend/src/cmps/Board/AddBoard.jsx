import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

import { addBoard } from "../../store/actions/board.actions";
import { boardService } from "../../services/board.service.local";
import { utilService } from "../../services/util.service";
import { additionTaskSvg } from "../Svgs";

export function AddBoard({ pos, setModalState, setIsBoardAdded, addBoardPosition }) {

    const imgUrls = ['https://images.unsplash.com/photo-1696384036025-c7d7b7f6584d?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1696580436068-f19c26850e8b?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1568010967378-b92ea68220c5?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1594743896255-be81f8dfec3d?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
    const colorUrls = ['https://res.cloudinary.com/duvatj8kg/image/upload/v1697202531/707f35bc691220846678_bdydef.svg', 'https://res.cloudinary.com/duvatj8kg/image/upload/v1697202537/d106776cb297f000b1f4_kroicr.svg', 'https://res.cloudinary.com/duvatj8kg/image/upload/v1697202522/8ab3b35f3a786bb6cdac_ci3ilc.svg', 'https://res.cloudinary.com/dp0y6hy2o/image/upload/v1686384787/a7c521b94eb153008f2d_ex0umg.svg', 'https://res.cloudinary.com/duvatj8kg/image/upload/v1697202495/aec98becb6d15a5fc95e_dseafo.svg', 'https://res.cloudinary.com/dp0y6hy2o/image/upload/v1686389855/92e67a71aaaa98dea5ad_ogsw1y.svg']

    const user = useSelector((storeState) => storeState.userModule.user)

    const [getPos, setPos] = useState(pos)
    const [backGroundgImg, setBackGroundImg] = useState('https://images.unsplash.com/photo-1696384036025-c7d7b7f6584d?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
    const [boardTitle, setBoardTtile] = useState('')

    const navigate = useNavigate()

    function onSetBoardTtile() {
        let value = event.target.value
        setBoardTtile(value)
    }

    async function onSaveNewBoard() {
        if (!boardTitle) return
        const newBoard = boardService.getEmptyBoard()
        let savedBoard = { ...newBoard, title: boardTitle }
        if (backGroundgImg) {
            savedBoard.style.backgroundImage = backGroundgImg
            try {
                let dominantColor = await utilService.getDominantColor(backGroundgImg)
                savedBoard.style.dominantColor = dominantColor
                savedBoard.style.isBright = utilService.isRgbBright(dominantColor.rgb)
                setModalState(prevState => ({ ...prevState, isOpen: false, modal: '' }))
            } catch (err) {
                console.error('Could not get dominant color', err);
            }
        }
        try {
            const txt = `${user.fullname} opened this board.`;
            const addedBoard = await addBoard(savedBoard, user, txt)
            navigate(`/board/${addedBoard._id}`)
            handleBoardAdded()
        } catch (err) {
            console.error('Could not add new board', err);
        }
    }


    function handleBoardAdded(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        if (getPos) {
            setModalState(prevState => ({ ...prevState, isOpen: false, modal: '' }))
        } else setIsBoardAdded(false)
    }
    return (
        <section style={getPos ? { top: '0px', left: '15px' } : addBoardPosition}
            className="edit-modal add-board">
            <div className="title-container">
                <p className="add-board-title">Create board</p>
                <button onClick={(event) => {
                    handleBoardAdded(event);
                }} className="close-modal">{additionTaskSvg.close}</button>
            </div>
            <section className="edit-modal-content">
                <div className="content">
                    <div className="add-board-display flex justify-center">

                        <section style={{ "background-image": `url(${backGroundgImg})` }} className="display-container flex align-center justify-center">
                            <img className="display-img" src='https://res.cloudinary.com/duvatj8kg/image/upload/v1697199257/14cda5dc635d1f13bc48_l2c80b_1_mlqvif.svg' alt="" />
                        </section>
                    </div>
                    <section className="board-design">
                        <p className="title">Background</p>
                        <div className="img-option flex">
                            {imgUrls.map(imgUrl =>
                                (<img src={imgUrl} alt="" onClick={() => setBackGroundImg(imgUrl)} key={imgUrl} />)
                            )}
                        </div>
                        <div className="color-option flex">
                            {colorUrls.map(colorUrl => (
                                <>
                                    <img src={colorUrl} alt="" onClick={() => setBackGroundImg(colorUrl)} key={colorUrl} />
                                </>
                            ))}
                        </div>
                        <section className="board-title-input">
                            <p className="title input">Board title <span>*</span></p>
                            <input className={boardTitle ? 'fill-text' : 'none-text'} required id="addBoardTitle" type="text" value={boardTitle} onChange={onSetBoardTtile}
                            />
                            {!boardTitle && (
                                <section className="required-title flex">
                                    <span>👋</span>
                                    <p>Board title is required</p>
                                </section>
                            )}
                        </section>
                        <button className={`create-board clean-btn ${boardTitle ? '' : 'boardTileCheck'}`} onClick={onSaveNewBoard}>Create</button>
                    </section>
                </div>
            </section>
        </section>
    )
}
