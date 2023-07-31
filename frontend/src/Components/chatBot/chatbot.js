/** @format */

import React, { useEffect, useState } from "react";
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
  const [onlineStatus, setOnlineStatus] = useState("Your AI Assistant is Offline! Please check your internet Connection!");

  const handleOnline = async (e) => {
    try {
      const response = await axios.get(
        `http://localhost:7912/openAI/statusCheck`
      );
      console.log(response);
      if (response.status == 200) {
        setOnlineStatus(response.data.content);
      }
    } catch (err) {
      setOnlineStatus(
        "Your AI Assistant is Offline! Please check your internet Connection!"
      );
    }
  };

  useEffect(() => {
    // handleOnline();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = {
      text: message,
      user: "Student",
    };

    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(`http://localhost:7912/openAI/query`, {
        role: "Student",
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
      <ListGroup.Item>
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
        <Col xs={12} md={12} lg={12}>
          <span className="lead my-3">
            OmniBot Status: <span className="h6">{onlineStatus}</span>
          </span>
        </Col>
        <br/>
        <Col xs={12} md={12} lg={12}>
          <Card className="my-3">
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
        <br/>
        <Col>
          <div className="h6 text-center my-3">
            Powered by Tech Leads of Industry - Microsoft, Phillips, Amazon, Vui.com, Gaia AI, Squark AI.
          </div>
          <div className="h6 text-center my-3">
          Co-Powered by our best ever, Northeastern University.
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatBotComponent;
