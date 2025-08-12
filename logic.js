  const baseUrl='https://tarmeezacademy.com/api/v1'
  function createPost(){
    let postid =  document.getElementById("post-id-input").value
    let isCreate = postid==null || postid==""
    let postTitle=document.getElementById("post-title").value
    let postBody= document.getElementById("post-body").value
    let postImage= document.getElementById("post-image").files[0] //array conatins the files you will choose if only want one file then choose the 1st element
      let formData = new FormData()
      formData.append("title",postTitle)
      formData.append("body",postBody)
      formData.append("image",postImage)
      loaderToggle(true)
      const token =localStorage.getItem("token")
      const headers ={
        "authorization":`Bearer ${token}`,
        "Content-Type":`multipart/form-data`
      }
      let url =''
      if(isCreate){
        url=`${baseUrl}/posts`
      }
      else{
        formData.append("_method","put")
        url =`${baseUrl}/posts/${postid}`
      }
      axios.post(url,formData,{
        headers:headers
      }).
      then((response)=>{
        console.log(response)
        const modal= document.getElementById("create-post-modal")
        const modalInstance=bootstrap.Modal.getInstance(modal)
        showAlert("your post craeted successfully", "success")
        modalInstance.hide()
        getPosts()

      }).catch((error)=>{
        const message =error.response.data.message
        showAlert(message,"danger")
      }).finally(()=>{
      loaderToggle(false)
    })
  
    
    }

    //create post header handling
    function createPostModal(){
      document.getElementById("post-edit-create-btn").innerHTML="Create"
      document.getElementById("post-id-input").value=null
      document.getElementById("post-modal-title").innerHTML="Create New Post"
      document.getElementById("post-title").value=""
      document.getElementById("post-body").value=""
      let postModal=new bootstrap.Modal(document.getElementById("create-post-modal"),{})
      postModal.toggle()

    }

    //edit post function
    function editPost(postObject){
      let post = JSON.parse(decodeURIComponent(postObject))
      document.getElementById("post-edit-create-btn").innerHTML="Update"
      document.getElementById("post-id-input").value=post.id
      document.getElementById("post-modal-title").innerHTML="Edit post"
      document.getElementById("post-title").value=post.title
      document.getElementById("post-body").value=post.body
      let postModal=new bootstrap.Modal(document.getElementById("create-post-modal"),{})
      postModal.toggle()
    }
    


       //delete function
      function deletePost(postObject){
      let post = JSON.parse(decodeURIComponent(postObject))
      document.getElementById("delete-post-input").value=post.id
  
      let postModal=new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
      postModal.toggle()
    }



     //confirm deletion function
    function confirmDelete() {
      const postId = document.getElementById("delete-post-input").value;
      if (!postId) {
        showAlert("No post selected for deletion.", "danger");
        return;
      }
  const token = localStorage.getItem("token");
  if (!token) {
    showAlert("You must be logged in to delete posts.", "danger");
    return;
  }
  const headers = {
    "authorization": `Bearer ${token}`,
    "Content-Type": `multipart/form-data`
  };
  axios.delete(`${baseUrl}/posts/${postId}`, { headers })
    .then((response) => {
      showAlert("Post deleted successfully", "success");
      // Close the modal
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      // Reload posts
      getPosts();
    })
    .catch((error) => {
      console.error(error);
      const message = error.response?.data?.message || "Failed to delete post.";
      showAlert(message, "danger");
    });
}
  
  //handling a tag user profile from navbar
  function userProfile(){
    const user =showUser()
    const userId = user.id
    window.location=`profile.html?userid=${userId}`
  }




    // How to show btns and ui after login and logout
    function setupUI() {
  const token = localStorage.getItem("token");

  const logindiv = document.getElementById("loggin-div");
  const logoutdiv = document.getElementById("logout-div");
  const addPostsDiv = document.getElementById("add-btn");

  if (token == null) {
    if(addPostsDiv!=null){
    addPostsDiv.style.setProperty("display", "none", "important");
    }
    logindiv.style.setProperty("display", "flex", "important");
    logoutdiv.style.setProperty("display", "none", "important");
  } else {
    if(addPostsDiv!=null){
    addPostsDiv.style.setProperty("display", "block", "important");
    }
    logindiv.style.setProperty("display", "none", "important");
    logoutdiv.style.setProperty("display", "flex", "important");

    let user = showUser();

    // Set username
    document.getElementById("nav-username").innerHTML = user.username;

    // Set profile image safely
    const imageElement = document.getElementById("nav-userimage");
    let imageUrl = "";

    if (typeof user.profile_image === "string") {
      imageUrl = user.profile_image;
    } else if (typeof user.profile_image === "object" && user.profile_image !== null) {
      imageUrl = user.profile_image.url || "";
    }
  }
}


    //Login post API
    function loginClickBtn(){
      loaderToggle(true)
      let username=document.getElementById("username").value
      let passWord= document.getElementById("current-password").value

      const params={
        "username":username,
        "password":passWord
      }
      axios.post(`${baseUrl}/login`,params).
      then((response)=>{
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))

        const modal= document.getElementById("loginModal")
        const modalInstance=bootstrap.Modal.getInstance(modal)
        showAlert("you logged in successfully", "success")
        modalInstance.hide()
        setupUI()
      }).catch((error)=>{
      const message=error.response.data.message
      showAlert(message,"danger")
    }).finally(()=>{
      loaderToggle(false)
    })
    

    }
    
    //Register post API
    function registerClickBtn(){
    let regsiterName =document.getElementById("name").value
    let regsiterUserName =document.getElementById("register-username").value
    let regsiterPassword =document.getElementById("register-current-password").value
    let regsiterImage=document.getElementById("register-image").files[0]

    let formData = new FormData()
    formData.append("username",regsiterUserName)
    formData.append("password",regsiterPassword)
    formData.append("image",regsiterImage)
    formData.append("name",regsiterName)
    const token =localStorage.getItem("token")
    loaderToggle(true)
    const headers ={
        "authorization":`Bearer ${token}`,
        "Content-Type":`multipart/form-data`
      }
    axios.post(`${baseUrl}/register`,formData,{
      headers:headers
    })
    .then((response)=>{
    
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))

        const modal= document.getElementById("RegisterModal")
        const modalInstance=bootstrap.Modal.getInstance(modal)
        showAlert("you registered successfully", "success")
        modalInstance.hide()
        setupUI()
    }).catch((error)=>{
      const message=error.response.data.message
      showAlert(message,"danger")
    }).finally(()=>{
      loaderToggle(false)
    })

    }

    //Logout function
    function logOut(){
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      showAlert("you logged out", "success")
      setupUI()
    }

    //alert after login succsefuly
    function showAlert(customeMessage, type) {
      const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${customeMessage}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
      alertPlaceholder.append(wrapper)
    }
  
      //for login user profile
      function showUser(){
        let storageUser = localStorage.getItem("user");
        let user = null;

        if (storageUser && storageUser !== "undefined") {
          try {
            user = JSON.parse(storageUser);
          } catch (e) {
            console.error("Invalid JSON in localStorage for user:", e);
          }
        }

        return user;
      }

      //loader function
      function loaderToggle(show=true){
      if(show){
        document.getElementById("data-loader").style.visibility="visible"
      }
      else{
        document.getElementById("data-loader").style.visibility="hidden"
      }
      }

