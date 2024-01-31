const { ipcMain, BrowserWindow } = require('electron');

ipcMain.handle('update-pie-chart', (event, chartData) => {
    // Logic to print the pie chart
    // Example: Create a new BrowserWindow for printing
    const printWindow = new BrowserWindow({ show: false });
    printWindow.loadURL(`data:text/html,<html><body><div id="chart"></div></body></html>`);

    // Add chart rendering logic in the printWindow
    printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.executeJavaScript(`
            // Your chart rendering logic here using chartData
            // Example: Render the chart inside the 'chart' div
        `).then(() => {
            // Print the window
            printWindow.webContents.print({ silent: true }, (success, errorType) => {
                if (!success) {
                    console.error(`Error printing: ${errorType}`);
                }
                printWindow.close();
            });
        });
    });

    return true;
});
