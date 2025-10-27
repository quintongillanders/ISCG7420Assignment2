import React, { useEffect, useState } from 'react';
import { getReservations } from '../services/api';
import './ReservationList.css';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        getReservations().then(res => setReservations(res.data));
    }, []);

    return (
        <div style={{ maxWidth: '900px', margin: '50px auto', padding: '0 20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Reservations</h1>

            {reservations.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#555', fontSize: '16px' }}>
                    No reservations found.
                </p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {reservations.map(reservation => (
                        <li
                          key={reservation.id}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                          }}
                        >
                            <strong>Room:</strong> {reservation.room.name} <br/>
                            <strong>Guest:</strong> {reservation.guest.name} <br/>
                            <strong>Date:</strong> {reservation.date} <br/>
                            <strong>Time:</strong> {reservation.startTime} - {reservation.endTime}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ReservationList;
