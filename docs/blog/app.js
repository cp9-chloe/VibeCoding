let users=JSON.parse(localStorage.getItem("blog_users")||"[]");
let posts=JSON.parse(localStorage.getItem("blog_posts")||"[]");
let currentUser=JSON.parse(sessionStorage.getItem("blog_current_user")||"null");

function hashPassword(p){let h=0;for(let i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}return h.toString();}
function saveUsers(){localStorage.setItem("blog_users",JSON.stringify(users));}
function savePosts(){localStorage.setItem("blog_posts",JSON.stringify(posts));}

function register(username,password){
  if(!username||!password)return{ok:false,msg:"Username and password required."};
  if(users.find(u=>u.username===username))return{ok:false,msg:"Username taken"};
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
function createPost(title,body,image){
  if(!title||!body)return{ok:false,msg:"Title and body required."};
  posts.unshift({id:Date.now(),userId:currentUser.id,username:currentUser.username,title,body,image:image||"",created:new Date().toLocaleString(),likes:[],dislikes:[],comments:[]});
  savePosts();return{ok:true};
}
function updatePost(id,title,body,image){
  let p=posts.find(x=>x.id===id);if(!p)return;
  p.title=title;p.body=body;if(image!==undefined)p.image=image;
  savePosts();
}
function deletePost(id){
  posts=posts.filter(x=>x.id!==id);savePosts();
}
function toggleLike(postId){
  let p=posts.find(x=>x.id===postId);if(!p)return;
  let uid=currentUser.id;
  if(p.likes.includes(uid))p.likes=p.likes.filter(x=>x!==uid);
  else{p.likes.push(uid);p.dislikes=p.dislikes.filter(x=>x!==uid);}
  savePosts();
}
function toggleDislike(postId){
  let p=posts.find(x=>x.id===postId);if(!p)return;
  let uid=currentUser.id;
  if(p.dislikes.includes(uid))p.dislikes=p.dislikes.filter(x=>x!==uid);
  else{p.dislikes.push(uid);p.likes=p.likes.filter(x=>x!==uid);}
  savePosts();
}
function addComment(postId,text){
  if(!text.trim())return;
  let p=posts.find(x=>x.id===postId);if(!p)return;
  p.comments.push({userId:currentUser.id,username:currentUser.username,text:text,created:new Date().toLocaleString()});
  savePosts();
}
function isLoggedIn(){return currentUser!==null;}
function getCurrentUser(){return currentUser;}
