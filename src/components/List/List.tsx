import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BeatLoader } from 'react-spinners';

import Post from '../Post/Post';
import { RootState, PostData } from '../../types/types';
import { clearError } from '../../store/profileSlice';

import styles from './List.module.scss';

const List = () => {
  const data = useSelector((state: RootState) => state.list.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError);
  }, []);

  if (data.length < 1)
    return (
      <div className={styles.list}>
        <BeatLoader size={20} />
      </div>
    );
  return (
    <div className={styles.list}>
      <ul>
        {data.map((el: PostData) => {
          return (
            <Post
              author={el.author}
              title={el.title}
              createdAt={el.createdAt}
              tagList={el.tagList}
              key={el.updatedAt}
              body={el.body}
              slug={el.slug}
              updatedAt={null}
              description={el.description}
              favoritesCount={el.favoritesCount}
              favorited={el.favorited}
              element={el}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default List;
