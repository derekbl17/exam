import { useState, useEffect } from "react";
import { usePostsQuery } from "../api/post";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import PostCard from "./PostCard";

const PostsDisplay = () => {
  // Data fetching
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = usePostsQuery();

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Apply filters whenever posts or filter values change
  useEffect(() => {
    if (posts?.data) {
      const filtered = posts.data.filter((post) => {
        // Search filter
        const matchesSearch =
          searchTerm === "" ||
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm]);

  if (postsLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (postsError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Error loading posts: {postsError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Search & Filter Controls */}
      <div className="mb-4 p-3 bg-light rounded shadow-sm">
        <Row className="g-3">
          {/* Search Input */}
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search posts"
              />
            </InputGroup>
          </Col>
        </Row>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredPosts.length > 0 ? filteredPosts.map((post) => (
          <Col key={post._id}>
            <PostCard post={post} />
          </Col>
        )) : <h2>No posts found!</h2>}

      </Row>

    </Container>
  );
};

export default PostsDisplay;
