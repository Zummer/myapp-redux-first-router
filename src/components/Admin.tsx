import React from 'react';
//@ts-ignore
import style from '../css/Switcher.css';
import {withRequireAuth} from './withRequireAuth';

const Admin = () => (
  <div className={style.admin}>U FIGURED OUT HOW TO DO AUTH!</div>
);

export default withRequireAuth(Admin);
