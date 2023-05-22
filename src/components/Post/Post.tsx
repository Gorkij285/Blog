import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchSetLike, fetchRemoveLike } from '../../store/articleSlice';
import { PostData, StoreState } from '../../types/types';

import styles from './Post.module.scss';

const Post: React.FC<PostData> = ({
  author,
  title,
  createdAt,
  tagList,
  slug,
  description,
  favoritesCount,
  favorited,
  element,
}) => {
  const newLink = `/articles/${slug}`;

  const dispatch = useDispatch();

  const defaultStylesLike = favorited ? `${styles.love} ${styles.loved}` : `${styles.love}`;

  const [appreciated, setAppreciated] = useState(favorited);
  const [count, setCount] = useState(Number(favoritesCount));
  const [stylesLike, setStylesLike] = useState(defaultStylesLike);
  const Logged: boolean = useSelector((state: StoreState) => state.profile.isLogged);

  const Like = async () => {
    if (element.slug && (Logged || localStorage.getItem('token'))) {
      if (appreciated) {
        await dispatch(fetchRemoveLike(element.slug) as any);
        setStylesLike(`${styles.love}`);
        setCount((c) => c - 1);
        setAppreciated(!appreciated);
      } else {
        await dispatch(fetchSetLike(element.slug) as any);
        setStylesLike(`${styles.love} ${styles.loved}`);
        setCount((c) => c + 1);
        setAppreciated(!appreciated);
      }
    }
  };

  const setTagList = tagList.filter((value: string, index: number, self: any) => {
    return self.indexOf(value) === index;
  });

  return (
    <div className={styles.post}>
      <div className={styles.left}>
        <div>
          <Link to={newLink} style={{ textDecoration: 'none' }}>
            <h2 className={styles.titleH2}>{title || 'no title'}</h2>
          </Link>
          <span onClick={Like} className={stylesLike}>
            {count}
          </span>
        </div>

        {setTagList.map((el, i) => {
          if (setTagList[0]) {
            if (el.trim().length > 0) {
              return (
                <button className={styles.tag} key={i}>
                  {el}
                </button>
              );
            }
          }
        })}
        <span>{description}</span>
      </div>
      <div className={styles.right}>
        <div>
          <p>{author.username}</p>
          <p className={styles.date}>{formatDate(createdAt)}</p>
        </div>
        <img src={author.image}></img>
      </div>
    </div>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export default Post;
