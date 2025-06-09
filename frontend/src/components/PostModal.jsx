import { Modal, Button, Form, Badge, ListGroup } from "react-bootstrap";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import {
  useDeletePostMutation,
  useEditPostMutation,
  useModeratePostMutation
} from "../api/post";
import { toast } from "react-toastify";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation
} from "../api/comment";
import Swal from "sweetalert2";

const PostModal = ({ show, onHide, post }) => {
  const { user } = useAuth();
  const isAuthor = user?._id === post?.author?._id;

  const { mutateAsync: createComment } = useCreateCommentMutation();
  const { mutateAsync: deleteComment } = useDeleteCommentMutation();
  const [commentContent, setCommentContent] = useState("");

  const { mutateAsync: updatePost } = useEditPostMutation();
  const { mutateAsync: deletePost } = useDeletePostMutation();
  const { mutateAsync: moderatePost } = useModeratePostMutation();
  const { mutateAsync: likeComment } = useLikeCommentMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [editedData, setEditedData] = useState({
    postId: post._id,
    title: post.title,
    content: post.content,
  });

  const handleDeleteComment = async (commentId) => {
    deleteComment(commentId, {
      onSuccess: () => {
        toast.success("comment removed");
      },
      onError: (err) => {
        toast.error()
      }
    });
  };

  const handleLikeComment = async (commentId) => {
    likeComment(commentId, {
      onSuccess: () => {
        toast.success("Like status changed");
      },
      onError: (err) => {
        toast.error(err.response.data.message || "error liking post")
      }

    });
  }

  const moderatePostHandler = async (action) => {
    moderatePost({ postId: post._id, action: action }, {
      onSuccess: () => {
        toast.success("success")
      }
    })
  }

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await createComment({
        postId: post._id,
        content: commentContent,
      });
      toast.success("Comment added successfully");
      setCommentContent("");
    } catch (err) {
      toast.error("Failed to like");
    }
  };

  const deletePostHandler = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deletePost(post._id);
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log(editedData);
    updatePost(editedData, {
      onSuccess: () => {
        toast.success("Post updated successfully");
        setIsEditing(false);
      },
      onError: () => {
        toast.error("Failed to update post!");
      },
    });
  };


  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Post" : post.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditing ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editedData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editedData.content}
                onChange={(e) => handleChange("content", e.target.value)}
              />
            </Form.Group>

            <Button variant="success" onClick={handleSave}>
              Save Changes
            </Button>
            <Button
              variant="outline-secondary"
              className="ms-2"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </Form>
        ) : (
          <>
            <p>{post.content}</p>
            {(isAuthor || user.role === "admin") && (
              <>
                <Button
                  variant="outline-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Post
                </Button>
                <Button variant="outline-danger" onClick={deletePostHandler}>
                  Delete post
                </Button>
              </>
            )}
            {user.role === "admin" && (<>
              {post.status !== "active" && <Button variant="outline-success" onClick={() => moderatePostHandler("active")}>Active</Button>}
              {post.status !== "closed" && <Button variant="dark" onClick={() => moderatePostHandler("close")}>Close</Button>}
            </>

            )}
            {/* Comments Section */}

            <div className="mt-4">
              <h5>Answers</h5>

              {/* Comments List */}
              {post.comments?.length > 0 ? (
                <ListGroup className="mb-3">
                  {post.comments.map((comment) => (
                    <ListGroup.Item key={comment._id}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center">
                          <strong className="me-2">
                            {comment.author?.name || "Anonymous"}
                          </strong>
                          <Badge className="bg-success">{comment.likes.length}</Badge>
                          {(
                            user.role === "admin") && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteComment(comment._id)}
                                className="py-0 px-1"
                              >
                                Delete
                              </Button>
                            )}
                          {comment.likes.includes(user._id) ? <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleLikeComment(comment._id)}
                            className="py-0 px-1"
                          >
                            Unlike
                          </Button> : <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleLikeComment(comment._id)}
                            className="py-0 px-1"
                          >
                            Like
                          </Button>}

                        </div>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No answers yet</p>
              )}

              {/* Add Answer Form */}
              {user.role === "admin" && <><Form.Group className="mb-3">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write your answer here..."
                />
              </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleCommentSubmit}
                  disabled={!commentContent.trim()}
                >
                  Post Answer
                </Button></>}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PostModal;
