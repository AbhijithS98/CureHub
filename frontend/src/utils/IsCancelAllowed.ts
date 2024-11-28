import { Ibooking } from '../types/bookingInterface';


export const isCancelAllowed = (booking: Ibooking): boolean => {
      const bookingDate = new Date(booking.date);
      const cancellationDeadline = new Date(bookingDate);
      const currentDate = new Date();

  cancellationDeadline.setDate(bookingDate.getDate() - 1); 
  cancellationDeadline.setHours(23, 59, 59, 999); 

  return currentDate <= cancellationDeadline; 
};
