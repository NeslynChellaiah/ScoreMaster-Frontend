"use client";

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import EventListItem from './EventListItem';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import EventPlaceholder from './EventPlaceholder';
import CreateEventForm from './CreateEventForm';
import { Event } from '../types';

export default function SuperAdmin() {

  const [isCreateEvent, setIsCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/events");
      // The backend returns a Page object wrapped in ApiResponse
      setEvents(response.data.data.content || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateEvent(false);
    setEditingEvent(null);
    fetchEvents(); // Refresh the list
  };

  const handleCreateCancel = () => {
    setIsCreateEvent(false);
    setEditingEvent(null);
  };

  const handleDelete = async (id: string) => {
    const promise = api.delete(`/api/events/${id}`);

    try {
      await toast.promise(promise, {
        pending: "Deleting event...",
        success: "Event deleted successfully!",
        error: "Failed to delete event. Please try again.",
      });
      handleCreateCancel(); // Close the edit window if it's open
      fetchEvents(); // Refresh the list
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };


  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsCreateEvent(true);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 h-full overflow-hidden">
      <div className={`${isCreateEvent ? 'hidden md:flex' : 'flex'} md:border-color-right flex-col h-full overflow-hidden justify-between`}>
        {/* Search Header */}
        {/* <div className="p-4 border-b border-color bg-background/50">
          <SearchBar />
        </div> */}

        {/* Scrollable Event List */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar mt-4">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading events...</div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventListItem key={event.id} event={event} onDelete={handleDelete} onEdit={handleEdit} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm italic">No events found.</div>
          )}
        </div>


        {!isCreateEvent && <button
          type="button"
          onClick={() => {
            setEditingEvent(null);
            setIsCreateEvent(true);
          }}
          className="primary-btn w-fit mx-auto px-12 text-sm shadow-lg hover:shadow-amber-500/10 mb-4"
        >
          Create Event
        </button>}
      </div>

      {/* Main Content - Event Details Column */}
      <div className={`${isCreateEvent ? 'flex' : 'hidden'} md:flex md:col-span-2 items-center justify-center`}>
        {!isCreateEvent ? <EventPlaceholder /> : <CreateEventForm eventToEdit={editingEvent} onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />}
      </div>
    </div>
  );
}


