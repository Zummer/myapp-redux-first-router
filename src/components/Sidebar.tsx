import React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {NavLink} from 'redux-first-router-link';
import {IAppState, IAppUser} from 'src/Models';
import {goToPage} from '../actions';
import {logout} from '../actions/login';
//@ts-ignore
import styles from '../css/Sidebar.css';

interface IStateProps {
  path: any;
  auth: any;
}

interface IDispatchProps {
  onClick: (type: string, category: string) => void;
  logout: () => AnyAction;
}

type TProps = IStateProps & IDispatchProps;

class Sidebar extends React.Component<TProps> {
  render() {
    const {onClick, path, auth, logout} = this.props;
    const {isAuthenticated, user} = auth;

    const guestLinks = (
      <div>
        <NavLink activeClassName={styles.active} to="/register">
          Регистрация
        </NavLink>
        <NavLink activeClassName={styles.active} to="/login">
          Вход
        </NavLink>
      </div>
    );

    const roleLinks = [
      {
        role: 'user',
        links: (
          <NavLink activeClassName={styles.active} to="/new-event">
            Новое событие
          </NavLink>
        ),
      },
      {
        role: 'admin',
        links: (
          <NavLink activeClassName={styles.active} to="/admin">
            Администратор
          </NavLink>
        ),
      },
    ];

    const userLinks = (user: IAppUser) => (
      <div>
        {roleLinks
          .filter((item) => user.roles.includes(item.role))
          .map((item) => item.links)}
        <span onClick={logout}>Выход</span>
      </div>
    );

    return (
      <div className={styles.sidebar}>
        <h2>SEO-FRIENDLY LINKS</h2>
        <NavLink activeClassName={styles.active} exact to="/">
          Домой
        </NavLink>
        <span
          className={active(path, '/list/db-graphql')}
          onClick={() => onClick('LIST', 'db-graphql')}
        >
          DB & GRAPHQL
        </span>
        <NavLink activeClassName={styles.active} to={['list', 'react-redux']}>
          REACT & REDUX
        </NavLink>
        <NavLink
          activeClassName={styles.active}
          to={{type: 'LIST', payload: {category: 'fp'}}}
        >
          FP
        </NavLink>
        {isAuthenticated ? userLinks(user) : guestLinks}
        <div style={{height: 20}} />
      </div>
    );
  }
}

const active = (currentPath, path) =>
  currentPath === path ? styles.active : '';

const mapDispatch: IDispatchProps = {onClick: goToPage, logout};
const mapState = ({location, auth}: IAppState): IStateProps => ({
  path: location.pathname,
  auth,
});

export default connect(mapState, mapDispatch)(Sidebar);
