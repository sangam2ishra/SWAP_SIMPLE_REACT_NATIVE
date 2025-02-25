import { exec } from 'child_process';

export const restartServer = (req, res) => {
  console.log("Attempting to restart server");

  
  res.status(200).json({ success: true, message: 'Server will restart shortly' });

  // Delay the restart to ensure the response is sent
  setTimeout(() => {
    exec('pm2 restart ecosystem.config.cjs --only index', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error restarting server: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }, 1000); // 1 second delay
};
