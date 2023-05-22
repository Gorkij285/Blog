import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import Markdown from 'react-markdown';

import { StoreState } from '../../types/types';
import { fetchDeletePost, fetchSetLike, fetchRemoveLike } from '../../store/articleSlice';
import { fetchSoloArticle } from '../../store/postSlice';
import { update } from '../../store/profileSlice';
import styles from '../Post/Post.module.scss';

import stylesTwo from './FullPost.module.scss';

const FullPost = () => {
  const postData = useSelector((state: StoreState) => state.soloArticle.currentArticle);
  const { author, title, createdAt, tagList, body, description, slug, favoritesCount, favorited } = postData;
  const [appreciated, setAppreciated] = useState(favorited);

  const userName: string = useSelector((state: StoreState) => state.profile.user.username);

  const id = useParams().id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(fetchSoloArticle(id) as any);
    }
  }, [id, appreciated]);

  const deleteArticle = () => {
    dispatch(fetchDeletePost(slug) as any);
    dispatch(update());
    navigate('/');
    message.success('Delete article!');
  };

  const Like = async () => {
    if (id) {
      if (appreciated) {
        await dispatch(fetchRemoveLike(id) as any);
        setAppreciated(!appreciated);
      } else {
        await dispatch(fetchSetLike(id) as any);
        setAppreciated(!appreciated);
      }
    }
  };

  if (Object.keys(postData).length !== 0) {
    let control = <></>;
    const linkEdit = `/articles/${id}/edit`;

    if (author.username === userName) {
      control = (
        <div className={stylesTwo.butWrapper}>
          <Popconfirm
            title="Are you sure to delete this article?"
            onConfirm={deleteArticle}
            okText="Yes"
            cancelText="No"
            placement={'right'}
            overlayClassName={stylesTwo.popconfirm}
          >
            <button className={stylesTwo.delete}>Delete</button>
          </Popconfirm>

          <Link to={linkEdit}>
            <button onClick={() => console.log('Edit')} className={stylesTwo.edit}>
              Edit
            </button>
          </Link>
        </div>
      );
    }
    const stylesLike = favorited ? `${stylesTwo.love} ${stylesTwo.loved}` : `${stylesTwo.love}`;
    return (
      <div className={stylesTwo.fullPost}>
        <div className={`${styles.post} ${stylesTwo.Post}`}>
          <div className={styles.left}>
            <div>
              <h2 className={stylesTwo.titleH2}>{title}</h2>
              <span onClick={Like} className={stylesLike}>
                {favoritesCount}
              </span>
            </div>
            {tagList.map((el, i) => {
              return (
                <button className={styles.tag} key={i}>
                  {el}
                </button>
              );
            })}
            <span className={stylesTwo.description}>
              <Markdown className={stylesTwo.description}>{body}</Markdown>
            </span>
          </div>
          <div className={styles.right}>
            <div>
              <p>{author.username}</p>
              <p className={styles.date}>{formatDate(createdAt)}</p>
            </div>
            {control}
            <img src={author.image}></img>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div className={stylesTwo.fullPost}>
        <BeatLoader size={30} />
      </div>
    );
};

export default FullPost;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}
