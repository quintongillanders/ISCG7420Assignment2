import React, { useEffect, useState } from 'react';
import { getReservations } from '../services/api';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        getReservations().then(res => setReservations(res.data));
    }, []);

    return (
        <div>
            <h1>Reservations</h1>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>
                        Room: {reservation.room.name} <br/>
                        Guest: {reservation.guest.name} <br/>
                        Date: {reservation.date} <br/>
                        Time: {reservation.startTime} - {reservation.endTime}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReservationList;

