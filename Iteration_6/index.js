import colors from './colors.js';
import setREADMEInfo from './card.js';

var repos;

var container = document.querySelector('.repo-storage')

const path = window.location.pathname;
const id = path.substring(1);
if(id){

    var specialRepo;

    const body = document.querySelector('body')
    body.innerHTML = ''
    const response = await fetch (
        `https://api.github.com/repositories/${id}`
    )
    if(!response.ok){
        throw new Error("Error while loading")
    }
    specialRepo = await response.json() || {}

    body.innerHTML = 
    `
        <div class='card'>
            <a href='${sessionStorage.getItem('user') ? `/?username=${sessionStorage.getItem('user')}` : '/'}'>Назад</a>
            <h2 id="repo-name">Имя репозитория</h2>
            <p id="repo-desc">Описание репозитория</p>
            <div class="readme"></div>
            <span>Дата создания:</span> <span style="margin-right: 30px" id="repo-date">Дата создания</span>
            <a style="margin-right: 30px" id="repo-author" href="#">Автор</a>
            <a style="margin-right: 30px" id="repo-link" href="#">Ссылка на репозиторий</a>
        </div>
    `

    setREADMEInfo(id)
}

else{
    document.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location)
        var username = url.searchParams.get('username')
        sessionStorage.setItem('user', username)
        getRepositoriesForUser()
    })

    var form = document.querySelector('.change-username')
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        var username_value = document.querySelector('.username-input').value
        const url = new URL(window.location)
        url.searchParams.set('username', username_value)
        if(username_value){
            window.location.href = url.toString()
        }
        else{
            window.location.href = '/'
        }
    })

    async function getRepositoriesForUser(){
        let username = sessionStorage.getItem('user')
        if (!(!username || username === "null")){
            const response = await fetch (
                `https://api.github.com/users/${sessionStorage.getItem('user')}/repos`
            )
            if(!response.ok){
                throw new Error("Error while loading")
            }
            repos = await response.json() || []
        }
        else{
            console.log(username);
            var response = await fetch (
                `https://api.github.com/search/repositories?q=stars:>5000&sort=stars&order=desc&per_page=40`
            )
            if(!response.ok){
                throw new Error("Error while loading")
            }
            var data = await response.json() 
            repos = data.items || []
        }

        container.innerHTML = ''

        var repoCount = 0;
        repos.forEach((repo) => {
            var repoDOMEl = document.createElement('a');
            repoDOMEl.setAttribute('href', repo.id);
            repoDOMEl.setAttribute('class', 'redirection-wrapper');
            repoDOMEl.innerHTML = `
                <div class="repo-block">
                    <div class="repo-header">
                        <svg aria-hidden="true" focusable="false" class="octicon octicon-repo" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align:text-bottom"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>
                        <a href="${repo.html_url}" class="repo-name">${repo.name}</a>
                        <span class="repo-privacy">${repo.private ? 'Private' : 'Public'}</span>
                    </div>
                    <div class="repo-body">
                    ${
                        repo.description ? `<p>${repo.description.length > 170 ? `${repo.description.slice(0, 170)} ... <a href='/${repo.id}'>read more</a>` : repo.description}</p>` : ``
                    }
                    </div>
                    <div class="repo-footer">
                        <div class="footer-block repo-lang-block"> 
                            ${
                                repo.language ?
                            `<span class="repo-lang-color" style='background-color: ${colors[repo.language] ? colors[repo.language] : colors['Unknown']}'></span>
                            <span class="repo-lang">
                                ${repo.language}
                            </span>`
                            : ``
                            }
                        </div>
                        <div class="footer-block repo-stars-block">
                            <span class="repo-stars">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star mr-1">
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
                            </svg>
                            ${repo.stargazers_count}
                        </span>
                        </div>
                        <div class="footer-block repo-forks-block">
                            <span class="repo-forks">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
                                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                            </svg>
                            ${repo.forks}
                        </span>
                        </div>
                    </div>
                </div>
            `
            container.appendChild(repoDOMEl);
            repoCount += 1
        })
        if(repoCount == 0){
            var alertEl = document.createElement('div')
            alertEl.setAttribute('class', 'alert-info')
            alertEl.innerHTML = `<h2>У пользователя ${sessionStorage.getItem('user')} нет репозиториев</h2>`
            container.appendChild(alertEl)
        }
    }
}