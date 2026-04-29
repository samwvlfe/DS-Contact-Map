import { useState } from "react";
import Buttons from "./components/Buttons";
import BottomSheet from "./components/BottomSheet";
import Filter from "./components/panels/Filter";
import Contact from "./components/panels/Contact";
import CreateList from "./components/panels/CreateList";
import MapboxMap from "./components/MapboxMap";

export default function App() {
  const [activePanel, setActivePanel] = useState("filter");
  const [snapVh, setSnapVh] = useState(50);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  function handleSetPanel(panel, snap) {
    setActivePanel(panel);
    setSnapVh(snap);
  }

  function handleContactClick(contact) {
    setActiveContact(contact);
    handleSetPanel("qv", 85);
  }

  function handleAddContact(contact) {
    setSelectedContacts(prev =>
      prev.find(c => c.id === contact.id) ? prev : [...prev, contact]
    );
  }

  function handleRemoveContact(id) {
    setSelectedContacts(prev => prev.filter(c => c.id !== id));
  }

  function handleClearContacts() {
    setSelectedContacts([]);
  }


  return (
    <div className="main">
      <MapboxMap center={[-80.0, 32.8]} zoom={9} />
      <Buttons
        activePanel={activePanel}
        onSetPanel={handleSetPanel}
        selectedCount={selectedContacts.length}
      />
      <BottomSheet
        snapVh={snapVh}
        setSnapVh={setSnapVh}
        onBack={activePanel !== "filter" ? () => handleSetPanel("filter", 50) : null}
        title={
          activePanel === "filter"
            ? "Filters"
            : activePanel === "createlist"
            ? "Selected Contacts"
            : "Contact Details"
        }
      >
        {/* Panels */}
        <div className="panels stack">
          {activePanel === "filter" && <Filter onApply={setContacts} onAdd={handleAddContact} onRemove={handleRemoveContact} selectedContacts={selectedContacts} />}
          {activePanel === "qv" && <Contact />}
          {activePanel === "createlist" && <CreateList selectedContacts={selectedContacts} onRemove={handleRemoveContact} onClear={handleClearContacts} />}
        </div>
      </BottomSheet>
    </div>
  );
}
