import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { townRepoCacheInstance, TownRepo, TownType } from "./core/cache/TownRepoCache";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [towns, setTowns] = useState<TownRepo[]>([]);

  async function test() {
    await townRepoCacheInstance.loadAll(true);
    const loadedTowns = Array.from(townRepoCacheInstance.values());
    setTowns(loadedTowns);
  }

  async function testSave() {
    await townRepoCacheInstance.appendElement({ 'primaryColour': '#FF0000', 'secondaryColour': '#00FF00', 'townName': 'Sample Town', 'townType': TownType.Town });
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React + Folk.js                                                                                                                                                                                                                                                                                                                                                                                      </h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <div>
        <button onClick={test}>Load Towns</button>
        <button onClick={testSave}>Save Sample Town</button>
        <ul>
          {towns.map((town) => (
            <li key={town.id}>
              {town.townName} - {TownType[town.townType]} - Primary Color: {town.primaryColour} - Secondary Color: {town.secondaryColour}
            </li>
          ))}
        </ul>
      </div>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
