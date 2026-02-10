async function getReadmeByRepoId(id) {

    var repoName = document.querySelector('#repo-name')
    var repoDesc = document.querySelector('#repo-desc')
    var repoDate = document.querySelector('#repo-date')
    var repoAuthor = document.querySelector('#repo-author')
    var repoLink = document.querySelector('#repo-link')

    const repoRes = await fetch(`https://api.github.com/repositories/${id}`);
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

function setREADMEInfo(id) {
    var readme = document.querySelector('.readme')

    getReadmeByRepoId(id)
    .then(content => {
        const html = marked.parse(content)
        readme.innerHTML = html;
    })
    .catch(err => console.error(err));
}

export default setREADMEInfo