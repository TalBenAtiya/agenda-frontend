import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { loadTask, openModal, updateTask } from "../store/board/board.action"
import { ReactComponent as Like } from '../assets/icons/like.svg'
import { ReactComponent as Reply } from '../assets/icons/reply.svg'
import { ReactComponent as Clock } from '../assets/icons/clock.svg'
import { ReactComponent as Menu } from '../assets/icons/board-menu.svg'
import { GrClose } from 'react-icons/gr'
import { FaArrowRight, FaPlusCircle } from "react-icons/fa"
import moment from "moment"
import { utilService } from "../services/util.service"
import { useRef } from "react"
import confetti from "https://cdn.skypack.dev/canvas-confetti@1";
import { TaskTimeline } from "./task-timeline"
import { PopUpModal } from "./pop-up-modal"

export const TaskDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const task = useSelector(state => state.boardModule.task)
    const board = useSelector(state => state.boardModule.board)
    const [whichRenders, setWhichRenders] = useState('isUpdates')
    const params = useParams()
    const [searchParams] = useSearchParams()
    const groupId = searchParams.get('groupId')
    const taskId = searchParams.get('taskId')
    const boardId = params.boardId
    const [modalName,setModalName] = useState(null)

    useEffect(() => {
        dispatch(loadTask(taskId))
    }, [])

    const closeTaskDetail = () => {
        navigate(`/workspace/board/${boardId}`)
    }


    const onSetTaskPersonMenuOpen = () => {
        setTimeout(() => {
            setModalName('TASK_DETAIL_PERSON_MENU')
          }, 100);
    }

    if (!task) return
    return <section className='task-detail'>
        <button className="btn btn-svg btn-svg-x" onClick={() => closeTaskDetail()}><GrClose /></button>
        <div className='task-detail-header'>
            <div className='task-detail-header-top'>
                <h3>{task.title}</h3>
                <div className='task-detail-member-container'>
                    <button className="btn btn-add-developer" onClick={() => onSetTaskPersonMenuOpen()}>
                        <FaPlusCircle />
                    </button>
                    {modalName && <PopUpModal setModalName={setModalName} modalName={modalName} task={task} groupId={groupId} board={board} />}
                    {task.memberIds && task.memberIds.map(memberId => GetMemberImgFromId(board, memberId))}
                </div>
            </div>
            <div className='task-detail-header-bottom'>
                <button onClick={() => setWhichRenders('isUpdates')}><span>Updates</span></button>
                <button onClick={() => setWhichRenders('isFiles')}><span>Files</span></button>
                <button onClick={() => setWhichRenders('isActivity')}><span>Activity Log</span></button>
            </div>
        </div>
        {(whichRenders === 'isUpdates' && task) && <TaskDetailUpdates task={task} groupId={groupId} board={board} />}
        {whichRenders === 'isFiles' && <TaskDetailFiles />}
        {whichRenders === 'isActivity' && <TaskDetailActivity task={task} group={{ id: groupId, style: "clr13" }} board={board} />}
    </section>
}


const TaskDetailUpdates = ({ task, groupId, board }) => {
    const [isChatOpen, setIsChatOpen] = useState(false)
    return <section className='task-detail-updates'>
        {!isChatOpen && <button className='chat-box-closed' onClick={() => setIsChatOpen(true)}><span>Write an update...</span></button>}
        {isChatOpen && <ChatBox setIsChatOpen={setIsChatOpen} task={task} groupId={groupId} board={board} />}
        {task.comments && task.comments.map(comment =>
            <Post key={comment.id} comment={comment} board={board} task={task} groupId={groupId} byMember={comment.byMember} txt={comment.txt} createdAt={comment.createdAt} />
        )}
    </section>
}

const TaskDetailFiles = () => {
    return <section className='task-detail-files'>
    </section>
}

const TaskDetailActivity = ({ task, group, board }) => {

    const makeClass = (status) => {
        if (!status) return
        return status.split(' ').join('')
    }

    return <section className='task-detail-activity'>

        {task.activities?.map(activity => {
            let title
            let info
            switch (activity.type) {
                case 'add member':
                    title = 'Added'
                    info = <span className="activity-status">
                        <img className="profile-img-icon" src={require(`../assets/img/${activity.data.imgUrl}.png`)} />
                        {activity.data.fullname}
                    </span>

                    break;
                case 'remove member':
                    title = 'Removed'
                    info = <span className="activity-status">
                        <img className="profile-img-icon" src={require(`../assets/img/${activity.data.imgUrl}.png`)} />
                        {activity.data.fullname}
                    </span>

                    break;
                case 'status':
                    title = 'Changed Status'
                    info = <span className={"activity-status clr " + makeClass(activity.data)}>
                        {activity.data}
                    </span>


                    break;
                case 'priority':
                    title = 'Changed Priority'
                    info = <span className={"activity-status clr " + makeClass(activity.data)}>
                        {activity.data}
                    </span>

                    break;
                case 'title':
                    title = 'Changed Title'
                    info = <span className="activity-status">
                        {activity.data}
                    </span>

                    break;
                case 'timeline':
                    console.log(activity);
                    title = 'Changed Timeline'
                    info = <span className="task-preview-timeline">
                        <TaskTimeline task={{...task, timeline:activity.data}} group={group} board={board} isReadOnly={true} />
                    </span>

                    break;

                default:
                    break;
            }

            return <div key={activity.id} className="activity-container">
                <span className="activity-time"><Clock /> {getFormattedDateTime(activity.createdAt)}</span>
                <span className="activity-by">
                    <img className='profile-img-icon' src={require(`../assets/img/${activity.byMember.imgUrl}.png`)} />
                    {activity.byMember.fullname}
                </span>
                <span className="activity-type">{title}</span>
                <FaArrowRight className="svg arrow-right-activity" />
                {info}
            </div>
        })}
    </section>
}

