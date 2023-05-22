import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { StoreState, User } from '../../types/types';
import { fetchUser } from '../../store/profileSlice';

import styles from './Header.module.scss';

const Header = () => {
  const token: string = useSelector((state: StoreState) => state.profile.user.token);
  const user: User = useSelector((state: StoreState) => state.profile.user);
  
  const dispatch = useDispatch();

  const getToken = () => {
    dispatch(fetchUser() as any);
  };

  useEffect(() => {
    getToken();
  }, []);

  const goToOne = () => {
    sessionStorage.removeItem('page');
  };

  const avatar = user.image ? user.image : 'https://f1academy.com.my/wp-content/uploads/2020/09/Profile-2-02.png';

  if (token) {
    return (
      <header className={styles.header}>
        <div className="left">
          <Link style={{ textDecoration: 'none' }} onClick={goToOne} to="/">
            <button className={styles.headerButton}>Blog</button>
          </Link>
        </div>

        <div className={styles.right}>
          <button className={`${styles.headerButton} ${styles.signUp}`}>
            <Link to="/new-article">Create article</Link>
          </button>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div className={styles.profile}>
              <p className={styles.pName}>{user.username}</p>
              <img className={styles.img} src={avatar}></img>
            </div>
          </Link>
          <Link to="/sign-in">
            <button className={`${styles.headerButton} ${styles.logOut}`} onClick={clearLocalStorage}>
              Log Out
            </button>
          </Link>
        </div>
      </header>
    );
  }
  return (
    <header className={styles.header}>
      <div className="left">
        <Link style={{}} onClick={goToOne} to="/">
          <button className={styles.headerButton}>Blog</button>
        </Link>
      </div>

      <div className="right">
        <Link to="/sign-in">
          <button className={styles.headerButton}>Sign In</button>
        </Link>
        <Link to="/sign-up">
          <button className={`${styles.headerButton} ${styles.signUp}`}>Sign Up</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;

function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}
