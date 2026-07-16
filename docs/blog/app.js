let users=JSON.parse(localStorage.getItem("blog_users")||"[]");
let posts=JSON.parse(localStorage.getItem("blog_posts")||"[]");
let currentUser=JSON.parse(sessionStorage.getItem("blog_current_user")||"null");

function hashPassword(p){let h=0;for(let i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}return h.toString();}
function saveUsers(){localStorage.setItem("blog_users",JSON.stringify(users));}
function savePosts(){localStorage.setItem("blog_posts",JSON.stringify(posts));}

function register(username,password){
  if(!username||!password)return{ok:false,msg:"Username and password required."};
  if(users.find(u=>u.username===username))return{ok:false,msg:"Username already taken."};
  let user={id:Date.now(),username,password:hashPassword(password)};
  users.push(user);saveUsers();
  return{ok:true};
}
function login(username,password){
  let user=users.find(u=>u.username===username&&u.password===hashPassword(password));
  if(!user)return{ok:false,msg:"Invalid credentials."};
  currentUser=user;sessionStorage.setItem("blog_current_user",JSON.stringify(user));
  return{ok:true};
}
function logout(){currentUser=null;sessionStorage.removeItem("blog_current_user");}
function createPost(title,body){
  if(!title||!body)return{ok:false,msg:"Title and body required."};
  posts.unshift({id:Date.now(),userId:currentUser.id,username:currentUser.username,title,body,created:new Date().toLocaleString()});
  savePosts();return{ok:true};
}
function isLoggedIn(){return currentUser!==null;}
function getCurrentUser(){return currentUser;}
