import { useState, useEffect, Children, Fragment } from "react";

const HarryPotterUrl = "https://hp-api.onrender.com/api/characters";
const modes = { Easy: 6, Medium: 10, Hard: 15 };

import "./App.css";

function Cards({ data, clickedCardsState, difficultyState }) {
  const [gameOver, setGameOver] = useState(false);
  const [clickedCards, setClickedCards] = clickedCardsState;
  const [difficulty, setDifficulty] = difficultyState;

  shuffle(data);

  const handleClick = function (card) {
    if (!clickedCards.includes(card.target.id)) {
      setClickedCards([...clickedCards, card.target.id]);
      shuffle(data);
      return;
    }
    setGameOver(true);
  };

  useEffect(() => {
    if (clickedCards.length == data.length && data.length != 0) {
      setGameOver(true);
    }
  }, [clickedCards]);

  return (
    <>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(data.length / 2, 5)}, 1fr)`,
          gap: "20px",
          rowGap: "50px",
        }}
      >
        {data.map((person) => {
          return (
            <li
              key={person.id}
              onClick={handleClick}
              style={{
                cursor: "pointer",
                background: "black",
                visibility: gameOver ? "hidden" : "visible",
              }}
            >
              <img
                src={person.image}
                id={person.id}
                alt={person.name}
                style={{
                  width: "250px",
                  height: "300px",
                  objectFit: "contain",
                  border: "5px solid white",
                  boxShadow: "0px 0px 20px 0px grey",
                }}
              />
            </li>
          );
        })}
      </ul>
      <div
        className="endGame"
        style={{
          position: "absolute",
          top: "100px",
          left: "43vw",
          visibility: gameOver ? "visible" : "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "rgb(255,255,255)",
            background: "rgba(0, 0, 0, 0.6)",
            padding: "2px 20px",
          }}
        >
          {clickedCards.length < data.length ? "Game Over!" : "You won!"} Your
          score:{" "}
          <span style={{ textDecoration: "underline" }}>
            {clickedCards.length}
          </span>
        </h3>
        <button
          onClick={() => {
            setClickedCards([]);
            setDifficulty(null);
          }}
        >
          NEW GAME
        </button>
      </div>
    </>
  );
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function StartGame({ url, clickedCardsState, difficultyState }) {
  const numberOfCards = modes[difficultyState[0]];
  let [images, setImages] = useState([]);
  useEffect(() => {
    fetch(url, { mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        setImages(data.slice(0, numberOfCards));
      })
      .catch((error) => console.log(error));
  }, []);

  if (images != [])
    return (
      <Cards
        data={images}
        clickedCardsState={clickedCardsState}
        difficultyState={difficultyState}
      />
    );
}

function Button({ title, onClick }) {
  return (
    <button onClick={onClick} className="difficulty" id={title}>
      {title}
    </button>
  );
}

function StartingWindow({ difficultyState }) {
  const [difficulty, setDifficulty] = difficultyState;

  function handleClick(button) {
    setDifficulty(button.target.id);
  }

  return (
    <div
      style={{
        justifyContent: "center",
        display: difficulty == null ? "flex" : "none",
        gap: "10px",
        marginTop: "50px",
      }}
    >
      <Button onClick={handleClick} title="Easy" />
      <Button onClick={handleClick} title="Medium" />
      <Button onClick={handleClick} title="Hard" />
    </div>
  );
}

function App() {
  const [maxScore, setMaxScore] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);
  const [difficulty, setDifficulty] = useState(null);

  maxScore < clickedCards.length ? setMaxScore(clickedCards.length) : null;

  return (
    <>
      <header>
        <h1 className="mainTitle">Memory card game</h1>
        <div className="scores">
          <div className="currScore">Score: {clickedCards.length}</div>
          <div className="maxScore">Record score: {maxScore}</div>
        </div>
      </header>
      <StartingWindow difficultyState={[difficulty, setDifficulty]} />
      {difficulty != null && (
        <StartGame
          url={HarryPotterUrl}
          clickedCardsState={[clickedCards, setClickedCards]}
          difficultyState={[difficulty, setDifficulty]}
        />
      )}
    </>
  );
}

export default App;
