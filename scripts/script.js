'use strict';

const userURL   = 'https://api.github.com/users/';

/*
cons apiKey = '';

const options = {
  headers: new Headers({
	"X-Api-Key": apiKey,
	"Authorization": basic,
	})
};
*/



function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

// getUser
function getUser(username, maxResults=1) {

  let queryURL = userURL + username;
  console.log('queryURL  =' + queryURL);
  
  fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
    // if there are previous results, remove them
				$('#results').empty();
				$('#results').html(formatUser(responseJson));
				getUserRepos(username, 100);
	})
    .catch(err => {
    	$('#results').empty();
    	$('#js-user-error-message').empty();
    	$('#js-user-error-message').html(`Something went wrong retrieving the user: ${err.message}`);
    });
}


// getUser-Repos
function getUserRepos(username, maxResults) {

const params = {
    per_page: maxResults
  };
  const queryString = formatQueryParams(params)
  let queryURL = userURL + username + '/repos?' + queryString;
  
  console.log('queryURL-repos  =' + queryURL);
  // 'https://api.github.com/users/'+username+'/repos?per_page=100';
  

  fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
				$('#results').append(formatRepos(responseJson));
	})
    .catch(err => {
    	$('#js-repos-error-message').empty();
    	$('#js-repos-error-message').html(`Something went wrong retrieving the repos: ${err.message}`);
    });
}

    
// format User
function formatUser(json) {

 let name   = json.name;
 let login_name   = json.login;
 let avatar_url     = json.avatar_url;
 let profile_url = json.html_url;
 let location   = json.location;
 let followers_num = json.followers;
 let following_num = json.following;
 let repos_num     = json.public_repos;
 
 if(name === undefined || name === null) { name = login_name; }
 
 let output_html = `<h2>${name} - <a href="${profile_url}" target="_blank">@${login_name}</a></h2>
 <p><a href="${profile_url}" target="_blank"><img src="${avatar_url}" width="80" height="80" alt="${login_name}"></a></p>
 <br>Followers: ${followers_num} - Following: ${following_num}`;

 return output_html;
 
} // end formatUser()

// format User-Repos
// for an array of repositories
function formatRepos(json) {

if(json === null){
	let output_html = `<br>Repositories: 0`;
	
  } else { 
  let output_html = `<br>Repositories: ${json.length}<ul>`;
  
  for (let i = 0; i < json.length; i++) {
	 let repo = json[i];
	 output_html += '<li><a href="' + repo.html_url + '" target="_blank">'+ repo.full_name + '</a></li>';
  }
  
  output_html += '</ul>'; 
  return output_html;
  }
} // end formatRepos()

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const username = $('#search-term').val();
    getUser(username);
  });
}

$(watchForm);