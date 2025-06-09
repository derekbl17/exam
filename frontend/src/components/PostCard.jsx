import { Card, Button, Badge } from "react-bootstrap";
import { useState } from "react";
import PostModal from "./PostModal";

const PostCard = ({ post }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h5">{post.title}</Card.Title>
          <div className="mt-auto">
            <Badge className={post.status === "new" ? "bg-primary" : post.status === "active" ? "bg-success" : "bg-dark"}>Status: {post.status}</Badge>
          </div>
          <p>{post.content}</p>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>
            Posted by {post.author?.name} on {post.createdAt}
          </small>
        </Card.Footer>
        <Card.Footer>
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => setShowModal(true)}
          >
            View
          </Button>
        </Card.Footer>
      </Card>
      <PostModal
        show={showModal}
        onHide={() => setShowModal(false)}
        post={post}
      />
    </>
  )
};

export default PostCard;
