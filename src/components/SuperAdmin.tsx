"use client";

import React, { SubmitEvent, useState } from 'react';
import SearchBar from './SearchBar';
import EventListItem from './EventListItem';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import EventPlaceholder from './EventPlaceholder';
import CreateEventForm from './CreateEventForm';

export default function SuperAdmin() {

  const [isCreateEvent, setIsCreateEvent] = useState(false);

  const createEvent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const promise = api.post("/api/events", {
      name: "Event Name",
      description: "Event Description",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      location: "Event Location",
      organizer: "Event Organizer",
    });

    try {
      await toast.promise(promise, {
        pending: "Creating event...",
        success: "Event created successfully!",
        error: "Failed to create event. Please try again.",
      });
    } catch (err) {
      console.error("Error creating event:", err);
    }
  }

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 h-full overflow-hidden">
      <div className='flex flex-col md:col-span-1 h-full overflow-hidden'>
        {/* Search Header */}
        {/* <div className="p-4 border-b border-color bg-background/50">
          <SearchBar />
        </div> */}

        {/* Scrollable Event List */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar mt-4">
          <EventListItem />
        </div>

        {!isCreateEvent && <button
          type="button"
          onClick={() => setIsCreateEvent(true)}
          className="primary-btn w-fit mx-auto px-12 text-sm shadow-lg hover:shadow-amber-500/10 mb-4"
        >
          Create Event
        </button>}
      </div>

      {/* Main Content - Event Details Column */}
      <div className='hidden md:flex md:col-span-2 items-center justify-center'>
        {!isCreateEvent ? <EventPlaceholder /> : <CreateEventForm onSuccess={() => setIsCreateEvent(false)} onCancel={() => setIsCreateEvent(false)} />}
      </div>
    </div>
  );
}
