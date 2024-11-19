export interface BookedSlot {
  date: string;
  time: string; 
  timeSlotId: string; 
  status: "Booked" | "Pending" | "Completed";
  doctorName: string;
}