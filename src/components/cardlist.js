import React, { useState } from "react";
import { Card, Container, Icon } from "semantic-ui-react";
import "./CardList.css";
import NewNode from "./newnode";

const CardList = ({ texts, setTexts }) => {
  const [nodeBool, setNodeBool] = useState(false);
  const [nodeIndex, setNodeIndex] = useState(null);

  const onDotClick = (index) => {
    setNodeIndex(index);
    setNodeBool((prevState) => {
      return !prevState;
    });
  };

  const removeItem = (index) => {
    if (texts.length > 1) {
      setTexts((prevState) => {
        const newState = [...prevState];
        newState.splice(index - 1, 1);
        localStorage.setItem("items", JSON.stringify(newState));
        return newState;
      });
    }
  };
  return (
    <Container
      textAlign="center"
      className="card-container"
      style={{ width: "50%" }}
    >
      <div className="line" />
      {texts &&
        texts
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort the texts array by date
          .map((text, index) => {
            index += 1;
            const rainbowColors = [
              "red",
              "orange",
              "yellow",
              "olive",
              "blue",
              "violet",
            ];
            const color = rainbowColors[index % rainbowColors.length]; // Rotate through rainbowColors array

            return (
              <React.Fragment key={index}>
                <Card color={color} centered fluid className="card">
                  <Card.Content style={{ padding: ".5em .5em 1em 1em" }}>
                    <Icon
                      style={{
                        float: "right",
                        paddingBottom: "10px",
                        marginBottom: "10px",
                      }}
                      color={color}
                      name="close"
                      className="remove-icon"
                      onClick={() => removeItem(index)}
                    />
                    <Card.Description
                      style={{ paddingRight: ".5em", paddingTop: ".5em" }}
                    >
                      {text.content}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra textAlign="left">
                    <Card.Meta>{text.date}</Card.Meta>
                    <Card.Meta>{text.tags}</Card.Meta>
                  </Card.Content>
                </Card>
                {nodeIndex && nodeIndex === index && (
                  <NewNode
                    nodeIndex={nodeIndex}
                    onDotClick={onDotClick}
                    setTexts={setTexts}
                  />
                )}
                {!nodeBool && nodeIndex !== index && (
                  <div className="dot-container">
                    <div
                      key={index}
                      className="dot"
                      onClick={() => onDotClick(index)}
                      onMouseEnter={(e) => e.target.classList.add("hovered")}
                      onMouseLeave={(e) => e.target.classList.remove("hovered")}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
    </Container>
  );
};

export default CardList;
