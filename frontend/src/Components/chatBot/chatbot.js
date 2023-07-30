import React, { useState } from "react";
import {
  Col,
  Row,
  Form,
  Button,
  Container,
  ListGroup,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

function ChatBotComponent() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = {
      text: message,
      user: "User",
    };

    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(`http://localhost:7912/openAI/query`, {
        role: "User", // or role: 'Bot', depending on your setup
        message: message,
      });

      console.log("dta..", response.data.content);
      const botMessage = {
        text: response.data.content, // or response.data.message, adjust according to your server response structure
        user: "Tutor",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error fetching AI response", error);
    }
  };

  const renderMessage = (message, index) => {
    const parts = String(message.text).split("```");

    return (
      <ListGroup.Item >
        <strong>{message.user}: </strong>
        {parts.map((part, i) =>
          i % 2 === 0 ? (
            part
          ) : (
            <SyntaxHighlighter language="python" style={solarizedlight}>
              {part}
            </SyntaxHighlighter>
          )
        )}
      </ListGroup.Item>
    );
  };

  return (
    <Container fluid className="my-3">
      <Row>
        <Col xs={12} md={4} lg={3}>
          <Card>
            <Card.Header>Previous Chats</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item></ListGroup.Item>
              <ListGroup.Item></ListGroup.Item>
              <ListGroup.Item></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Card>
            <Card.Body>
              <ListGroup>
                {messages.map(renderMessage)}
                {/* {messages.map((message, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{message.user}: </strong> {message.text}
                  </ListGroup.Item>
                ))} */}
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                  />
                  <Button type="submit">Send</Button>
                </Form.Group>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatBotComponent;
