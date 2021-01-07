import React from 'react';
//@ts-ignore
import style from '../css/Switcher.css';

const Error = (error) => (
  <div className={style.notFound}>ERROR: {error.message}</div>
);

Error.displayName = 'Error';

export default Error;
