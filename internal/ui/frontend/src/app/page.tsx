"use client";

import { useState } from "react";
import { Greet } from "@shared/lib/wailsjs/go/main/App";
import { Button, TextInput, Text } from "@gravity-ui/uikit";
import "./page.sass";

function greet(name: string, updateResultText: (result: string) => any) {
  Greet(name).then(updateResultText);
}

export default function Page() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇"
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  return (
    <div id="app">
      <main>
        <Text id="result" className="result">
          {resultText}
        </Text>
        <div id="input" className="input-box">
          <TextInput
            id="name"
            className="input"
            onChange={updateName}
            autoComplete="off"
            name="input"
          />
          <Button className="btn" onClick={() => greet(name, updateResultText)}>
            Greet
          </Button>
        </div>
      </main>
    </div>
  );
}
