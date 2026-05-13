import { Event } from '../types';

interface EventListItemProps {
    event: Event;
    onDelete: (id: string) => void;
    onEdit: (event: Event) => void;
}

const EventListItem = ({ event, onDelete, onEdit }: EventListItemProps) => {
    return (
        <div 
            onClick={() => onEdit(event)}
            className="p-4 mb-2 rounded-xl border border-transparent hover:border-amber-500/20 hover:bg-white/5 transition-all duration-300 cursor-pointer group relative"
        >
            <div className="flex justify-between items-center text-left">
                <div>
                    <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">{event.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{event.location}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                                onDelete(event.id);
                            }
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Event"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <div 
                        className="bg-slate-800/50 p-2 rounded-lg group-hover:bg-amber-500/10 transition-colors"
                    >
                        <svg className="w-4 h-4 text-slate-500 group-hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};




export default EventListItem;