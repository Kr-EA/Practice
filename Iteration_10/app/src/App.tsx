import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUserRepos, fetchPopularRepos, setUsername, clearRepos } from '../features/repos/reposSlice';
import { Card } from './components/Card/Card';
import { Repo } from './types';
import './App.css';
import RepoDescription from './components/RepoDescription/RepoDescription';

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { username: routeUsername } = useParams();
  
  const [usernameInput, setUsernameInput] = useState<string>('');
  
  const repos = useSelector((state: RootState) => state.repos.items);
  const status = useSelector((state: RootState) => state.repos.status);
  const error = useSelector((state: RootState) => state.repos.error);
  
  const deferredRepos = useDeferredValue(repos);

  useEffect(() => {
    if (routeUsername) {
      dispatch(setUsername(routeUsername));
      setUsernameInput(routeUsername);
    } else {
      dispatch(setUsername(null));
      setUsernameInput('');
    }
  }, [dispatch, routeUsername]);

  useEffect(() => {
      if (routeUsername) {
        dispatch(fetchUserRepos(routeUsername));
      } else {
        dispatch(fetchPopularRepos());
      }
  }, [dispatch, routeUsername]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    
    if (trimmed) {
      dispatch(setUsername(trimmed));
      navigate(`/${trimmed}`);
    } else {
      dispatch(clearRepos());
      navigate('/');
    }
  }, [usernameInput, dispatch, navigate]);

  if (status === 'loading' && repos.length === 0) {
    return <div className="loading">🔄 Загрузка...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="error">
        Ошибка: {error}
        <button onClick={() => dispatch(fetchPopularRepos())}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <>
      <form className="change-username" onSubmit={handleSubmit}>
        <input 
          value={usernameInput} 
          className="username username-input" 
          type="text" 
          placeholder="Введите имя пользователя"
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <input className="username username-submit" type="submit" value="Поиск" />
      </form>
      
      {repos !== deferredRepos && repos.length > 0 && (
        <div className="loading-indicator">Обновление...</div>
      )}
      
      <div className='repo-storage'>
        {deferredRepos.length > 0 ? (
          deferredRepos.map((repo: Repo) => (
            <Card key={repo.id} repo={repo} />
          ))
        ) : (
          status === 'succeeded' && (
            <p className="no-repos">Репозитории не найдены</p>
          )
        )}
      </div>
    </>
  );
}

function SearchChecker(){
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''

  if(id != ''){
    return <RepoDescription id={id}></RepoDescription>
  }
  return <Home></Home>
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<SearchChecker />} />
      <Route path='/:username' element={<Home />} />
    </Routes>
  );
}

export default App;