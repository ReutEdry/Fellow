import dayjs from "dayjs";
import { utilService } from "../../services/util.service";
import { taskSvg } from "../Svgs";

export function TaskPreview({ task, setIsLabelsShown, isLabelsShown, taskLabels, taskMembers, taskChecklist }) {

    function onLabelOpen(ev) {
        ev.preventDefault()
        setIsLabelsShown(!isLabelsShown)
    }

    if (!task) return <div>Loading...</div>

    const { dueDate } = task

    return (
        <article key={task.id} className="task">
            <button>{taskSvg.edit}</button>
            {task.cover?.backgroundColor && <div className="task-cover" style={{ backgroundColor: task.cover.backgroundColor }}></div>}
            {task.cover?.img && <img className="task-cover" src={task.cover.img} alt="" />}

            <section className="task-info">
                <section className="labels">
                    {taskLabels.map(label => {
                        return <div key={label.id} className={"label " + (isLabelsShown ? 'open' : 'close')} style={{ backgroundColor: label.color }}
                            onClick={onLabelOpen} >
                            {label.title && <span>{label.title}</span>} </div>
                    })}
                </section>
                <h3>{task?.title}</h3>
                <section className="task-badges">
                    {task.watching && <div className="task-badge">{taskSvg.watch}</div>}
                    {dueDate && <div className="task-badge">{taskSvg.clock} <span>{dayjs(dueDate, 'MMM D [at] h:mm A').format('MMM D, YYYY')}
                    </span></div>}
                    {task.description && <div className="task-badge">{taskSvg.description}</div>}
                    {task.comments?.length > 0 && <div className="task-badge">{taskSvg.comment} <span>{task.comments.length}</span></div>}
                    {task.attachments?.length > 0 && <div className="task-badge">{taskSvg.attatchment} <span>{task.attachments.length}</span></div>}
                    {task.checklists?.length > 0 && <div className="task-badge">{taskSvg.checklist}
                        <span>{taskChecklist.done}/{taskChecklist.all}</span></div>}
                </section>

                {task.memberIds?.length > 0 &&
                    <section className="task-members">
                        {taskMembers.map(member => <img key={member._id} className="member" src={member.imgUrl} alt="" />)}
                    </section>
                }

            </section>
        </article>
    )
}