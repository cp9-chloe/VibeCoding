import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, push, set, get, remove, update, onValue, query, orderByChild }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser = null;
let posts = [];

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  updateNav();
});

function updateNav() {
  const loginEl = document.getElementById("nav-login");
  const registerEl = document.getElementById("nav-register");
  const newEl = document.getElementById("nav-new");
  const logoutEl = document.getElementById("nav-logout");
  if (currentUser) {
    if (loginEl) loginEl.classList.add("hide");
    if (registerEl) registerEl.classList.add("hide");
    if (newEl) newEl.classList.remove("hide");
    if (logoutEl) logoutEl.classList.remove("hide");
  } else {
    if (loginEl) loginEl.classList.remove("hide");
    if (registerEl) registerEl.classList.remove("hide");
    if (newEl) newEl.classList.add("hide");
    if (logoutEl) logoutEl.classList.add("hide");
  }
}

function register(username, password) {
  if (!username || !password) return { ok: false, msg: "Username and password required." };
  const email = username.replace(/[^a-zA-Z0-9]/g, "_") + "@blog.local";
  return createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      set(ref(db, "users/" + cred.user.uid), { username: username });
      return { ok: true };
    })
    .catch((err) => {
      if (err.code === "auth/email-already-in-use") return { ok: false, msg: "Username taken" };
      return { ok: false, msg: err.message };
    });
}

function login(username, password) {
  if (!username || !password) return { ok: false, msg: "Username and password required." };
  const email = username.replace(/[^a-zA-Z0-9]/g, "_") + "@blog.local";
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => ({ ok: true }))
    .catch(() => ({ ok: false, msg: "Invalid credentials." }));
}

function logout() {
  signOut(auth);
}

function isLoggedIn() {
  return currentUser !== null;
}

function getCurrentUser() {
  return currentUser;
}

function createPost(title, body, image) {
  if (!title || !body) return { ok: false, msg: "Title and body required." };
  const postRef = push(ref(db, "posts"));
  return set(postRef, {
    id: postRef.key,
    userId: currentUser.uid,
    username: currentUser.email.split("@")[0],
    title: title,
    body: body,
    image: image || "",
    created: new Date().toLocaleString(),
    likes: {},
    dislikes: {},
    comments: {}
  }).then(() => ({ ok: true }));
}

function updatePost(id, title, body, image) {
  const updates = { title, body };
  if (image !== undefined) updates.image = image;
  return update(ref(db, "posts/" + id), updates);
}

function deletePost(id) {
  return remove(ref(db, "posts/" + id));
}

function toggleLike(postId) {
  if (!currentUser) return;
  const likeRef = ref(db, "posts/" + postId + "/likes/" + currentUser.uid);
  const dislikeRef = ref(db, "posts/" + postId + "/dislikes/" + currentUser.uid);
  return get(likeRef).then((snap) => {
    if (snap.exists()) {
      remove(likeRef);
    } else {
      set(likeRef, true);
      remove(dislikeRef);
    }
  });
}

function toggleDislike(postId) {
  if (!currentUser) return;
  const likeRef = ref(db, "posts/" + postId + "/likes/" + currentUser.uid);
  const dislikeRef = ref(db, "posts/" + postId + "/dislikes/" + currentUser.uid);
  return get(dislikeRef).then((snap) => {
    if (snap.exists()) {
      remove(dislikeRef);
    } else {
      set(dislikeRef, true);
      remove(likeRef);
    }
  });
}

function addComment(postId, text) {
  if (!text.trim() || !currentUser) return;
  const commentRef = push(ref(db, "posts/" + postId + "/comments"));
  return set(commentRef, {
    userId: currentUser.uid,
    username: currentUser.email.split("@")[0],
    text: text,
    created: new Date().toLocaleString()
  });
}

function listenPosts(callback) {
  const postsRef = ref(db, "posts");
  onValue(postsRef, (snap) => {
    const data = snap.val();
    if (!data) { callback([]); return; }
    const arr = Object.values(data).sort((a, b) => (b.created || "").localeCompare(a.created || ""));
    arr.forEach((p) => {
      p.likes = p.likes ? Object.keys(p.likes) : [];
      p.dislikes = p.dislikes ? Object.keys(p.dislikes) : [];
      p.comments = p.comments ? Object.values(p.comments) : [];
    });
    callback(arr);
  });
}
