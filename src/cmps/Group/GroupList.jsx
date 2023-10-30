import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { boardService } from '../../services/board.service.local.js'
import { saveGroup, removeGroup } from '../../store/actions/board.actions.js'
import { updateBoard } from '../../store/actions/board.actions.js'
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GroupPreview } from './GroupPreview.jsx'
import { checkList } from '../Svgs.jsx'

export function GroupList() {
    const [isInputExpand, setInputExpand] = useState(false)
    const [newGroup, setNewGroup] = useState(boardService.getEmptyGroup())
    const board = useSelector((storeState) => storeState.boardModule.board)
    const groups = board?.groups
    const [isLabelsShown, setIsLabelsShown] = useState(false)
    const [openMenuGroupId, setOpenMenuGroupId] = useState(null);
    const addListInput = useRef(null)
    const user = useSelector((storeState) => storeState.userModule.user)
    console.log(user);
    function handleChange(ev) {
        let { value, name: field } = ev.target
        setNewGroup((prevGroup) => ({ ...prevGroup, [field]: value }))
    }

    async function onSaveNewGroup(ev) {
        ev.preventDefault();
        if (!newGroup.title) return;
        try {
            const txt = `added a new group titled '${newGroup.title}'.`;
            await saveGroup(newGroup, board._id, user, txt)
            setNewGroup(boardService.getEmptyGroup())
            showSuccessMsg('New group')
            if (addListInput.current) {
                addListInput.current.focus();
            }
// await saveGroup(group, boardId, currUser, txt);

        } catch (err) {
            console.log('Failed to save new group', err)
        }
    }

    async function onEditGroup(groupId, { target }) {
        let groupToSave = getGroupById(groupId)
        groupToSave.title = target.value
        try {
            await saveGroup(groupToSave, board._id)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    async function onUpdateGroup(group) {
        try {
            await saveGroup(group, board._id)
        } catch (err) {
            console.log('cant sort group', err);
            throw err
        }
    }

    async function onUpdateBoard(board) {
        try {
            await updateBoard(board)
        } catch (err) {
            console.log('cant update board from group list', err);
            throw err
        }
    }

    function getGroupById(groupId) {
        const group = groups.find(group => group.id === groupId)
        return group
    }

    async function onRemoveGroup(group) {
        console.log(group);
        try {
            // await saveGroup(newGroup, board._id, user, txt)
            const txt = `deleted a group titled "${group.title}".`;
            await removeGroup(group, board._id, user,txt)
        } catch (err) {
            console.log('Failed to remove group', err)
        }
    }

    async function onDuplicateGroup(group) {
        let duplicatedGroup = { ...group }
        duplicatedGroup.id = null
        try {
            const txt = `duplicated group "${group.title}"`
            await saveGroup(duplicatedGroup, board._id, user, txt)
        } catch (err) {
            console.log('Failed to duplicate group', err)
            throw err
        }
    }

    function handleDrag(result) {
        const { destination, source, type } = result
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return
        const clonedBoard = { ...board }
        if (type === 'groups') {           
            const updatedGroups = [...clonedBoard.groups]
            const [movedGroup] = updatedGroups.splice(source.index, 1)
            updatedGroups.splice(destination.index, 0, movedGroup)
            clonedBoard.groups = updatedGroups;
            updateBoard(clonedBoard);
            return;
        }
        if (type === 'tasks') {
            const originalGroup = clonedBoard.groups.find(group => group.id === source.droppableId)
            const targetGroup = clonedBoard.groups.find(group => group.id === destination.droppableId)
            if (originalGroup === targetGroup) {
                const updatedTasks = [...originalGroup.tasks]
                const [movedTask] = updatedTasks.splice(source.index, 1)
                updatedTasks.splice(destination.index, 0, movedTask)
                originalGroup.tasks = updatedTasks
                updateBoard(clonedBoard)
                return
            } else {
                const tasksFromOriginalGroup = [...originalGroup.tasks]
                const tasksForTargetGroup = [...targetGroup.tasks]
                const [movedTask] = tasksFromOriginalGroup.splice(source.index, 1)
                tasksForTargetGroup.splice(destination.index, 0, movedTask)
                originalGroup.tasks = tasksFromOriginalGroup
                targetGroup.tasks = tasksForTargetGroup
                updateBoard(clonedBoard)
                return
            }
        }
    }

    if (!groups) return <div>Loading..</div>
    return (
        <div className='group-list-container'>
            <DragDropContext onDragEnd={handleDrag}>
                <Droppable droppableId="groups" type="groups" key="groups" direction="horizontal">
                    {(provided) => (
                        <ul
                            className='group-list clean-list'
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {board?.groups?.map((group, idx) => (
                                <Draggable
                                    draggableId={group.id}
                                    key={group.id}
                                    index={idx}
                                >
                                    {(provided) => (
                                        <li
                                            className='group-preview-container'
                                            key={group.id}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <GroupPreview
                                                onDuplicateGroup={onDuplicateGroup}
                                                onEditGroup={onEditGroup}
                                                setIsLabelsShown={setIsLabelsShown}
                                                isLabelsShown={isLabelsShown}
                                                onRemoveGroup={onRemoveGroup}
                                                labels={board.labels}
                                                members={board.members}
                                                group={group}
                                                handleDrag={handleDrag}
                                                openMenuGroupId={openMenuGroupId}
                                                setOpenMenuGroupId={setOpenMenuGroupId}
                                                onUpdateGroup={onUpdateGroup}
                                                onUpdateBoard={onUpdateBoard}
                                            />
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <section className='add-group-input'>
                {!isInputExpand ?
                    <div className='add-group-msg' onClick={() => setInputExpand(!isInputExpand)}>
                        <span>+ Add another list </span>
                    </div> :
                    <div className='add-group-input-expand'>
                        <input
                            ref={addListInput}
                            sx={{ border: 'none' }}
                            name="title"
                            placeholder="Enter list title..."
                            autoFocus={true}
                            value={newGroup.title}
                            onChange={handleChange}
                        />
                        <section className='add-controls'>
                            <Button type="submit" onClick={onSaveNewGroup}>Add list</Button>
                            <button className='cancel' onClick={() => setInputExpand(!isInputExpand)}>{checkList.x}</button>
                        </section>
                    </div>
                }
            </section>
        </div>
    );
}








