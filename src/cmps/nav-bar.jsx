import { Fragment, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom';
import { AppHome } from '../views/app-home'
import { Board } from '../views/board'
import { Inbox } from '../views/inbox';
import { ReactComponent as BoardSvg } from '../assets/icons/nav-bar/board.svg';
import { ReactComponent as NotificationSvg } from '../assets/icons/nav-bar/notification.svg';
import { ReactComponent as InboxSvg } from '../assets/icons/nav-bar/inbox.svg';
import { ReactComponent as MyWorkSvg } from '../assets/icons/nav-bar/my-work.svg';
import { ReactComponent as FavoritesSvg } from '../assets/icons/nav-bar/favorites.svg';
import { ReactComponent as InviteSvg } from '../assets/icons/nav-bar/invite.svg';
import { ReactComponent as SearchSvg } from '../assets/icons/nav-bar/search.svg';
import { ReactComponent as HelpSvg } from '../assets/icons/nav-bar/help.svg';
import { ReactComponent as MenuSvg } from '../assets/icons/nav-bar/menu.svg';
import { ReactComponent as AgendaLogoSvg } from '../assets/icons/agenda-logo-color.svg';
import { SideNavBar } from './side-nav-bar';


export const NavBar = () => {

  const params = useParams()
  const [isOpen, setStatus] = useState(false)

  useEffect(() => {
    if (isOpen) document.documentElement.style.setProperty('--board-grid-column', '317px 1fr')
    else document.documentElement.style.setProperty('--board-grid-column', '96px 1fr')
    return (() => document.documentElement.style.removeProperty('--board-grid-column'))
  }, [isOpen, params])



  return (
    <Fragment>
      {params['*'] !== 'home' &&
        <SideNavBar isOpen={isOpen} setStatus={setStatus} />}
      <section className="nav-bar">
        <button className="btn btn-home">
          <NavLink to="/workspace/home"><AgendaLogoSvg />
            <div className="selected-indication"></div>
          </NavLink>
        </button>
        <div className="divider-horizontal"></div>
        <button className="btn btn-board">
          <NavLink to="/workspace/board/b101"><BoardSvg />
            <div className="selected-indication"></div>
          </NavLink>
        </button>
        <button className="btn btn-svg btn-notification"><NotificationSvg /></button>
        <button className="btn btn-svg btn-index">
          <NavLink to="/workspace/inbox"><InboxSvg />
            <div className="selected-indication"></div>
          </NavLink>
        </button>
        <button className="btn btn-svg btn-my-work"><MyWorkSvg /></button>
        <button className="btn btn-svg btn-favorites"><FavoritesSvg /></button>
        <button className="btn btn-svg btn-invite"><InviteSvg /></button>
        <button className="btn btn-svg btn-search"><SearchSvg /></button>
        <button className="btn btn-svg btn-help"><HelpSvg /></button>
        <div className="divider-horizontal"></div>
        <button className="btn btn-svg btn-menu"><MenuSvg /></button>
        <button className="btn btn-svg btn-user">O</button>


      </section>
      <Routes>
        <Route path="/home" element={<AppHome />} />
        <Route path="/board/:boardId" element={<Board />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </Fragment>
  )
}