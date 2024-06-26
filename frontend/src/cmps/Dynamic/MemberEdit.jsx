import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Textarea } from '@mui/joy';
import { additionTaskSvg, taskSvg } from '../Svgs'

export function MemberEdit({ pos, editName, onCloseEditTask, onSaveTask, task }) {

    const board = useSelector(storeState => storeState.boardModule.board)
    const user = useSelector(storeState => storeState.userModule.user)

    const membersToDisplay = board.members.filter(boardMembers => boardMembers.username !== 'Guest')

    const [filterMembers, setFilterdMembers] = useState(membersToDisplay)
    const [connectMembers, setConnectMembers] = useState(task.memberIds)

    function onMemberSearch({ target }) {
        const filteredMembers = board.members.filter(member =>
            member.fullname.toLowerCase().includes(target.value.toLowerCase())
        )
        setFilterdMembers(filteredMembers)
    }

    async function onToggleMemberToTask(memberId) {
        let txt
        let newTask
        try {
            const memberIdx = task.memberIds.findIndex(id => id === memberId)
            if (memberIdx === -1) {
                newTask = { ...task, memberIds: [...task.memberIds, memberId] }
                if (user._id === memberId) txt = setUserTxt(memberId, 'joined')
                else txt = setUserTxt(memberId, 'added', 'to')
            } else {
                const updatedMembers = [...task.memberIds]
                updatedMembers.splice(memberIdx, 1)
                newTask = { ...task, memberIds: updatedMembers }
                if (user._id === memberId) txt = setUserTxt(memberId, 'left')
                else txt = setUserTxt(memberId, 'removed', 'from')
            }
            onSaveTask(newTask, txt)
            setConnectMembers(newTask.memberIds)
        } catch (err) {
            console.error('Could not save date =>', err)
        }
    }

    function setUserTxt(memberId, txtValue, option) {
        let txt
        if (user._id === memberId) {
            txt = `${txtValue} to ${task.title}`
        } else {
            const addedMembr = board.members.find(member => member._id === memberId)
            if (!addedMembr) return
            else txt = `${txtValue} ${addedMembr.fullname} ${option} ${task.title}`
        }
        return txt
    }

    return (
        <section style={{ top: pos.top, left: pos.left }} className="edit-modal slide-up">
            <div className="title-container">
                <p>{editName}</p>
                <button onClick={onCloseEditTask} className="close-modal">{additionTaskSvg.close}</button>
            </div>
            <section className="edit-modal-content">
                <div className="search">
                    <Textarea placeholder="Search members" onChange={onMemberSearch}
                        sx={{
                            fontSize: 14, fontWeight: 'medium', borderRadius: '3px', boxShadow: 'inset 0 0 0 1px #091e4224', bgcolor: 'white',
                            outline: 'none',
                            '&:focus': {
                                boxShadow: 'inset 0 0 0 2px #388bff'
                            }
                        }}>
                    </Textarea>
                </div>
                <div className='content'>
                    <p className='member-list-headline'>Board members</p>
                    <ul className='member-list clean-list'>
                        {filterMembers.map(member =>
                        (<li className="member-preview" key={member._id}>
                            <section className='member-detail flex align-center' onClick={() => onToggleMemberToTask(member._id, board)}>
                                <img src={member.imgUrl} alt="" />
                                <h2>{member.fullname}</h2>
                                {connectMembers.map(connected => {
                                    if (connected === member._id) {
                                        return (<span className='flex align-center'>{taskSvg.check}</span>)
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
