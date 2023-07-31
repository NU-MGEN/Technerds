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
  Spinner,
} from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import parse from "html-react-parser";
import { BlockMath } from "react-katex";

function ChatBotComponent() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(
    "Your AI Assistant is Offline! Please check your internet Connection!"
  );
  const [isloading, setResponseBool] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("Please select a course");
  const [showBot, setShowBot] = useState(false)

  const handleOnline = async (e) => {
    try {
      const response = await axios.get(
        `http://localhost:7912/openAI/statusCheck`
      );
      console.log(response);
      if (response.status === 200) {
        setOnlineStatus(response.data.content);
      }
    } catch (err) {
      setOnlineStatus(
        "Your AI Assistant is Offline! Please check your internet Connection!"
      );
    }
  };

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
    handleOnline();
  }, []);

  const handleSelectChange = (e) => {
    if (e.target.value !== "Please select a course") {
      setShowBot(true)
    }

     if (e.target.value === "Please select a course") {
       setShowBot(false);
     }

      setSelectedCourse(e.target.value);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseBool(true);
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
      setMessage(" ");
      setResponseBool(false);
    } catch (error) {
      console.error("Error fetching AI response", error);
    }
  };
  const handleClear = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:7912/openAI/clearChat`
      );
      console.log(response);
      const botMessage = {
        text:
          response.data.content +
          " Cleared your History and connected back to your tutor again! Happy Learning!",
        user: "OmniBot",
      };

      setMessages((prevMessages) => [botMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error fetching AI response", error);
    }
  };

  const renderMessage = (message, index) => {
    console.log("message", message);
    const tempNewlineReplacement = "__TEMP_NEWLINE__";
    let text = message.text.replace(/\n/g, tempNewlineReplacement);
    const parts = text.split(
      /(```.*?```|\$\$.*?\$\$|<.*?>|\\\(.+?\\\)|\\\[.+?\\\])/gs
    );

    return (
      <ListGroup.Item key={index}>
        <strong>{message.user}: </strong>
        {parts.map((part, i) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            const code = part
              .slice(3, -3)
              .trim()
              .replace(/__TEMP_NEWLINE__/g, "\n");
            return (
              <SyntaxHighlighter key={i} language="python" style={vscDarkPlus}>
                {code}
              </SyntaxHighlighter>
            );
          } else if (part.startsWith("$$") && part.endsWith("$$")) {
            const latex = part
              .slice(2, -2)
              .trim()
              .replace(/__TEMP_NEWLINE__/g, "\n");
            return <BlockMath key={i}>{latex}</BlockMath>;
          } else if (/<.*?>/gs.test(part)) {
            return parse(part);
          } else if (part.startsWith("\\") && part.endsWith("\\")) {
            const mathJaxPart = part;
            return (
              <div
                key={i}
                dangerouslySetInnerHTML={{
                  __html: {mathJaxPart},
                }}
              />
            );
          } else {
            return part.replace(/__TEMP_NEWLINE__/g, "\n");
          }
        })}
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
          <Container className="mt-5">
            <Row className="justify-content-md-center">
              <Col xs={12} md={4}>
                <Form.Select
                  aria-label="Default select example"
                  value={selectedCourse}
                  onChange={handleSelectChange}
                >
                  <option>Please select a course</option>
                  <option value="1">
                    CSYE 6225. Network Structures and Cloud Computing.
                  </option>
                  <option value="2">
                    CSYE 7200. Big-Data System Engineering Using Scala.
                  </option>
                  <option value="3">
                    INFO 6105. Data Science Engineering Methods and Tools.
                  </option>
                  <option value="4">
                    INFO 6150. Web Design and User Experience Engineering.
                  </option>
                </Form.Select>
              </Col>
            </Row>
          </Container>
        </Col>
        <br />
        {showBot && (
          <>
            <Row className="justify-content-center">
              <Col xs={12} md={6} lg={6}>
                <Card className="my-3">
                  <Card.Body>
                    <ListGroup>
                      {isloading ? (
                        <div className="d-flex justify-content-center">
                          <Spinner
                            animation="border"
                            role="status"
                            className="me-2"
                          />
                          Fetching your answer
                        </div>
                      ) : (
                        messages.map(renderMessage)
                      )}
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
                          placeholder="What do you want to learn today?"
                          className="me-3"
                        />
                        <Button type="submit" className="me-2">
                          Send
                        </Button>
                        <Button
                          className="btn btn-danger"
                          onClick={handleClear}
                        >
                          <Trash3Fill />
                        </Button>
                      </Form.Group>
                    </Form>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </>
        )}

        <br />
        <Col>
          <div className="h6 text-center my-3">
            Powered by Tech Leads of Industry - Microsoft, Phillips, Amazon,
            Vui.com, Gaia AI, Squark AI.
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
