export type Repo = {
    name: string,
    private: 'Private' | 'Public',
    description: string,
    id: string,
    language: string,
    stargazers_count: string,
    forks: string
    html_url: string,
    created_at: string,
    owner: {html_url: string}
}