import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadAptReportPDF = (reportData: any[], startDate: string, endDate: string) => {
  const doc = new jsPDF();

  // Report Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Appointment Report", 105, 10, { align: "center" });

  // Report Date Range
  doc.setFontSize(12);
  doc.text(`Report Date Range: ${startDate} to ${endDate}`, 10, 20);

  // Table Data
  const tableData = reportData.map((appointment: any, index: number) => [
    index + 1,
    appointment.doctor.name,
    appointment.user.name,
    new Date(appointment.date).toLocaleDateString("en-GB"),
    appointment.time,
    appointment.status,
  ]);

  // Create Table
  doc.autoTable({
    head: [["#", "Doctor", "Patient", "Date", "Time", "Status"]],
    body: tableData,
    startY: 30,
    styles: {
      cellPadding: 3,
      fontSize: 10,
    },
    headStyles: {
      fillColor: [40, 127, 204], // Blue header background
      textColor: [255, 255, 255], // White text
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [50, 50, 50], // Dark gray text
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245], // Light gray for alternate rows
    },
  });

  // Save the PDF
  doc.save(`Appointment_Report_${startDate}_to_${endDate}.pdf`);
};
