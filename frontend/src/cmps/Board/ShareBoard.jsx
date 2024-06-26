import { useState } from "react";
import { useSelector } from "react-redux";
import { updateBoard } from "../../store/actions/board.actions";
import { additionTaskSvg, taskSvg } from "../Svgs"

export function ShareBoard({ setIsOpenShareBoard }) {
    const users = useSelector(storeState => storeState.userModule.users)
    const board = useSelector(storeState => storeState.boardModule.board)
    const usersToDisplay = users.filter(user => user.username !== 'Guest')

    const [connectUsers, setConnectUsers] = useState(board.members)
    const [filterUsers, setFilterdUsers] = useState(usersToDisplay)

    function onUserSearch({ target }) {
        const filteredMembers = users.filter(user =>
            user.fullname.toLowerCase().includes(target.value.toLowerCase())
        )
        setFilterdUsers(filteredMembers)
    }

    async function onToggleMemberToBoard(user) {
        const userIdx = board.members.findIndex(member => member._id === user._id)
        if (userIdx === -1) {
            board.members = [...board.members, user]
        } else {
            board.members.splice(userIdx, 1)
        }
        const updatedGroups = board.groups.map(group => {
            const updatedTasks = group.tasks.map(task => {
                task.memberIds = task.memberIds.filter(memberId => memberId !== user._id)
                return task
            })

            return { ...group, tasks: updatedTasks }
        })

        const newBoard = { ...board, members: board.members, groups: updatedGroups };
        try {
            await updateBoard(newBoard)
            setConnectUsers(newBoard.members)
        } catch (err) {
            console.error('Could not save member on board', err);
        }

    }

    return (
        <section className="edit-modal shared-board">
            <div className="title-container">
                <p>Share your board</p>
                <button onClick={() => setIsOpenShareBoard(false)} className="close-modal">{additionTaskSvg.close}</button>
            </div>
            <section className="edit-modal-content shared-board">
                <div className="search">
                    <input
                        type="text"
                        name="username"
                        placeholder="Search users to add"
                        onChange={onUserSearch}
                        autoFocus
                    />
                </div>
                <div className='content'>
                    <p className='member-list-headline'>Trello users</p>
                    <ul className='member-list clean-list'>
                        {filterUsers.map(user =>
                        (<li className="member-preview" key={user._id}>
                            <section className='member-detail flex align-center' onClick={() => onToggleMemberToBoard(user)}>
                                <img src={user.imgUrl} alt="" />
                                <h2>{user.fullname} @{user.username}</h2>
                                {connectUsers.map(connected => {
                                    if (connected._id === user._id) {
                                        return (<span className='share-check flex align-center'>{taskSvg.check}</span>)
                                    }
                                })}
                            </section>
                        </li>)
                        )}
                    </ul>
                </div>
            </section >
        </section >
    )

}