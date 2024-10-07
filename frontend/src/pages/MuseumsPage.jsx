import React, { useState } from 'react';
import { useAttractionStore } from '../store/attraction';
import toast, { Toaster } from 'react-hot-toast';

function MuseumsPage() {
  const [museums, setMuseums] = useState([]);
  const [newMuseum, setNewMuseum] = useState({ name: '', description: '', location: '', openingHours: '', ticketPricesF: '',
    ticketPricesS: '',ticketPricesN: '', pictures: '' });
  const [editingMuseum, setEditingMuseum] = useState(null);
  const {createAttraction, deleteAttraction,updateAttraction ,getAttractions, attractions} = useAttractionStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMuseum({ ...newMuseum, [name]: value });
  };

  const handleCreate = async(e) => {
    e.preventDefault();
    console.log(newMuseum)
    const prices = {student: newMuseum.ticketPricesS, native:newMuseum.ticketPricesN, foreigner: newMuseum.ticketPricesF}
    const {success, message} = await createAttraction({...newMuseum, ticketPrices: prices});
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

    //setMuseums([...attractions, { ...newMuseum, id: Date.now() }]);
    //setNewMuseum({ name: '', description: '', location: '', openingHours: '', ticketPrice: '', pictures: '' });

  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setMuseums(
      attractions.map((museum) =>
        museum.id === editingMuseum.id ? editingMuseum : museum
      )
    );
    setEditingMuseum(null);
  };

  const handleDelete = (id) => {
    setMuseums(attractions.filter((museum) => museum.id !== id));
  };

  return (
    <div className="max-w-7xl text-black mx-auto p-8 bg-blue-50 rounded-lg">
      <Toaster/>
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
          placeholder="Ticket Price for"
          value={newMuseum.ticketPricesF}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="ticketPricesS"
          placeholder="Ticket Price student"
          value={newMuseum.ticketPricesS}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="ticketPricesN"
          placeholder="Ticket Price native"
          value={newMuseum.ticketPrices}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="pictures"
          placeholder="pictures URL"
          value={newMuseum.pictures}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
        onClick={handleCreate}
          type="submit"
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-200"
        >
          Create Museum
        </button>
      </form>

      {/* List of Museums */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">List of Museums</h2>
      {museums.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {museums.map((museum) => (
            <div key={museum.id} className="bg-white shadow-lg rounded-lg p-6">
              {editingMuseum?.id === museum.id ? (
                <form onSubmit={handleUpdate} className="grid gap-4">
                  <input
                    type="text"
                    name="name"
                    value={editingMuseum.name}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, name: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
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
                    name="ticketPrices"
                    value={editingMuseum.ticketPrices}
                    onChange={(e) => setEditingMuseum({ ...editingMuseum, ticketPrices: e.target.value })}
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
                  <p className="text-gray-500">Ticket Price: ${museum.ticketPrices}</p>
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
                      onClick={() => handleDelete(museum.id)}
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