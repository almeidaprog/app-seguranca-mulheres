import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import {sendEmergencyNotifications, saveToHistory} from '../services/emergencyNotificationService.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonProcess = null;
let isListening = false;

export const startListening = async (req, res, next) => {
  try {
    if (isListening) {
      return res.json({
        success: false,
        message: 'Listening is already active'
      });
    }
    const pythonScript = path.join(__dirname, '../python/listener_simulator.py');
    
    pythonProcess = spawn('python', [pythonScript]);

    isListening = true;

    pythonProcess.stdout.on('data', (data) => {
      try {
        const result = JSON.parse(data.toString().trim());
        handleRiskAnalysis(result, req.session.userId);
      } catch (error) {
        console.log('Error parsing result: ' ,error);
      }
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error('Erro in Python:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      isListening = false;
      pythonProcess = null;
      console.log(`Python process finished with codw: ${code}`);
    });

    pythonProcess.on('error', (error) => {
      console.error('Error running python:', error);
      isListening = false;
      pythonProcess = null;
    });

    res.json({
      success: true,
      message: 'Listening session started successfully'
    });
  } catch (error) {
    next(error);
  }

};

export const stopListening = async (req, res, next) => {
  try {
    if (!isListening || !pythonProcess) {
      return res.json({
        success: false,
        message: 'Listening is not active'
      });
    }

    pythonProcess.kill();
    isListening = false;
    pythonProcess = null;

    res.json({
      success: true,
      message: 'Listening stopped sucefully'
    });

  } catch (error) {
    next(error);
  }
};
const handleRiskAnalysis = async (analysis, userId) => {
  try {
    const { risk_level, spoken_words } = analysis;

    await sendEmergencyNotifications(userId, spoken_words, risk_level);
    await saveToHistory(userId, risk_level, spoken_words);

  } catch (error) {
    error.message = 'Error processing analysis';
    throw error;
  }
};

export const getListeningStatus = async (req, res, next) => {
  try {
    res.json({
      success: true,
      isListening: isListening
    });
  } catch (error) {
    next(error);
  }
};

