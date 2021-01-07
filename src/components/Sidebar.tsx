import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'redux-first-router-link';
import {goToPage} from '../actions';
//@ts-ignore
import styles from '../css/Sidebar.css';

const Sidebar = ({onClick, path}) => (
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
    <NavLink activeClassName={styles.active} to="/register">
      Регистрация
    </NavLink>
    <NavLink activeClassName={styles.active} to="/login">
      Вход
    </NavLink>
    <div style={{height: 20}} />
  </div>
);

const active = (currentPath, path) =>
  currentPath === path ? styles.active : '';

const mapDispatch = {onClick: goToPage};
const mapState = ({location}) => ({path: location.pathname});

export default connect(mapState, mapDispatch)(Sidebar);
