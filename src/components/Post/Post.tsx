import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './Post.module.scss'
import { PostData } from '../../types/types'
import { fetchSetLike, fetchRemoveLike } from '../../store/articleSlice'

const Post: React.FC<PostData> = ({ author, title, createdAt, tagList, slug, description, favoritesCount, favorited, element }) => {
  const newLink = `/articles/${slug}`

  const dispatch = useDispatch()

  let defaultStylesLike = favorited ? `${styles.love} ${styles.loved}` : `${styles.love}`

  const [appreciated, setAppreciated] = useState(favorited)
  const [count, setCount] = useState(Number(favoritesCount))
  const [stylesLike, setStylesLike] = useState(defaultStylesLike)

  const Like = async () => {
    if (element.slug) {
      if (appreciated) {
        await dispatch(fetchRemoveLike(element.slug) as any)
        setStylesLike(`${styles.love}`)
        setCount((c) => c - 1)
        setAppreciated(!appreciated)
      } else {
        await dispatch(fetchSetLike(element.slug) as any)
        setStylesLike(`${styles.love} ${styles.loved}`)
        setCount((c) => c + 1)
        setAppreciated(!appreciated)
      }
    }
  }

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

        {tagList.map((el, i) => {
          return (
            <button className={styles.tag} key={i}>
              {el}
            </button>
          )
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
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export default Post
