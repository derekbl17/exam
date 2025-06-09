import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useCreatePostMutation } from "../api/post";
import { toast } from "react-toastify";

const CreatePostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const {
    mutate: createPost,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useCreatePostMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createPost(formData, {
      onSuccess: () => {
        setFormData({
          title: "",
          content: "",
        });
        toast.success("Post created!");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to create post");
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-secondary">
      <h2 className="mb-4">Create New Post</h2>

      {/* Error Handling */}

      {isError && (
        <Alert variant="danger">
          {error?.data?.message || "Failed to create post"}
        </Alert>
      )}
      {isSuccess && <Alert variant="success">Post created successfully!</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Details</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          maxLength={500}
        />
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner as="span" size="sm" animation="border" /> Creating...
          </>
        ) : (
          "Post question"
        )}
      </Button>
    </Form>
  );
};

export default CreatePostForm;
