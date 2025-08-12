    let currentPage=1;
    let lastPage=1;

// handel infinte scrolling
  window.addEventListener("scroll", function(){
    //return true or false as you reach the end of the page the value is true else it is false
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    if(endOfPage && currentPage<lastPage){
      currentPage=currentPage+1
      getPosts(false,currentPage)

    }
  });
  
  
  //login and out for user
  setupUI()


  //to get the profile of the clicked user by id using query parms
  function userClicked(userId){
    window.location=`profile.html?userid=${userId}`
  }


  //get posts from API
  getPosts()
  function getPosts(reload=true,page=1){
    loaderToggle(true)
    axios.get(`${baseUrl}/posts?limit=2&page=${page}`)
    .then(function (response) {
      // handle success
    loaderToggle(false)
      let posts = response.data.data
      lastPage=response.data.meta.last_page
      if(reload){
      document.getElementById("myCard").innerHTML=""
      }
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
    </div>`

            }

          let content = `
  <div class="card shadow my-4">
    <h5 class="card-header d-flex justify-content-between align-items-center" >
      <div class="d-flex align-items-center" onclick="userClicked(${post.author.id})">
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

      document.getElementById("myCard").innerHTML+=content
      }
      
    })
    .catch(function (error) {
      console.log(error);
    })
  }


    function singlePost(postId){
      window.location=`posts.html?postId=${postId}`
    }





  