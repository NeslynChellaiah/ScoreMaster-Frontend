import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import MandatoryStars from './MandatoryStars';
import { Event } from '../types';
import { toast } from 'react-toastify';

interface CreateEventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  eventToEdit?: Event | null;
}

export default function CreateEventForm({ onSuccess, onCancel, eventToEdit }: CreateEventFormProps) {
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

  useEffect(() => {
    if (eventToEdit) {
      const prefix = eventToEdit.id + "_";
      const organizerSuffix = eventToEdit.organizer.startsWith(prefix) 
        ? eventToEdit.organizer.substring(prefix.length) 
        : eventToEdit.organizer;

      setFormData({
        name: eventToEdit.name,
        description: eventToEdit.description || '',
        startDate: eventToEdit.startDate,
        endDate: eventToEdit.endDate,
        location: eventToEdit.location,
        organizer: organizerSuffix,
      });
    }
  }, [eventToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Re-add prefix for both create and update
      const eventId = eventToEdit ? eventToEdit.id : formData.name.trim().toLowerCase().replace(/\s+/g, '_');
      const prefix = eventId + '_';
      const finalData = {
        ...formData,
        organizer: prefix + formData.organizer
      };

      if (eventToEdit) {
        // Update existing event
        await api.put(`/api/events/${eventToEdit.id}`, finalData);
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        await api.post("/api/events", finalData);
        toast.success("Event created successfully!");
      }
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to save event.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEditing = !!eventToEdit;
  const currentEventId = isEditing ? eventToEdit.id : formData.name.trim().toLowerCase().replace(/\s+/g, '_');

  return (
    <div className="w-full h-full bg-layer-1 p-8 border-color-left overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{isEditing ? "Update Event" : "Create Event"}</h2>
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
            {currentEventId && (
              <span className="pl-4 pr-2 secondary-text text-sm whitespace-nowrap bg-white/5 self-stretch flex items-center border-r border-color">
                {currentEventId}_
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
              min={!isEditing ? new Date().toISOString().split('T')[0] : ""}
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

        <div className="flex gap-3 justify-center pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-40 secondary-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-40 primary-btn"
          >
            {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Event" : "Create Event")}
          </button>
        </div>
      </form>
    </div>
  );
}

