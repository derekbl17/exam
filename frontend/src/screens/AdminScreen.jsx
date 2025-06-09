import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AdminUserList from "./AdminUserList";

const AdminScreen = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="mb-4">Manage Users</h1>
              <AdminUserList />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminScreen;
