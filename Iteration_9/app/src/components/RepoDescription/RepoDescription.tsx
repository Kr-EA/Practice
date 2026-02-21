import { marked } from "marked";
import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import './repo-description-style.css';
import { useNavigate } from "react-router-dom";
import { Repo } from "../../types";

export default function RepoDescription({ id }: { id: string }) {

    const navigator = useNavigate()

    const [html, setHtml] = useState<string>("");
    const [repo, setRepo] = useState<Repo>();

    const decodeBase64 = (str: string): string => {
        return decodeURIComponent(
            atob(str)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
    };

    async function getREADME(repoId: string) {
        const repoRes = await fetch(`https://api.github.com/repositories/${repoId}`);
        if (!repoRes.ok) throw new Error("Repository not found");
        const repo = await repoRes.json();

        const readmeRes = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`
        );
        if (!readmeRes.ok) throw new Error("README not found");

        const readmeData = await readmeRes.json();
        return {repo: repo, readme: decodeBase64(readmeData.content)};
    }

    useEffect(() => {
        let isMounted = true;

        const loadReadme = async () => {
            try {
                
                const content = await getREADME(id);
                setRepo(content.repo)
                const rawHtml = await marked.parse(content.readme);
                const cleanHtml = DOMPurify.sanitize(rawHtml as string);
                
                if (isMounted) {
                    setHtml(cleanHtml);
                }
            } catch (err) {
                console.log(err);
            }
        };

        loadReadme();

        return () => {
            isMounted = false;
        };
    }, [id]);

    return (
        <div className="card">
            <button className="back" onClick={() => (navigator(-1))}>НАЗАД</button>
            <h2 id="repo-name">{repo?.name}</h2>
            <p id="repo-desc">{repo?.description}</p>
            <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="readme"
            />
            <span>Дата создания:</span><span id="repo-date">{repo?.created_at}</span>
            <br />
            <a id="repo-author" href={`${repo?.owner.html_url}`}>Автор</a>
            <br />
            <a id="repo-link" href={`${repo?.html_url}`}>Ссылка на репозиторий</a>
        </div>
    );
}