const defaultUser = 'viickpagani',
      authorizationKey = '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';

document.getElementById('search-input').value = defaultUser;

loadUserData(defaultUser);

// ------------------------------------------------------------------------------------------------------------------ //

var xhrUser, xhrRep,v
    searchButton = document.getElementById('search-button'),
    searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', searchUser);

// ------------------------------------------------------------------------------------------------------------------ //

function loadUserData(user)
{
    xhrUser = new XMLHttpRequest();
    xhrRep = new XMLHttpRequest();

    xhrUser.onload = showUserData;
    xhrUser.open('GET', `https://api.github.com/users/${user}`);
    xhrUser.setRequestHeader('Authorization', `token ${authorizationKey}`);
    xhrUser.send();

    xhrRep.onload = showUserRepos;
    xhrRep.open('GET', `https://api.github.com/users/${user}/repos`);
    xhrRep.setRequestHeader('Authorization', `token ${authorizationKey}`);
    xhrRep.send();
}

// ------------------------------------------------------------------------------------------------------------------ //

function showUserData() {

    if(xhrUser.status == 404) 
    {
        return bootbox.alert({
            // closeButton: false,
            message: `O usuário "${searchInput.value}" não foi encontrado!`,
            size: 'small',
            buttons: {
                ok: {
                    className: 'btn-dark',
                    label: 'teste',
                },
            },
        });
    }
    
    let text = '';
    let elem_change;
    let data = JSON.parse(this.responseText);
    let plural = 's';

    // -------- //

    elem_change = document.getElementById('profile_img');
    elem_change.src = data.avatar_url;
    elem_change.alt = data.login;

    // -------- //

    if(data.name == null) text = data.login;
    else text = data.name;

    elem_change = document.getElementById('profile_name');
    elem_change.innerHTML = text;

    // -------- //

    elem_change = document.getElementById('profile_user');
    elem_change.innerHTML = `<i class="fas fa-user"></i><a href="https://github.com/${data.login}" target="_blank">${data.login}</a>`;

    // -------- //

    elem_change = document.getElementById('profile_follow');
    plural = data.followers == 1 ? '' : 's';
    elem_change.innerHTML = `<i class="fas fa-users"></i><a href="https://github.com/${data.login}?tab=followers" target="_blank"><b>${data.followers}</b> follower${plural}</a> · <a href="https://github.com/${data.login}?tab=following" target="_blank"><b>${data.following}</b> following</a>`;

    // -------- //

    if(data.bio == null) text = '<i>No bio provided.</i>';
    else text = data.bio;

    elem_change = document.getElementById('profile_bio');
    elem_change.innerHTML = text;

    // -------- //

    elem_change = document.getElementById('profile_org');

    if(data.company == null) elem_change.style.visibility = "hidden";
    else
    {
        if(data.company[0] == '@') elem_change.innerHTML = `<i class="far fa-building"></i><a href="https://github.com/${data.company.substring(1)}" target="_blank"><b>${data.company}</b></a>`;
        else elem_change.innerHTML = `<i class="far fa-building"></i>${data.company}`;

        elem_change.style.visibility = "visible";
    }

    // -------- //

    elem_change = document.getElementById('profile_location');

    if(data.location == null) elem_change.style.visibility = "hidden";
    else 
    {
        elem_change.innerHTML = `<i class="fas fa-map-marker-alt"></i><a href="https://www.google.com/maps/place/${data.location}" target="_bl">${data.location}</a>`;

        elem_change.style.visibility = "visible";
    }

    document.getElementById('main').style.display = "block";
    document.getElementById('footer').style.display = "block";
}

// ------------------------------------------------------------------------------------------------------------------ //

function showUserRepos() {

    if(xhrRep.status == 404) return false;

    let text = '';
    let elem_change;
    let data = JSON.parse(this.responseText);
    let plural = 's';

    elem_change = document.getElementById('rep_rows');

    if(data.length == 0) elem_change.innerHTML = `<span class="col-12"><i>No public repositories found.</i></span>`;

    for(x = 0; x < data.length; x++)
    {
        let desc = '';
        let rep = data[x];
        let dateCreated = new Date(rep.created_at);
        let dateUpdated = new Date(rep.updated_at);

        // ---------------------- //

        if(rep.description == null) desc = "<i>No description provided.</i>";
        else desc = rep.description;

        text += `<span class="rep_card col-12 col-lg-6 d-flex justify-content-center">
            <div class="card bg-light mb-3">
                <div class="card-header rep_title">
                    <i class="rep_iconRep far fa-folder"></i><b>${rep.name}</b>`;

        if(rep.language != null) text += `<span class="rep_lang">${rep.language}</span>`;
        
        text += `</div>
                <div class="card-body">
                    <p class="card-text">${desc}</p>
                    <p class="card-text"><small class="text-muted">Created on: ${dateCreated.toLocaleString()}
                    </br>Updated on: ${dateUpdated.toLocaleString()}</small></p>
                    <span class="rep_link"><button class="btn"><a href="https://github.com/${rep.owner.login}/${rep.name}" target="_blank"><i class="fab fa-github"></i>View repository</a></button></span>`
        
        if(rep.has_pages == true) text += ` <span class="rep_link"><button class="btn"><a href="https://${rep.owner.login}.github.io/${rep.name}/" target="_blank"><i class="fas fa-tv"></i>View website</a></button></span>`;

        text += `</div></div></span>`;

        elem_change.innerHTML = text;
    }
}

// ------------------------------------------------------------------------------------------------------------------ //

function searchUser()
{
    let inputValue = searchInput.value;
    
    loadUserData(inputValue);
}