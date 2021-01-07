import React from 'react';
import {connect} from 'react-redux';
import isLoading from '../selectors/isLoading';
import UniversalComponent from './UniversalComponent';
//@ts-ignore
import styles from '../css/Switcher.css';
import FlashMessagesList from './FlashMessagesList';

const Switcher = ({page, isLoading}) => (
  <div className={`${styles.switcher}`}>
    <FlashMessagesList />
    <UniversalComponent page={page} isLoading={isLoading} />
  </div>
);

const mapState = ({page, ...state}) => ({
  page,
  isLoading: isLoading(state),
});

export default connect(mapState)(Switcher);