const getFormattedDateTime = (date) => {
    if (!date) return
    moment.updateLocale('en', {
        relativeTime: {
            s: 'now',
            ss: '%ds',
            mm: "%dm",
            hh: "%dh",
            dd: "%dd",
            ww: "%dw",
            MM: "%dm",
            yy: "%dy"
        }
    });
    return moment(date).fromNow(true)
}


const Post = ({ comment, board, task, groupId, byMember, txt, createdAt }) => {
    const commentIdx = task.comments.findIndex(currComment => currComment.id === comment.id)
    const loggedinUser = useSelector(state => state.userModule.loggedinUser)
    const likeRef = useRef()
    const dispatch = useDispatch()


    const getIsCommentLiked = () => {
        const idxLiked = comment?.likes?.findIndex(currLike => currLike.id === loggedinUser._id)
        return (idxLiked !== -1 && idxLiked !== undefined)
    }

    const animateLike = (ev) => {
        const idxLiked = comment?.likes?.findIndex(currLike => currLike.id === loggedinUser._id)
        if (idxLiked !== -1 && idxLiked !== undefined) {
            comment.likes?.splice(idxLiked, 1)
            dispatch(updateTask({ task, groupId, boardId: board._id }))
            return
        }

        likeRef.current.classList.add('wobble-ver-left')
        confetti({
            particleCount: 150,
            spread: 60,
            origin: {
                x: ev.pageX / window.innerWidth,
                y: ev.pageY / window.innerHeight,
            }
        })

        setTimeout(() => {
            likeRef.current.classList.remove('wobble-ver-left')
        }, 1300)

        let like = { fullname: loggedinUser.fullname, imgUrl: loggedinUser.imgUrl, id: loggedinUser._id || '' }

        if (!comment.likes) comment.likes = [like]
        else comment.likes.unshift(like)

        task.comments.splice(commentIdx, 1, comment)
        dispatch(updateTask({ task, groupId, boardId: board._id }))
    }

    const replyToComment = (ev) => {

    }


    return <section className='post'>
        <div className="post-header">
            <div className='img-container'>
                <img className='profile-img-icon' src={require(`../assets/img/${byMember.imgUrl}.png`)} alt="" />
                <p className="fullname">{byMember.fullname}</p>
            </div>
            <div className="time-menu-container">
                <p><Clock />{getFormattedDateTime(createdAt)}</p>
                <button className="btn btn-svg btn-menu"><Menu /></button>
            </div>
        </div>
        <p className="comment-txt">{txt}</p>
        <div className="likes-container">
            <div className="img-container">
                {comment.likes && comment.likes.map((like, idx) => <img key={idx} className='profile-img-icon' src={require(`../assets/img/${like.imgUrl}.png`)} alt="" />)}
            </div>
            <p>{comment.likes?.length > 0 ? 'Likes' : ''}</p>
        </div>
        <div className="reply-like-container">
            <div className="like-container">
                <button onClick={(ev) => animateLike(ev)} className={`btn-svg btn-like ${getIsCommentLiked() ? 'liked' : ''}`}><Like ref={likeRef} />Like</button>
            </div>
            <div className="reply-container">
                <button onClick={(ev) => replyToComment(ev)} className="btn btn-svg btn-reply"><Reply />Reply</button>
            </div>
        </div>
    </section>
}
const GetMemberImgFromId = (board, memberId) => {
    const imgUrl = board.members.find(member => member._id === memberId).imgUrl
    return <img key={memberId} className='profile-img-icon' src={require(`../assets/img/${imgUrl}.png`)} alt="" />
}

const ChatBox = ({ setIsChatOpen, task, groupId, board }) => {

    const dispatch = useDispatch()
    const textAreaRef = useRef()
    const [newText, setNewText] = useState('')
    const loggedinUser = useSelector(state => state.userModule.loggedinUser)

    const PostComment = () => {
        let updatedTask
        const comment = { id: utilService.makeId(), txt: newText, createdAt: Date.now(), byMember: { _id: loggedinUser._id, fullname: loggedinUser.fullname, imgUrl: loggedinUser.imgUrl } }
        if (!task.comments) {
            updatedTask = { ...task, comments: [comment] }
            task.comments = [comment]
        }
        else {
            updatedTask = { ...task, comments: [comment, ...task.comments] }
            task.comments.unshift(comment)
        }
        setIsChatOpen(false)
        textAreaRef.current.value = ''
        dispatch(updateTask({ task: updatedTask, groupId, boardId: board._id }))
    }

    return <section className="chat-box-open">
        <textarea autoFocus className="chat-box" ref={textAreaRef} onBlur={(ev) => !ev.target.value ? setIsChatOpen(false) : ''} onChange={(ev) => setNewText(ev.target.value)}></textarea>
        <button className="update-comment-btn" onClick={() => PostComment()}>Update</button>
    </section>
}
