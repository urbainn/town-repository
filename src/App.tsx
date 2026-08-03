import "./App.css";
import { Header, HeaderProps } from "./components/Header";
import { useState } from "react";
import TownSelectionPage from "./pages/town/TownSelectionPage";

function App() {

  /** Navigate to a new page */
  const navigate = (page: React.ReactNode, headerProps?: HeaderProps) => {
    if (headerProps) {
      setHeaderProps(headerProps);
    }
    setCurrentPage(page);
  }

  const [headerProps, setHeaderProps] = useState<HeaderProps>({ show: false, text: "" });
  const [currentPage, setCurrentPage] = useState<React.ReactNode>(<TownSelectionPage navigate={navigate} setHeader={setHeaderProps} />);

  return (
    <main>
      <Header
        show={headerProps.show}
        text={headerProps.text}
        rightSideContent={headerProps.rightSideContent}
        onBack={headerProps.onBack}
      />

      {currentPage}
    </main>
  );
}

export default App;
