import React from 'react';
import {connect} from 'react-redux';
import isLoading from '../selectors/isLoading';
import UniversalComponent from './UniversalComponent';
//@ts-ignore
import styles from '../css/Switcher.css';

const Switcher = ({page, direction, isLoading}) => (
  <div className={`${styles.switcher}`}>
    <UniversalComponent page={page} isLoading={isLoading} />
  </div>
);

const mapState = ({page, direction, ...state}) => ({
  page,
  direction,
  isLoading: isLoading(state),
});

export default connect(mapState)(Switcher);
