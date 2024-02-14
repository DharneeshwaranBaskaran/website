const { app, BrowserWindow, ipcMain } = require('electron');
const { net } = require('electron');
const XLSX = require('xlsx'); 
const fs = require('fs');
const PDFDocument = require('pdfkit');

app.on('ready', () => {
  let mainWindow;

  const fetchData = (urls, setDataCallbacks) => {
    try {
        const requests = urls.map(url => {
            return new Promise((resolve, reject) => {
                const request = net.request(url);
                request.on('response', response => {
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        resolve(JSON.parse(data));
                    });
                });
                request.on('error', error => {
                    reject(error);
                });
                request.end();
            });
        });
        Promise.all(requests)
            .then(responses => {
                responses.forEach((data, index) => {
                    mainWindow.webContents.send('setData', { index, data });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      contentSecurityPolicy: "script-src 'self';"
    }
  });
  mainWindow.loadURL('http://localhost:3000/start'); 

  ipcMain.on('fetchData', (event, urls) => {
    fetchData(urls);
  });

  ipcMain.on('downloadExcel', (event, sortedData) => {
    const excelData = sortedData.map(({ id,topic, cost, count, stockcount }) => ({
        id,
        topic,
        cost,
        count,
        stockcount,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelFilePath = `${app.getPath('downloads')}/sorted_data.xlsx`;
    XLSX.writeFile(workbook, excelFilePath); 
    
    event.reply('excelDownloaded', excelFilePath);
});

ipcMain.on('handleEdit', (event, { typeo,id, type }) => {
  fetch(`http://localhost:8080/api/edit/${typeo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
      credentials: 'include',
  }).then(response => {
      if (response.ok) {
          mainWindow.webContents.send('editSuccess', { id, type });
      } else {
          mainWindow.webContents.send('editError', { id, type });
      }
  }).catch(error => {
      console.error('Error during edit:', error);
      mainWindow.webContents.send('editError', { id, type });
  });
});
 
ipcMain.on('handleRemove', (event, id, sel) => {
    fetch(`http://localhost:8080/api/delete${sel}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error deleting data: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        mainWindow.webContents.send('removeSuccess', id);
    })
    .catch(error => {
        console.error('Error deleting data:', error);
        mainWindow.webContents.send('removeError', { id, error: error.message });
    });
});

ipcMain.on('handleStock', (event, { id, topic, count }) => {
    fetch(`http://localhost:8080/api/updatestock/${id}/${count}/${topic}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error updating stock count: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        event.reply('stockUpdated', { id, count });
    })
    .catch(error => {
        console.error('Error updating stock count:', error);
        event.reply('stockUpdateError', error.message);
    });
});

ipcMain.on('downloadPDF', (event, sortedData) => {
  const pdfDoc = new PDFDocument();
  const pdfFilePath = `${app.getPath('downloads')}/sorted_data.pdf`;
  const writeStream = fs.createWriteStream(pdfFilePath);

  pdfDoc.pipe(writeStream);
  pdfDoc.fontSize(12).text('Sorted Data', { align: 'center' }).moveDown(0.5);
  const tableHeaders = ['ID', 'Topic', 'Cost', 'Count', 'Stock Count'];
  const tableRows = [];
  sortedData.forEach(({ id, topic, cost, count, stockcount }) => {
      tableRows.push([id, topic, cost, count, stockcount]);
  });
  pdfDoc.font('Helvetica-Bold').text(tableHeaders.join(' | '), { align: 'center' }).moveDown(0.5);
  pdfDoc.font('Helvetica').text(tableRows.map(row => row.join(' | ')).join('\n'), { align: 'center' });
  pdfDoc.end();

  writeStream.on('finish', () => {
      event.reply('pdfDownloaded', pdfFilePath);
  });

  writeStream.on('error', (err) => {
      console.error('Error writing PDF:', err);
      event.reply('pdfDownloadError', err.message);
  });
});

ipcMain.on('handleEditStatus', (event, { id, status }) => {
    fetch(`http://localhost:8080/api/updatestatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ id, status }),
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        event.reply('editStatusSuccess');
      } else if (response.status === 409) {
        return response.json();
      } else {
        throw new Error('Registration Failed');
      }
    })
    .then(errorData => {
      event.reply('editStatusError', errorData.error);
    })
    .catch(error => {
      console.error('Error updating status:', error);
      event.reply('editStatusError', 'Error updating status');
    });
  });

});
