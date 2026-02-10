import { marked } from 'marked';

async function getReadmeByRepoId(id: string): Promise<string> {

    var repoName: Element = document.querySelector('#repo-name')
    var repoDesc: Element = document.querySelector('#repo-desc')
    var repoDate: Element = document.querySelector('#repo-date')
    var repoAuthor: Element = document.querySelector('#repo-author')
    var repoLink: Element = document.querySelector('#repo-link')

    const repoRes: Response = await fetch(`https://api.github.com/repositories/${id}`);
    if (!repoRes.ok) throw new Error('Repository not found');
    const repo = await repoRes.json();

    repoName.textContent = repo.name;
    repoDesc.textContent = repo.description;
    repoDate.textContent = repo.created_at;
    repoAuthor.setAttribute('href', repo.owner.html_url);
    repoLink.setAttribute('href', repo.html_url);

    const readmeRes = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`
    );
    if (!readmeRes.ok) throw new Error('README not found');

    const readmeData = await readmeRes.json();
    
    const readmeContent = new TextDecoder().decode(Uint8Array.from(atob(readmeData.content), c => c.charCodeAt(0)));
    return readmeContent;
}

function setREADMEInfo(id: string) {
    var readme: HTMLElement = document.querySelector('.readme') 

    getReadmeByRepoId(id)
    .then(content => {
        var response: string | Promise<string> = marked.parse(content)
        if (response instanceof Promise) {
            response.then(html => {readme.innerHTML = html}).catch(err => console.error(err));
        } else {
            readme.innerHTML = response
        }
    })
}

export default setREADMEInfo