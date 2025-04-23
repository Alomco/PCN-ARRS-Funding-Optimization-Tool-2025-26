/**
 * Export PDF report with enhanced design for PCN ARRS Funding Optimization Tool
 */
async function exportToPdf() {
    if (!validateResults()) {
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Constants for layout
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - 2 * margin;
        const fontRegular = 'Helvetica';
        const fontBold = 'Helvetica-Bold';
        const primaryColor = '#005eb8'; // NHS Blue
        const secondaryColor = '#003087'; // Darker Blue
        
        // Helper functions
        function addHeader(pageNumber) {
            doc.setFillColor(primaryColor);
            doc.rect(0, 0, pageWidth, 15, 'F');
            doc.setFont(fontRegular, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text(`PCN ARRS Funding Optimization Tool 2025/26 - ${pcnNameHidden.value || 'Unnamed PCN'}`, margin, 10);
            doc.text(`Page ${pageNumber}`, pageWidth - margin - 10, 10, { align: 'right' });
        }
        
        function addFooter() {
            doc.setFillColor(secondaryColor);
            doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
            doc.setFont(fontRegular, 'normal');
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);
            doc.text(
                `Powered by www.pcnd.info | Generated on ${new Date().toLocaleDateString('en-GB')}`,
                margin,
                pageHeight - 3
            );
        }
        
        function addSectionTitle(title, y) {
            doc.setFont(fontBold, 'normal');
            doc.setFontSize(16);
            doc.setTextColor(secondaryColor);
            doc.text(title, margin, y);
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.5);
            doc.line(margin, y + 2, margin + contentWidth, y + 2);
            return y + 10;
        }
        
        // Cover Page
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setFont(fontBold, 'normal');
        doc.setFontSize(28);
        doc.setTextColor(primaryColor);
        doc.text('PCN ARRS Funding Report', pageWidth / 2, 80, { align: 'center' });
        doc.setFontSize(20);
        doc.text(pcnNameHidden.value || 'Unnamed PCN', pageWidth / 2, 100, { align: 'center' });
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(14);
        doc.text(`Fiscal Year 2025/26`, pageWidth / 2, 120, { align: 'center' });
        doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 130, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text('Powered by www.pcnd.info', pageWidth / 2, pageHeight - 25, { align: 'center' });
        
        // Page 2: PCN Information and Funding Summary
        doc.addPage();
        let currentPage = 2;
        let yPosition = margin + 10;
        
        addHeader(currentPage);
        addFooter();
        
        // PCN Information
        yPosition = addSectionTitle('PCN Information', yPosition);
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`PCN Name: ${pcnNameHidden.value || 'Unnamed PCN'}`, margin, yPosition + 10);
        doc.text(`PCN Code: ${pcnCodeInput.value || 'N/A'}`, margin, yPosition + 20);
        doc.text(`Raw List Size: ${rawListSizeInput.value || '0'}`, margin, yPosition + 30);
        doc.text(`Adjusted Population: ${adjustedPopulationInput.value || '0'}`, margin, yPosition + 40);
        doc.text(`London Weighting Applied: ${londonWeightingCheckbox.checked ? 'Yes' : 'No'}`, margin, yPosition + 50);
        yPosition += 60;
        
        // Funding Summary
        yPosition = addSectionTitle('Funding Summary', yPosition);
        doc.setFont(fontBold, 'normal');
        doc.setFontSize(12);
        doc.text(`Maximum ARRS Allocation: ${maxArrsAllocationInput.value || '£0.00'}`, margin, yPosition + 10);
        doc.text(`Total ARRS Funding Claimed: ${totalFundingSpan.textContent || '£0.00'}`, margin, yPosition + 20);
        doc.text(`Remaining/Unused Funding: ${unusedFundingSpan.textContent || '£0.00'}`, margin, yPosition + 30);
        doc.text(`Percentage of Maximum Allocation Used: ${percentageUsedSpan.textContent || '0%'}`, margin, yPosition + 40);
        yPosition += 50;
        
        // Page 3: Role Breakdown
        doc.addPage();
        currentPage++;
        yPosition = margin + 10;
        
        addHeader(currentPage);
        addFooter();
        
        // Role Breakdown
        yPosition = addSectionTitle('Role Breakdown', yPosition);
        
        // Create role breakdown table
        const roleData = selectedRoles.map(role => [
            role.title,
            role.fte.toFixed(1),
            formatCurrency(role.adjustedSalary),
            formatCurrency(role.adjustedSalary * role.onCostsFactor * role.fte),
            formatCurrency(role.totalCost),
            formatCurrency(role.reimbursement)
        ]);
        
        doc.autoTable({
            startY: yPosition + 5,
            head: [['Role', 'FTE', 'Salary Cost', 'On-costs', 'Total Cost', 'Reimbursement']],
            body: roleData,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 9
            },
            margin: { left: margin, right: margin },
            styles: {
                cellPadding: 3,
                overflow: 'linebreak'
            }
        });
        
        yPosition = doc.lastAutoTable.finalY + 10;
        
        // Page 4: Funding Chart
        doc.addPage();
        currentPage++;
        yPosition = margin + 10;
        
        addHeader(currentPage);
        addFooter();
        
        // Funding Chart
        yPosition = addSectionTitle('Funding Distribution', yPosition);
        
        // Add chart image
        try {
            const chartImg = fundingChart.toDataURL('image/png', 1.0);
            const imgWidth = contentWidth;
            const imgHeight = imgWidth * (fundingChart.height / fundingChart.width);
            doc.addImage(chartImg, 'PNG', margin, yPosition + 5, imgWidth, imgHeight);
            yPosition += imgHeight + 15;
        } catch (error) {
            console.error('Error adding chart to PDF:', error);
            doc.setFont(fontRegular, 'normal');
            doc.setFontSize(10);
            doc.text('Chart could not be included in the PDF.', margin, yPosition + 10);
            yPosition += 20;
        }
        
        // Add optimization suggestions
        yPosition = addSectionTitle('Optimization Suggestions', yPosition);
        
        // Get the text content from the optimization suggestions div
        const suggestionsText = optimizationSuggestions.textContent.trim();
        
        // Add the text to the PDF
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(10);
        
        const textLines = doc.splitTextToSize(suggestionsText, contentWidth);
        doc.text(textLines, margin, yPosition + 10);
        
        // Save the PDF
        const fileName = `PCN_ARRS_Funding_Report_${pcnNameHidden.value || 'Unnamed'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
    }
}

/**
 * Export CSV report with comprehensive data
 */
function exportToCsv() {
    if (!validateResults()) {
        return;
    }
    
    try {
        let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF'; // Add UTF-8 BOM
        
        // Helper function to clean and escape CSV values
        const escapeCsv = (value) => {
            let cleanedValue = String(value)
                .replace(/£/g, '') // Remove £ symbol
                .replace(/,/g, '') // Remove commas
                .replace(/"/g, '""') // Escape double quotes
                .replace(/\n/g, ' '); // Replace newlines with spaces
            return `"${cleanedValue}"`;
        };
        
        // PCN Information
        csvContent += 'PCN ARRS Funding Report\n';
        csvContent += `PCN Name,${escapeCsv(pcnNameHidden.value || 'Unnamed PCN')}\n`;
        csvContent += `PCN Code,${escapeCsv(pcnCodeInput.value || 'N/A')}\n`;
        csvContent += `Raw List Size,${escapeCsv(rawListSizeInput.value || '0')}\n`;
        csvContent += `Adjusted Population,${escapeCsv(adjustedPopulationInput.value || '0')}\n`;
        csvContent += `London Weighting Applied,${escapeCsv(londonWeightingCheckbox.checked ? 'Yes' : 'No')}\n`;
        csvContent += `Generated Date,${escapeCsv(new Date().toLocaleDateString('en-GB'))}\n\n`;
        
        // Funding Summary
        csvContent += 'Funding Summary\n';
        csvContent += `Maximum ARRS Allocation,${escapeCsv(maxArrsAllocationInput.value || '£0.00')}\n`;
        csvContent += `Total ARRS Funding Claimed,${escapeCsv(totalFundingSpan.textContent || '£0.00')}\n`;
        csvContent += `Remaining/Unused Funding,${escapeCsv(unusedFundingSpan.textContent || '£0.00')}\n`;
        csvContent += `Percentage of Maximum Allocation Used,${escapeCsv(percentageUsedSpan.textContent || '0%')}\n\n`;
        
        // Role Breakdown
        csvContent += 'Role Breakdown\n';
        csvContent += 'Role,FTE,Salary Cost,On-costs,Total Cost,Reimbursement\n';
        
        selectedRoles.forEach(role => {
            const onCosts = role.adjustedSalary * role.onCostsFactor * role.fte;
            csvContent += [
                escapeCsv(role.title),
                escapeCsv(role.fte.toFixed(1)),
                escapeCsv(formatCurrency(role.adjustedSalary)),
                escapeCsv(formatCurrency(onCosts)),
                escapeCsv(formatCurrency(role.totalCost)),
                escapeCsv(formatCurrency(role.reimbursement))
            ].join(',') + '\n';
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `PCN_ARRS_Funding_Report_${pcnNameHidden.value || 'Unnamed'}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating CSV:', error);
        alert('An error occurred while generating the CSV. Please try again.');
    }
}

function validateResults() {
    if (!totalFundingSpan.textContent || totalFundingSpan.textContent === '£0.00') {
        alert('Please calculate funding first to generate the export.');
        return false;
    }
    
    return true;
}

// Make functions available globally
window.exportToPdf = exportToPdf;
window.exportToCsv = exportToCsv;
