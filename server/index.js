// require express
const express = require('express');
// require cors
const cors = require('cors');

// create express app
const app = express();

// middleware: intermediate function that we want to run
// in between the request and the response
// enable cors
app.use(cors());


// middleware to log request
app.use((req, res, next) => {
  // req.method: get, post, put, delete...  req.url: /api/users
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// middleware to parse JSON request body
// next() is built in because this is a built in express middleware
app.use(express.json());

// memory array to simulate database functionality
let blogPosts = [
  { id: 1, title: "First Post", content: "First Post Content", comments: [] },
  { id: 2, title: "Second Post", content: "Second Post Content", comments: [] },
  { id: 3, title: "Third Post", content: "Third Post Content", comments: [] }
]

// CRUD functionality: Create, Read, Update, Delete

// Read: GET request route handler to return all blog posts
app.get('/posts', (req, res) => {
  // attach the blogPosts array to the response object as a JSON object
  res.json(blogPosts);
});

// Read: GET request route handler to return all blog posts
app.get('/', (req, res) => {
  // attach the blogPosts array to the response object as a JSON object
  res.send("Welcome to my blog");
});

// Create: POST request route handler to create blog posts
app.post('/posts', (req, res) => {
  // create a new blog post object
  const newPost = { ...req.body };
  // add newPost to blog post to the blogPosts array
  blogPosts.push(newPost);
  // indicate the request was successful
  res.status(201).json(newPost);
})

// Update: PUT request route handler to update a blog post
// use a ':' in route to indicate a variable (route param)
app.put('/posts/:id', (req, res) => {
  // extract id from request params object using destructuring
  const { id } = req.params;
  // find the index of the blog post in the blogPosts array with matching id
  let index = blogPosts.findIndex(post => post.id === Number(id));
  if (index !== -1) {
    // update blog post at that index with the new information
    // the blog post at the index should be updated to be a new object that has all of the same data as the original blog post but whatever data was sent in the requests overwrites the original
    blogPosts[index] = { ...blogPosts[index], ...req.body };
    // send back the new, updated blog post
    res.json(blogPosts[index]);
    } else {
      res.status(404).send('Post not found')
    }
  });

// Delete: DELETE request route handler to delete a blog post
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  // use filter method if blog post id does not match id param, it stays
  // if it does, it gets remored/filtered out of the array
  blogPosts = blogPosts.filter(post => post.id !== Number(id));
  res.status(204).send();
})

// start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}.`)
});

