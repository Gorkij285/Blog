import React, { useEffect } from 'react';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { fetchList } from './store/listSlice';
import { StoreState } from './types/types';
import Header from './components/Header/Header';
import List from './components/List/List';
import FullPost from './components/FullPost/FullPost';
import Navigation from './components/Navigation/Navigation';
import Registration from './components/Registration/Registration';
import LoginPage from './components/LoginPage/LoginPage';
import Profile from './components/Profile/Profile';
import CreatingArticle from './components/CreatingArticle/CreatingArticle';
import EditArticle from './components/EditArticle/EditArticle';

function App() {
  const dispatch = useDispatch();

  const page: number = useSelector((state: StoreState) => state.list.page);
  const updateCounter: number = useSelector((state: StoreState) => state.profile.updateCounter);

  useEffect(() => {
    const pages = page <= 1 ? 0 : (page - 1) * 5;
    dispatch(fetchList(pages) as any);
  }, [page, updateCounter]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <List />
              <footer>
                <Navigation />
              </footer>
            </>
          }
        />
        <Route path="/articles/:id" element={<FullPost />} />
        <Route path="/articles/:id/edit" element={<EditArticle />} />
        <Route path="/sign-up" element={<Registration />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-article" element={<CreatingArticle />} />
        <Route path="/ed" element={<CreatingArticle />} />
      </Routes>
    </div>
  );
}

export default App;
