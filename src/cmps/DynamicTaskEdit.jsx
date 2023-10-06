import { AttachmentEdit } from './AttachmentEdit';
import { ChecklistEdit } from './ChecklistEdit';
import { DatesEdit } from './DatesEdit';
import { LabelEdit } from './LabelEdit';
import { MemberEdit } from './MemberEdit'

export function DynamicTaskEdit(props) {
    console.log('props:', props)
    switch (props.editName) {
        case 'Member':
            return <MemberEdit {...props} />
        case 'Label':
            return <LabelEdit {...props} />
        case 'Checklist':
            return <ChecklistEdit {...props} />
        case 'Dates':
            return <DatesEdit {...props} />
        case 'Attachment':
            return <AttachmentEdit {...props} />
        default:
            return null;
    }
}