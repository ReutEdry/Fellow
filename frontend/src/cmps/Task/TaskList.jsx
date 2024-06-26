import { Droppable, Draggable } from 'react-beautiful-dnd';
import { boardService } from "../../services/board.service.local";
import { TaskPreview } from "./TaskPreview";


export function TaskList({ tasks, labels, members, isLabelsShown, setIsLabelsShown, groupId, onScrollDown, setContainerClass }) {

    if (!tasks) return <div>Loading...</div>;

    return (
        <>
            <Droppable droppableId={groupId}
                key="tasks"
                type="tasks"
            >
                {(provided) => (
                    <section className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
                        {tasks.map((task, index) => {
                            const taskLabels = labels.filter(label => task.labelIds.includes(label.id)) || null
                            const taskMembers = members.filter(member => task.memberIds.includes(member._id)) || null
                            const taskChecklist = task.checklists.length ? boardService.getCheckListStatus(task.checklists) : '';

                            return (
                                <Draggable
                                    key={task.id}
                                    group={groupId}
                                    type={task}
                                    draggableId={task.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            key={task.id}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >

                                            <TaskPreview
                                                tasks={tasks}
                                                onScrollDown={onScrollDown}
                                                setIsLabelsShown={setIsLabelsShown}
                                                isLabelsShown={isLabelsShown}
                                                task={task}
                                                taskLabels={taskLabels}
                                                taskMembers={taskMembers}
                                                taskChecklist={taskChecklist}
                                                groupId={groupId}
                                                setContainerClass={setContainerClass}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </section>
                )}
            </Droppable>
        </>
    );
}
