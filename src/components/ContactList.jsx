import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://dummyjson.com/users?limit=100");
        const formatted = res.data.users.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          image: user.image,
          company: user.company?.name || "Independent",
          city: user.address?.city || "Unknown",
        }));
        setContacts(formatted);
      } catch (err) {
        setError("Failed to fetch contacts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedContacts = [...filteredContacts].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} style={{ backgroundColor: "#ffe58f" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2 fs-5">Loading contacts...</span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center mt-5">
        {error}
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h2 className="text-center text-primary fw-bold mb-4">
            📞 Contact List
          </h2>

          <div className="d-flex mb-3 sticky-top bg-white pt-2 pb-2" style={{ zIndex: 10 }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="🔍 Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
            >
              Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
            </button>
          </div>


          <div
            className="scrollable-contact-list"
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              paddingRight: "8px",
            }}
          >
            <div className="row">
              {sortedContacts.length === 0 ? (
                <p className="text-center text-muted fs-5">No contacts found 😕</p>
              ) : (
                sortedContacts.map((contact, index) => (
                  <div key={index} className="col-md-6 col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm contact-card">
                      <div className="card-body d-flex align-items-center">
                        <img
                          src={contact.image}
                          alt={contact.name}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                          style={{
                            objectFit: "cover",
                            border: "2px solid #007bff",
                          }}
                        />
                        <div>
                          <h5 className="card-title mb-1">
                            {highlightMatch(contact.name)}
                          </h5>
                          <p className="text-muted small mb-1">
                            {contact.company} — {contact.city}
                          </p>
                          <p className="mb-0">
                            📧{" "}
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-decoration-none"
                            >
                              {contact.email}
                            </a>
                            <br />
                            📱{" "}
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-decoration-none"
                            >
                              {contact.phone}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
