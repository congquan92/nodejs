const postModel = require('../model/postModel');

async function getPosts(req, res) {
  const posts = await postModel.getAllPosts();
  res.json(posts);
}

async function getPost(req, res) {
  const post = await postModel.getPostById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
}   

async function createPost(req, res) {
    if(req.body == undefined || req.body.title == undefined || req.body.content == undefined || Object.keys(req.body).length !== 2){
        return res.status(400).json({ message: 'Bad request' });
    }
  const post = await postModel.createPost(req.user.id, req.body);
  res.status(201).json({ post , data : req.body});
}

async function updatePost(req, res) {
  const updated = await postModel.updatePost(req.user.id, req.params.id, req.body);
  res.json(updated);
}

async function deletePost(req, res) {
  const result = await postModel.deletePost(req.user.id, req.params.id);
  res.json(result);
}

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
