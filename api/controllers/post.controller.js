import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...post, isSaved: false });
        } else {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};


export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  // Kiểm tra xem các trường bắt buộc có giá trị hay không
  if (
    !body.postData ||
    !body.postData.title ||
    body.postData.price == null ||  // Kiểm tra null hoặc undefined
    !body.postData.address ||
    !body.postData.city ||
    body.postData.bedroom == null ||  // Kiểm tra null hoặc undefined
    body.postData.bathroom == null ||  // Kiểm tra null hoặc undefined
    !body.postData.type ||
    !body.postData.property ||
    !body.postData.latitude ||
    !body.postData.longitude ||
    !Array.isArray(body.postData.images) || body.postData.images.length === 0 ||
    !body.postDetail ||
    !body.postDetail.desc ||
    !body.postDetail.utilities ||
    !body.postDetail.pet
  ) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message }); // Hiển thị thông tin chi tiết về lỗi
  }
};


export const updatePost = async (req, res) => {
  const { id } = req.params;
  const postData = req.body.postData;
  const postDetail = req.body.postDetail;

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        postDetail: {
          update: postDetail
        }
      }
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    // Kiểm tra xem người dùng hiện tại có quyền xóa bài đăng không
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Kiểm tra xem người dùng hiện tại có quyền xóa bài đăng không
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Xóa bản ghi trong bảng PostDetail liên quan đến bài đăng
    await prisma.postDetail.delete({
      where: { postId: id },
    });

    // Sau khi xóa bản ghi trong bảng PostDetail, tiến hành xóa bài đăng từ bảng Post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
