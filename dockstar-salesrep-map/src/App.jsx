import { useState, useCallback } from "react";
import Buttons from "./components/Buttons";
import BottomSheet from "./components/BottomSheet";
import Filter from "./components/panels/Filter";
import Contact from "./components/panels/Contact";
import CreateList from "./components/panels/CreateList";
import User from "./components/panels/User";
import MapboxMap from "./components/MapboxMap";
import Notifications from "./components/Notifications";

const MAP_CENTER = [-80.0, 32.8];
const MAP_ZOOM = 5;

export default function App() {
  const [activePanel, setActivePanel] = useState("filter");
  const [snapVh, setSnapVh] = useState(50);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  }, []);

  function handleSetPanel(panel, snap) {
    setActivePanel(panel);
    setSnapVh(snap);
  }

  function handleContactClick(contact) {
    setActiveContact(contact);
    handleSetPanel("qv", 50);
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
      <MapboxMap center={MAP_CENTER} zoom={MAP_ZOOM} contacts={contacts} onContactClick={handleContactClick} />
      <Notifications notifications={notifications} />
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
            : activePanel === "user"
            ? "Account"
            : "Contact Details"
        }
      >
        {/* Panels */}
        <div className="panels stack">
          {activePanel === "filter" && <Filter onApply={setContacts} onAdd={handleAddContact} onRemove={handleRemoveContact} selectedContacts={selectedContacts} />}
          {activePanel === "qv" && <Contact contact={activeContact} onAdd={handleAddContact} />}
          {activePanel === "createlist" && <CreateList selectedContacts={selectedContacts} onRemove={handleRemoveContact} onClear={handleClearContacts} onNotify={addNotification} />}
          {activePanel === "user" && <User />}
        </div>
      </BottomSheet>
    </div>
  );
}
