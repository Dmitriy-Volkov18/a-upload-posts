const express = require('express')
const router = express.Router()

const PostsController = require('../controllers/posts')
const multerConfig = require('../middleware/multerConfig')
const checkAuth = require("../middleware/check-auth")

router.get('', PostsController.getAllPosts)
router.get("/:id", PostsController.getPostById)

router.post('', checkAuth, multerConfig, PostsController.createPost)
router.put("/:id", checkAuth, multerConfig, PostsController.updatePost) 
router.delete('/:id', checkAuth, PostsController.deletePost)

module.exports = router