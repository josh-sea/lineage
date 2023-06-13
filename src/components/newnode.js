import React, { useState } from "react";
import { Form, Button, Card} from "semantic-ui-react";

const NewNode = ({ onAdd, onDotClick, setTexts, nodeIndex }) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(null);

  const handleDateChange = (event, { value }) => {
    setDate(value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() !== "") {
      setTexts((prevState) => {
        const newState = [...prevState];
        newState.splice(nodeIndex, 0, {content,tags,date});
        localStorage.setItem("items", JSON.stringify(newState));
        return newState;
      });
    }
    setContent("");
    onDotClick();
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Card centered fluid className="card">
        <Card.Content style={{ padding: ".5em .5em 1em 1em" }}>
          <Card.Description
            style={{ paddingRight: ".5em", paddingTop: ".5em" }}
          >
            <Form.TextArea
              placeholder="Enter content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Card.Description>
        </Card.Content>
        <Card.Content extra textAlign="left">
          <Form.TextArea
            placeholder="date"
            value={date}
            onChange={handleDateChange}
            iconPosition="left"
            popupPosition="bottom center"
          />
          <Form.TextArea
            placeholder="tags, separate with commas..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Card.Content>
      </Card>

      <Button primary type="submit">
        Add
      </Button>
    </Form>
  );
};

export default NewNode;
