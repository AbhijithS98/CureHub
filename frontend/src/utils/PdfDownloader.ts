import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadPrescriptionPDF = (prescription: any) => {
  const doc = new jsPDF();
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Prescription Details", 105, 10, { align: "center" });

  // Appointment & Patient Details
  doc.setFontSize(12);
  doc.text("Appointment Details:", 10, 20);
  doc.text(`Date: ${new Date(prescription.appointment?.date).toLocaleDateString("en-GB")}`, 10, 30);
  doc.text(`Time: ${prescription.appointment?.time}`, 10, 40);

  doc.text("Patient Details:", 10, 50);
  doc.text(`Name: ${prescription.patient?.name}`, 10, 60);
  doc.text(`Phone: ${prescription.patient?.phone}`, 10, 70);

  // Doctor Details
  doc.text("Doctor Details:", 10, 80);
  doc.text(`Name: Dr. ${prescription.doctor?.name}`, 10, 90);
  doc.text(`Specialization: ${prescription.doctor?.specialization}`, 10, 100);
  doc.text(
    `Address: ${prescription.doctor?.address?.clinicName}, ${prescription.doctor?.address?.district}, ${prescription.doctor?.address?.city}`,
    10,
    110
  );

  // Diagnosis
  doc.text("Diagnosis:", 10, 120);
  doc.text(prescription.diagnosis || "Not provided", 10, 130);

  // Medications Table
  const tableData = prescription.medications.map((med: any, index: number) => [
    index + 1,
    med.name,
    med.dosage,
    med.frequency,
    med.duration,
  ]);
  doc.autoTable({
    head: [["#", "Name", "Dosage", "Frequency", "Duration"]],
    body: tableData,
    startY: 140,
  });

  // Additional Advice
  if (prescription.advice && doc.lastAutoTable?.finalY !== undefined) {
    doc.text("Additional Advice:", 10, doc.lastAutoTable.finalY + 10);
    doc.text(prescription.advice, 10, doc.lastAutoTable.finalY + 20);
  }

  // Save the PDF
  doc.save(`Prescription_${prescription.patient?.name}.pdf`);
};
