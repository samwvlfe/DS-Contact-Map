import { useState, useEffect } from "react";
import Buttons from "./components/Buttons";
import BottomSheet from "./components/BottomSheet";
import Filter from "./components/panels/Filter";
import Contact from "./components/panels/Contact";
import List from "./components/panels/List";
import MapboxMap from "./components/MapboxMap";

// Contact shape (from HubSpot API, filled in later):
// {
//   id: string,
//   name: string,
//   city: string,
//   state: string,
//   dist: number,
//   status: "connected" | "attempted" | "new",
//   phone: string,
//   email: string,
//   company: string,
//   owner: string,
//   lifecycle: string,
//   address: string,
//   zip: string,
//   notes: string,
//   lat: number,
//   lng: number,
// }

const DEFAULT_FILTERS = {
  locations: [],
  statuses: [],
  distance: 25,
};

export default function App() {
  const [activePanel, setActivePanel] = useState("filter");
  const [snapVh, setSnapVh] = useState(50);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('hs_access_token');
    if (!token) return;
    fetch('http://localhost:3002/api/contacts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched contacts:', data.results);
        setContacts(data.results || []);
      })
      .catch(err => console.error('Failed to fetch contacts:', err));
  }, []);

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

  function handleApplyFilters(draft) {
    setFilters(draft);
    // Will trigger API fetch with filters when server is ready
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
        title={
          activePanel === "filter"
            ? "Filters"
            : activePanel === "list"
            ? "Selected Contacts"
            : "Contact Details"
        }
      >
        {/* Panels */}
        <div className="panels stack">
          {activePanel === "filter" && <Filter filters={filters} onApply={handleApplyFilters} />}
          {activePanel === "qv" && <Contact />}
          {activePanel === "list" && <List />}
        </div>
      </BottomSheet>
    </div>
  );
}