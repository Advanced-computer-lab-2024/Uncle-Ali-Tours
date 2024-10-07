import React, { useState, useEffect } from 'react';
import { useAttractionStore } from '../store/attraction';
import toast, { Toaster } from 'react-hot-toast';

function MuseumsPage() {
  const { createAttraction, deleteAttraction, updateAttraction, getAttractions, attractions } = useAttractionStore();
  
  const [newMuseum, setNewMuseum] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPricesF: '',
    ticketPricesS: '',
    ticketPricesN: '',
    pictures: ''
  });
  
  const [editingMuseum, setEditingMuseum] = useState(null);

  useEffect(() => {
    handlePress(); // Fetch all attractions when the page loads
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMuseum({ ...newMuseum, [name]: value });
  };

  // Create a new museum
  const handleCreate = async (e) => {
    e.preventDefault();
    const prices = { student: newMuseum.ticketPricesS, native: newMuseum.ticketPricesN, foreigner: newMuseum.ticketPricesF };
    const { success, message } = await createAttraction({ ...newMuseum, ticketPrices: prices });
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
      setNewMuseum({
        name: '',
        description: '',
        location: '',
        openingHours: '',
        ticketPricesF: '',
        ticketPricesS: '',
        ticketPricesN: '',
        pictures: ''
      });
      handlePress(); // Refresh the list after creation
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  // Fetch all attractions
  const handlePress = async () => {
    await getAttractions(); // Fetch all attractions without any filters
  };

  // Delete a museum by name
  const handleDelete = async (name) => {
    const { success, message } = await deleteAttraction(name);
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
      handlePress(); // Refresh the list after deletion
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  // Update a museum (disallow editing the name)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const prices = {
      student: editingMuseum.ticketPricesS,
      native: editingMuseum.ticketPricesN,
      foreigner: editingMuseum.ticketPricesF
    };
    const updatedMuseum = { description: editingMuseum.description, location: editingMuseum.location, openingHours: editingMuseum.openingHours, ticketPrices: prices, pictures: editingMuseum.pictures };

    const { success, message } = await updateAttraction(editingMuseum.name, updatedMuseum); // Update using the name
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
      setEditingMuseum(null); // Clear editing state after update
      handlePress(); // Refresh the list after update
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  return (
    <div className="max-w-7xl text-black mx-auto p-8 bg-blue-50 rounded-lg">
      <Toaster />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Museums and Historical Places</h1>

      {/* Form for Creating a New Museum */}
      <form onSubmit={handleCreate} className="mb-10 grid gap-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create New Museum</h2>
        <input
          type="text"
          name="name"
          placeholder="Museum Name"
          value={newMuseum.name}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newMuseum.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newMuseum.location}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="openingHours"
          placeholder="Opening Hours"
          value={newMuseum.openingHours}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="ticketPricesF"
          placeholder="Ticket Price for Foreigners"
          value={newMuseum.ticketPricesF}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="ticketPricesS"
          placeholder="Ticket Price for Students"
          value={newMuseum.ticketPricesS}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="ticketPricesN"
          placeholder="Ticket Price for Natives"
          value={newMuseum.ticketPricesN}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="pictures"
          placeholder="Pictures URL"
          value={newMuseum.pictures}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-200"
        >
          Create Museum
        </button>
      </form>

      {/* Button to load attractions */}
      <button
        onClick={handlePress}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-200 mb-6"
      >
        List All Attractions
      </button>

      {/* List of Museums */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">List of Museums</h2>
      
      {attractions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {attractions.map((museum) => (
            <div key={museum._id} className="bg-white shadow-lg rounded-lg p-6">
              {editingMuseum?.name === museum.name ? (
                <form onSubmit={handleUpdate} className="grid gap-4">
                  <input
                    type="text"
                    name="description"
                    value={editingMuseum.description}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, description: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editingMuseum.location}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, location: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="openingHours"
                    value={editingMuseum.openingHours}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, openingHours: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    name="ticketPricesF"
                    value={editingMuseum.ticketPricesF}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, ticketPricesF: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    name="ticketPricesS"
                    value={editingMuseum.ticketPricesS}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, ticketPricesS: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    name="ticketPricesN"
                    value={editingMuseum.ticketPricesN}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, ticketPricesN: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="pictures"
                    value={editingMuseum.pictures}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, pictures: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMuseum(null)}
                      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{museum.name}</h3>
                  <p className="text-gray-600">{museum.description}</p>
                  <p className="text-gray-500">Location: {museum.location}</p>
                  <p className="text-gray-500">Opening Hours: {museum.openingHours}</p>
                  <p className="text-gray-500">Ticket Price: ${museum.ticketPrices.foreigner}</p>
                  {museum.pictures && (
                    <img
                      src={museum.pictures}
                      alt={museum.name}
                      className="mt-4 w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={() => setEditingMuseum(museum)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(museum.name)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No museums available</p>
      )}
    </div>
  );
}

export default MuseumsPage;
