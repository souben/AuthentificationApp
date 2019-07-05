import React from 'react';

const ReposList = ({ reposList }) => {
    console.log(reposList);
    const renderedList = reposList.map((repo) => {
        return  <div key={repo.id}> 
                        <a href={repo.html_url}>{repo.html_url}</a>
                        <p>owner: {repo.owner.login}<br /> description: {repo.description}<br /> score: {repo.score}</p><br />
                           
                </div>;    
    });
    return ( <div className="ui relaxed divided list">
                {renderedList}
             </div>
            )
}
export default ReposList;