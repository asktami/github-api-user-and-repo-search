$(function(){

  $('#submit-btn').on('click', function(e){
    e.preventDefault();
    $('#results').html('<div id="loader"><img src="css/loader.gif" alt="loading..."></div>');

    
    var username = $('#search-term').val();
    var query_user   = 'https://api.github.com/users/'+username;
    var query_repos  = 'https://api.github.com/users/'+username+'/repos?per_page=100';

	  if ( username === '' ) {
	  return $('#results').html("<h2>Please enter a username.</h2>");
	  } else {
	
		// get User
		requestJSON(query_user, function(json) {
	
		// console.log('status = ' + json.status  );
		// console.log('code = ' + json.code  );
		// console.log('message = ' + json.message  );
	
			 if(json.status == '404') { 
				   $('#results').html("<h2>No user found. Please try again.</h2>");
			   
			 } else {
			
				let data = json.responseJSON;
				
				// if there are previous results, remove them
				$('#results').empty();
				$('#results').html(formatUser(data));
		  
		 
			  // get User-Repos
				requestJSON(query_repos, function(json) {
	
				if(json.status == '404') {
					// if there are previous results, remove them
					$('#results').empty();
					$('#results').append("<p>No repos found for this user.</p>");
					
				} else {
			
				   let data = json.responseJSON;
				   $('#results').append(formatRepos(data));
				}
			});  
			}
		 
		}); // end requestJSON Ajax call	 
	  }
      
    
    // send Request
    function requestJSON(query, callback) {
    $.ajax({
      url: query,
      dataType: 'GET',
      dataType: 'json',
      success: function(data){
      	console.log('success data =' + data);
      },
      error: function(jqXHR, textStatus, errorThrown){
      	console.log('error jqXHR = ' + jqXHR);
      	console.log('error textStatus = ' + textStatus);
      	console.log('error errorThrown = ' + errorThrown);
      },
      complete: function(jqXHR, status) {	
      	console.log('complete jqXHR = ' + jqXHR);
      	console.log('complete status = ' + status);
      /* complete: A function to be called when the request finishes (after success and error callbacks are executed) */
        callback.call(null, jqXHR);
      	 }
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
        
        console.log(output_html);
        
		 return output_html;
		
    } // end formatUser()
    

 	// format User-Repos
 	// for an array of repositories
  	function formatRepos(json) {

  	if(json.length !== 0) { 
		 let output_html = `<br>Repositories: ${json.length}<ul>`;
		 
		 for (let i = 0; i < json.length; i++) {
		 	let repo = json[i];
		 	output_html += '<li><a href="' + repo.html_url + '" target="_blank">'+ repo.full_name + '</a></li>';
		 }
		 
		 output_html += '</ul>'; 
		 return output_html;
		 }
  	} // end formatRepos()

    
  }); // end click event handler

});	// end jQuery