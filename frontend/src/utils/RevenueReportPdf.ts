import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadRevenueReportPDF = (
  reportData: any[], 
  startDate: string, 
  endDate: string
) => {
  const doc = new jsPDF();

  // Report Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Revenue Report", 105, 10, { align: "center" });

  // Report Date Range
  doc.setFontSize(12);
  doc.text(`Report Date Range: ${startDate} to ${endDate}`, 10, 20);

  // Total Revenue and Profit
  const totalRevenue = reportData.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);
  const totalProfit = reportData
    .reduce((acc, curr) => acc + (curr.appFee || 0), 0)
    .toFixed(2);

  doc.text(`Total Revenue: Rs.${totalRevenue}`, 10, 30);
  doc.text(`Total Profit: Rs.${totalProfit}`, 10, 40);

  // Table Data
  const tableData = reportData.map((transaction: any, index: number) => [
    index + 1,
    new Date(transaction.createdAt).toLocaleDateString("en-GB"),
    transaction.amount.toFixed(2),
    transaction.appFee ? transaction.appFee.toFixed(2) : "N/A",
    transaction.status,
    transaction.method,
  ]);

  // Create Table
  doc.autoTable({
    head: [["#", "Date", "Amount (Rs)", "Profit (Rs)", "Status", "Method"]],
    body: tableData,
    startY: 50,
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
  doc.save(`Revenue_Report_${startDate}_to_${endDate}.pdf`);
};
