import { useState } from "react";

const boxStyle = {
  backgroundColor: "lightgray",
  border: "2px solid black",
  padding: "5px",
};
const defualtText =
  "World geopolitics is shaped by the complex interactions between nations, influenced by power dynamics, economic interests, military alliances, and ideological divides. Major powers like the United States, China, and Russia play key roles in shaping global policy, while emerging nations assert greater  influence through regional cooperation and strategic diplomacy. Conflicts over resources, trade routes, and territorial claims often drive tensions, particularly in regions like the South China Sea, Eastern Europe, and the Middle East. International organizations such as the United Nations and NATO attempt to mediate disputes and promote stability. However, national interests frequently challenge global consensus and multilateral cooperation efforts.";
export default function TextExpander({
  text = defualtText,  
  collapsedNumWords = 50,
  expandButtonText = "Show more",
  collapsedButtonText = "Show less",
  buttonColor = "#0000cd",
}) {
  const [expandText, setExpandText] = useState(false);
  const [hovered, setHovered] = useState(false);
  const showText = text.split(" ").splice(0, collapsedNumWords).join(" ")+ '...';

  function handleClick() {
    setExpandText((prev) => !prev);
  }
  return (
    <div>
      <h1>TextExpander</h1>
      <div style={boxStyle}>
        <p onClick={handleClick}>
          {expandText ? text : showText}
          <span
            style={{
              color: hovered ? "#4169e1 " : buttonColor,
              textDecoration: hovered ? "underline" : "None",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {expandText ? collapsedButtonText : expandButtonText}
          </span>
        </p>
      </div>
    </div>
  );
}
