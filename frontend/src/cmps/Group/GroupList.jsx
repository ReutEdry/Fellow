import React from 'react'
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import { saveGroup, removeGroup } from '../../store/actions/board.actions.js'
import { updateBoard } from '../../store/actions/board.actions.js'

import { boardService } from '../../services/board.service.local.js'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { GroupPreview } from './GroupPreview.jsx'
import { TaskFilter } from '../Task/TaskFilter.jsx'

import Button from '@mui/joy/Button';
import { checkList } from '../Svgs.jsx'


export function GroupList({ setIsFiltersOpen, isFiltersOpen }) {

    const board = useSelector((storeState) => storeState.boardModule.board)
    const user = useSelector((storeState) => storeState.userModule.user)

    let groups = board?.groups

    const addListInput = useRef(null)
    const [isInputExpand, setInputExpand] = useState(false)
    const [newGroup, setNewGroup] = useState(boardService.getEmptyGroup())
    const [isLabelsShown, setIsLabelsShown] = useState(false)
    const [openMenuGroupId, setOpenMenuGroupId] = useState(null);
    const [taskFilterBy, setTaskFilterby] = useState(boardService.getEmptyFilter())
    const [checkboxContainer, setCheckboxContainer] = useState([])
    const [containerClass, setContainerClass] = useState('')

    const filteredGroups = onFilterGroups(taskFilterBy)

    function onFilterGroups(filterBy) {
        const { txt, byMembers, byDuedate, byLabels } = filterBy
        groups = groups.map(group => {
            let filteredTasks = group.tasks

            if (txt) {
                const regExp = new RegExp(txt, 'i')
                filteredTasks = filteredTasks.filter(task => regExp.test(task.title))
            }

            if (byMembers) {
                filteredTasks = filteredTasks.filter(task => {
                    const conditions = []
                    if (byMembers.isAll) conditions.push(board.members.every(boardMember => task.memberIds.includes(boardMember._id)))
                    if (byMembers.isMe) conditions.push(task.memberIds.includes(user._id))
                    if (byMembers.isNoOne) conditions.push(task.memberIds.length === 0)
                    if (byMembers.someMembers.length) conditions.push(byMembers.someMembers.some(someMember => task.memberIds.includes(someMember)))
                    return conditions.length === 0 || conditions.some(condition => condition)
                });
            }


            if (byDuedate) {
                filteredTasks = filteredTasks.filter(task => {
                    const conditions = []
                    if (byDuedate.isComplete) conditions.push(task.dueDate.isComplete)
                    if (byDuedate.isDate) conditions.push(!task.dueDate.date)
                    if (byDuedate.isDuesoon) conditions.push(task.dueDate.isDueSoon && !task.dueDate.isComplete)
                    if (byDuedate.isOverdue) conditions.push(task.dueDate.isOverdue && !task.dueDate.isComplete)
                    return conditions.length === 0 || conditions.some(condition => condition)
                })
            }

            if (byLabels) {
                filteredTasks = filteredTasks.filter(task => {
                    const conditions = []
                    if (byLabels.isNoOne) conditions.push(task.labelIds.length === 0)
                    if (byLabels.isAll) conditions.push(board.labels.every(boardLabel => task.labelIds.includes(boardLabel.id)))
                    if (byLabels.someLabel.length) conditions.push(byLabels.someLabel.some(label => task.labelIds.includes(label)))
                    return conditions.length === 0 || conditions.some(condition => condition)
                })
            }

            return { ...group, tasks: filteredTasks }
        })

        return groups
    }

    function handelCheckBox(checkboxName) {
        setCheckboxContainer((prevChecked) => {
            if (prevChecked.includes(checkboxName)) {
                return prevChecked.filter((name) => name !== checkboxName)
            } else {
                return [...prevChecked, checkboxName]
            }
        })
    }


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
            if (addListInput.current) {
                addListInput.current.focus();
            }
        } catch (err) {
            console.error('Failed to save new group', err)
        }
    }

    async function onEditGroup(groupId, { target }) {
        let groupToSave = getGroupById(groupId)
        groupToSave.title = target.value
        try {
            await saveGroup(groupToSave, board._id)
        } catch (err) {
            console.error('Failed to edit group', err);
            throw err
        }
    }

    async function onUpdateGroup(group) {
        try {
            await saveGroup(group, board._id)
        } catch (err) {
            console.error('Failed to update group', err);
            throw err
        }
    }

    async function onUpdateBoard(board) {
        try {
            await updateBoard(board)
        } catch (err) {
            console.error('Failed to update board', err);
            throw err
        }
    }

    function getGroupById(groupId) {
        const group = groups.find(group => group.id === groupId)
        return group
    }

    async function onRemoveGroup(group) {
        try {
            const txt = `deleted a group titled "${group.title}".`;
            await removeGroup(group, board._id, user, txt)
        } catch (err) {
            console.error('Failed to remove group', err);
        }
    }

    async function onDuplicateGroup(group) {
        let duplicatedGroup = { ...group }
        duplicatedGroup.id = null
        try {
            const txt = `duplicated group "${group.title}"`
            await saveGroup(duplicatedGroup, board._id, user, txt)
        } catch (err) {
            console.error('Failed to duplicate group', err)
            throw err
        }
    }



    function handleDrag(result) {
        const { destination, source, type } = result
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return
        const clonedBoard = structuredClone(board)
        if (type === 'groups') {
            const updatedGroups = [...clonedBoard.groups]
            const [movedGroup] = updatedGroups.splice(source.index, 1)
            updatedGroups.splice(destination.index, 0, movedGroup)
            clonedBoard.groups = updatedGroups;
            updateBoard(clonedBoard);
        }

        if (type === 'tasks') {
            const originalGroup = clonedBoard.groups.find(group => group.id === source.droppableId)
            const targetGroup = clonedBoard.groups.find(group => group.id === destination.droppableId)
            if (originalGroup === targetGroup) {
                const updatedTasks = [...originalGroup.tasks]
                const [movedTask] = updatedTasks.splice(source.index, 1)
                updatedTasks.splice(destination.index, 0, movedTask)
                originalGroup.tasks = updatedTasks
                updateBoard(clonedBoard);
            } else {
                const tasksFromOriginalGroup = [...originalGroup.tasks]
                const tasksForTargetGroup = [...targetGroup.tasks]
                const [movedTask] = tasksFromOriginalGroup.splice(source.index, 1)
                tasksForTargetGroup.splice(destination.index, 0, movedTask)
                originalGroup.tasks = tasksFromOriginalGroup
                targetGroup.tasks = tasksForTargetGroup
                const txt = `moved ${movedTask.title} from ${originalGroup.title} to ${targetGroup.title} `

                updateBoard(clonedBoard, user, txt);
            }
        }
    }

    if (!groups) return <div>Loading..</div>
    return (
        <div className={'group-list-container ' + containerClass}>
            {isFiltersOpen && <TaskFilter
                setIsFiltersOpen={setIsFiltersOpen}
                groups={groups}
                setTaskFilterby={setTaskFilterby}
                taskFilterBy={taskFilterBy}
                checkboxContainer={checkboxContainer}
                handelCheckBox={handelCheckBox}
                setCheckboxContainer={setCheckboxContainer}
            />}
            <DragDropContext onDragEnd={handleDrag}>
                <Droppable droppableId="groups" type="groups" key="groups" direction="horizontal">
                    {(provided) => (
                        <ul
                            className='group-list clean-list'
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {filteredGroups.map((group, idx) => (
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
                                                setContainerClass={setContainerClass}
                                                // setTaskFilterby={setTaskFilterby}
                                                taskFilterBy={taskFilterBy}
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



