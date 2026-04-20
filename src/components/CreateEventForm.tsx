import React, { useState } from 'react';
import api from '@/lib/axios';
import MandatoryStars from './MandatoryStars';

interface CreateEventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    location: '',
    organizer: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const prefix = formData.name.trim() ? formData.name.trim().toLowerCase().replace(/\s+/g, '_') + '_' : '';
    const finalData = {
      ...formData,
      organizer: prefix + formData.organizer
    };

    try {
      await api.post("/api/events", finalData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full h-full bg-layer-1 p-8 border-color-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create Event</h2>
        {/* <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Event Name <MandatoryStars /></label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Annual Championship 2026"
          />
        </div>

        <div>
          <label>Organizer <MandatoryStars /></label>
          <div className="flex items-center primary-bg rounded-xl border border-color focus-within:ring-1 focus-within:ring-amber-500/50 transition-all overflow-hidden">
            {formData.name.trim() && (
              <span className="pl-4 pr-2 secondary-text text-sm whitespace-nowrap bg-white/5 self-stretch flex items-center border-r border-color">
                {formData.name.trim().toLowerCase().replace(/\s+/g, '_')}_
              </span>
            )}
            <input
              required
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="e.g. johnDoe@mail.com"
              className="flex-1 !rounded-none !bg-transparent !px-4 !py-3 !ring-0 !border-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Start Date <MandatoryStars /></label>
            <input
              required
              type="date"
              name="startDate"
              min={new Date().toISOString().split('T')[0]}
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>End Date <MandatoryStars /></label>
            <input
              required
              type="date"
              name="endDate"
              min={formData.startDate}
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label>Location <MandatoryStars /></label>
          <input
            required
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Olympic Stadium, NY"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="resize-none"
            placeholder="Short description of the event..."
          />
        </div>

        {/* {error && <p className="text-red-500 text-xs">{error}</p>} */}

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="w-50 secondary-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-50 primary-btn"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
