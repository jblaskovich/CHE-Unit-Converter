const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//listen for app to be ready
app.on('ready', function() {
    //create new window
    mainWindow = new BrowserWindow({
        width: 960,
        height: 720,
        title: "CHE Tools"

    });

    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'landing.html'),
        protocol: 'file:',
        slashes: true
    }));

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);
});


// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Quit',
                click(){
                    app.quit();
                }
            }
        ]
    }
];