export const getRepositories = async (username: string) => {
    console.log(username);
    if (!(!username || username === "null")){
        const response = await fetch (
            `https://api.github.com/users/${username}/repos`
        )
        if(!response.ok){
            throw new Error("Error while loading")
        }
        return(await response.json() || [])
    }
    else{
        var response = await fetch (
            `https://api.github.com/search/repositories?q=stars:>5000&sort=stars&order=desc&per_page=40`
        )
        if(!response.ok){
            throw new Error("Error while loading")
        }
        var data = await response.json() 
        return(data.items || [])
    }
  }