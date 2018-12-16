const token = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
const baseUrl = 'https://api.github.com/graphql'

export const fetchRepos = async (username) => {
    const query = `{
        user(login: "${username}") {
          repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              name
              description
              url
              primaryLanguage {
                name
              }
            }
          }
        }
      }`
    
    const response = await fetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify({query}),
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    
    const result = await response.json()
    
    //if the response has errors
    //then throw with the first error only
    if(result.data.user === null 
        && result.hasOwnProperty('errors')
        && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
    }
    
    return result.data.user.repositories.nodes.map(repo => ({
        id: repo.id,
        name: repo.name,
        desc: repo.description,
        link: repo.url,
        lang: repo.primaryLanguage ? repo.primaryLanguage.name : ""
    }))
} 

export const fetchCommits = async (username, repo) => {
    const response = await fetch(`http://localhost:8080/${username}/${repo}`)
    return await response.json()
} 
