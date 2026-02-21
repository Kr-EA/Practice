import { useCallback, useDeferredValue, useEffect, useState } from 'react'
import './App.css'
import { Repo } from './types'
import { Card } from './components/Card/Card'
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import RepoDescription from './components/RepoDescription/RepoDescription'

function ElementCheck(){

  const [searchParams] = useSearchParams()

  const id = searchParams.get('id')
  if(!id){
    return <Home/>
  }
  return <RepoDescription id={id}/>

}

function Home() {

  const [repos, setRepos] = useState<Array<Repo>>([])
  const deferredRepos = useDeferredValue(repos);
  const [usernameInput, setUsernameInput] = useState<string>()
  const [username, setUsername] = useState<string>()
  const navigator = useNavigate()

  const getRepositories = useCallback(async() => {
    console.log(username);
    if (!(!username || username === "null")){
        navigator(`/${username}`)
        const response = await fetch (
            `https://api.github.com/users/${username}/repos`
        )
        if(!response.ok){
            throw new Error("Error while loading")
        }
        setRepos(await response.json() || [])
    }
    else{
        navigator('/')
        var response = await fetch (
            `https://api.github.com/search/repositories?q=stars:>5000&sort=stars&order=desc&per_page=40`
        )
        if(!response.ok){
            throw new Error("Error while loading")
        }
        var data = await response.json() 
        setRepos(data.items || [])
    }
  }, [username, navigator])

  useEffect(() => {
    getRepositories()
  }, [getRepositories])

  return (
    <>
      <form className="change-username" onSubmit={(e) => {e.preventDefault(); setUsername(usernameInput)}}>
        <input 
          value={usernameInput} 
          className="username username-input" 
          type="text" 
          placeholder="Введите имя пользователя"
          onChange={(e) => {setUsernameInput(e.target.value)}}/>
        <input className="username username-submit" type="submit"/>
      </form>
      {repos !== deferredRepos && <div>🔄</div>}
      <div className='repo-storage'>
        {deferredRepos.map((el: Repo) => (<Card key={el.id} repo={el} />))}
      </div>
    </>
  )
}

function App(){
  return(
    <Routes>
      <Route path='/' element={<ElementCheck/>}/>
      <Route path='/:username' element={<Home/>}/>
    </Routes>
  )
}

export default App
