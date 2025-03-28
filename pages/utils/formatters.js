// src/utils/formatters.js
export function formatDate(dateString) {
    if (!dateString) return 'TBD';

    const date = new Date(dateString);

    // Format: Day, Month Date, Year at HH:MM AM/PM
    return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function SDate(dateString) {
    if (!dateString) return 'TBD';

    const date = new Date(dateString);

    // Format: Day, Month Date, Year at HH:MM AM/PM
    return date.toLocaleString('en-US', {
        // weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        // hour: 'numeric',
        //minute: '2-digit',
        // hour12: true
    });
}

export function getStatusColor(status) {
    switch (status) {
        case 'IN_PROGRESS':
            return 'bg-amber-100 text-amber-800';
        case 'COMPLETED':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-green-100 text-green-800';
    }
}

export function getStatusText(status) {
    switch (status) {
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'COMPLETED':
            return 'Completed';
        default:
            return 'Upcoming';
    }
}