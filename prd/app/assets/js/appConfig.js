const filterConsoleErrors = () => {
    const consoleError = console.error;

    if(window && window.console) {
        window.console.error = (...args) => {
            if(typeof args[0] === 'string') {
                if(args[0].indexOf('React Intl') > -1) {
                    return;
                }
                if(args[0].indexOf('Warning') > -1) {
                    return;
                }

                consoleError(args[0]);
                return;
            }

            consoleError(...args);
        };
    }
};

filterConsoleErrors();
    const BASE = 'https://administrator.lifetek.vn:201';
    const UPLOAD_APP = 'https://administrator.lifetek.vn:203/api';
    const CLIENT= "2090App"
    const APP = 'https://administrator.lifetek.vn:290';
    const DYNAMIC_FORM = 'https://administrator.lifetek.vn:209';
    const AUTOMATION= 'https://administrator.lifetek.vn:208';
    const PROPERTIES_APP= 'https://administrator.lifetek.vn:207/api';
    const APPROVE = 'https://administrator.lifetek.vn:202';
    const UPLOAD_AI ='https://g.lifetek.vn:225/face_services';
    const ALLOW_FILE_EXT = ['.pdf', '.txt', '.docx', '.doc', '.xls', '.xlsx', '.csv', '.jpeg', '.jpg', '.png', '.mp4'];
    const APP_REPORT = 'https://administrator.lifetek.vn:290';
    const versionNo = 1;
    const dev = true;
    const URL_FACE_API = 'https://g.lifetek.vn:7978';
const API_SMART_FORM = 'https://g.lifetek.vn:3001';
const URL_MEETING = 'https://meeting.lifetek.vn:448';
const SPEECH2TEXT = 'https://g.lifetek.vn:227';
    //administrator
    
