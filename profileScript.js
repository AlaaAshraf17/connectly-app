    setupUI()
    getUser()
    getPosts()
    
    //get current user id
    function getCurrentUser(){
        const params=new URLSearchParams(window.location.search)
        const id=params.get("userid")
        return id
    }
    
    //show info of current user in header
    function getUser(){
        let id =getCurrentUser()
    axios.get(`${baseUrl}/users/${id}`)
    .then(function (response) {
        const user= response.data.data
        document.getElementById("profile-email").innerHTML=user.email
        document.getElementById("profile-username").innerHTML=user.username
        document.getElementById("profile-name").innerHTML=user.name
        document.getElementById("profile-posts").innerHTML=user.posts_count
        document.getElementById("profile-comments").innerHTML=user.comments_count
        document.getElementById("user-profile-image").src=user.profile_image
        document.getElementById("name-posts").innerHTML=user.username

    })
    }
    
    //show info about current user post
    function getPosts(){
        let id =getCurrentUser()
        axios.get(`${baseUrl}/users/${id}/posts`)
        .then(function (response) {
        const posts=response.data.data
        document.getElementById("user-posts").innerHTML=""
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i];
                //show or hide edit btn
                let user = showUser();
                let isMyPost=user!=null && post.author.id==user.id
                let editBtn=``

                if(isMyPost){
                editBtn=`
                <div class="d-flex gap-2">
                <button class="btn btn-danger btn-sm" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
                delete
                </button>
                <button class="btn btn-secondary btn-sm" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
                    edit
                </button>
                </div>`}

            let content = `
                <div class="card shadow my-4">
                <h5 class="card-header d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                <img src="${typeof post.author.profile_image === 'string' ? post.author.profile_image : ''}" 
                alt="" style="width: 40px; height: 40px; cursor: pointer;" 
                class="rounded-circle border border-2">
                <span style="cursor: pointer; margin-left: 10px;">${post.author.name}</span>
                </div>
                ${editBtn}
                </h5>
                <div class="card-body" onclick="singlePost(${post.id})" style="cursor: pointer;">
                <p style="margin: 0px;">${post.title}</p>
                <span>${post.body}</span>
                ${typeof post.image === 'string' ? `<img class="w-100" src="${post.image}" alt="">` : ''}
                <h6 style="color: rgb(163, 162, 162);" class="mt-1">${post.created_at}</h6>
                <hr>
                <i class="fa-solid fa-comments" style="margin: 5px; font-size: 17px"></i>
                <span style="font-size: 17px;">${post.comments_count}</span>
                </div>
                </div>
                `;
            document.getElementById("user-posts").innerHTML+=content
            } 
            })
            .catch(function (error) {
            console.log(error);
            })
    }
