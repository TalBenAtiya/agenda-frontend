import moment from "moment/moment"
import { Fragment, useState } from "react"
import { useDispatch } from "react-redux"
import { openModal } from "../store/board/board.action"
import { TaskPersonMenu } from "./task-person-menu"
import { TaskPriorityMenu } from "./task-priority-menu"
import { TaskStatusMenu } from "./task-status-menu"
import { ReactComponent as NoPersonSvg } from '../assets/icons/no-person-icon.svg'
import { FaPlusCircle } from "react-icons/fa"
import { PopUpModal } from "./pop-up-modal"
import { TaskTimeline } from "./task-timeline"


export const DynamicTaskCmp = ({ board, task, category, group }) => {
    // const [isMenuModalOpen,setMenuModalIsOpen] = useState(false)
    const [modalName,setModalName] = useState(null)
    const dispatch = useDispatch()
    // const { itemId, isTaskStatusMenuOpen, isTaskPriorityMenuOpen, isTaskPersonMenuOpen, isScreenOpen } = useSelector(state => state.boardModule.modals)
    const isCategoryInc = ['priority', 'status', 'lastUpdated', 'attachments'].includes(category)
    let className = `flex justify-center task-preview-`
    let headerTxt, cmp
    let cb = () => { }

    const getFormattedDateTime = (date) => {
        if (!date) return
        moment.updateLocale('en', { relativeTime: { s: 'few seconds' } })
        return moment(date).fromNow()
    }

    const onSetTaskStatusMenuOpen = () => {
        setTimeout(() => {
            setModalName('TASK_STATUS_MENU')
        }, 100);
    }

    const onSetTaskPriorityMenuOpen = () => {
        setTimeout(() => {
            setModalName('TASK_PRIORITY_MENU')
        }, 100);
    }

    const onSetTaskPersonMenuOpen = () => {
        setTimeout(() => {
            setModalName('TASK_PERSON_MENU')
        }, 100);
    }

    const GetMemberImgFromId = (board, memberId) => {
        const imgUrl = (memberId !== 'Guest') ?
            board.members.find(member => member._id === memberId).imgUrl : 'profile-img-guest'
        return <img key={memberId} className='profile-img-icon' src={require(`../assets/img/${imgUrl}.png`)} alt="" />
    }

    const makeClass = (status) => {
        if (!status) return
        return status.split(' ').join('')
    }

    switch (category) {

        case 'member':
            className += `developer same-width `
            break;

        case 'status':
            cmp = <span className='fold'></span>
            headerTxt = task[category]
            className += `status same-width `
            cb = onSetTaskStatusMenuOpen

            break;
        case 'priority':
            cmp = <span className='fold'></span>
            headerTxt = task[category]
            className += `priority same-width `
            if (task[category] === 'Critical') {
                headerTxt += " ⚠"
            }
            cb = onSetTaskPriorityMenuOpen

            break;
        case 'attachments':
            // cmp = <AddFile task={task} />
            className += 'attachments same-width '



            break;
        case 'timeline':
            className += 'timeline '


            break;
        case 'lastUpdated':
            className += `last-updated same-width `
            headerTxt = getFormattedDateTime(task[category]?.date)


            break;

        default:
            break;
    }

    if (isCategoryInc && category !== 'lastUpdated' && category !== 'attachments') className += makeClass(task[category])
    return <>
        {modalName &&
            <PopUpModal setModalName={setModalName} modalName={modalName} task={task} group={group} board={board} />
        }
        <li className={className} onClick={cb}>
            {category === 'member' &&
                <Fragment>
                    <button className="btn btn-add-developer" onClick={() => onSetTaskPersonMenuOpen()}>
                        <FaPlusCircle/>
                    </button>
                    <div className='developer-container'>
                        {task.memberIds ?
                            task.memberIds.map(memberId => GetMemberImgFromId(board, memberId))
                            :
                            <NoPersonSvg className="svg-no-person" />}
                    </div>
                </Fragment>}

            {category === 'lastUpdated' &&
                <div className='flex align-center last-updated'>
                    {task.lastUpdated && task.lastUpdated.byUserId &&
                        GetMemberImgFromId(board, task.lastUpdated.byUserId)}
                </div>}
            {category === 'timeline' &&
                    <TaskTimeline task={task} group={group} board={board} />}
            {isCategoryInc && <>
                <h4>{headerTxt}</h4>
                {cmp}
            </>}
        </li>
    </>
}