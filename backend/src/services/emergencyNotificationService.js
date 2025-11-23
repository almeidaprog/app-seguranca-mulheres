import EmergencyContact from '../models/emergencyContactModel.js';
import RiskHistory from '../models/riskHistory.js';
import User from '../models/userModel.js';

export const sendEmergencyNotifications = async (userId, spokenWords, risk_level) => {
  try {

    const contacts = await EmergencyContact.find({
      user: userId,
      'notifications.emergencyAlerts': true 
    }).populate('appUser', 'name email phoneNumber');
    const user = await User.findById(userId);
    const userName = user.name;

    const message = createEmergencyNotification(risk_level, spokenWords, userName);
  
    for (const contact of contacts) {
 
      await sendNotificationToContact(contact, message);
    }

  } catch (error) {
    throw new Error('Error sending notifications'); 
  }
};
const createEmergencyNotification = (riskLevel, spokenWords, userName) => {

  const riskMessages = {
    // eslint-disable-next-line quotes
    high: `Situacão de risco detectada com ${userName}`,
    critical: `Situacão de crítica detectada com ${userName}`,
  };

  return {
    title: riskMessages[riskLevel] || 'Alerta de segurança',
    message: `Palavras detectadas: "${spokenWords}"`,
    riskLevel: riskLevel,
    timestamp: new Date().toISOString()
  };
};
const sendNotificationToContact = async (contact, message) => {
  try {

    if (contact.contactType === 'app_user' && contact.appUser) {
    

      await sendPushNotification(contact.appUser, message);
    } else if (contact.contactType === 'external') {
     
      await sendSMS(contact.externalContact.phoneNumber, message);
    }
  } catch (error) {
    console.error(`Erro ao notificar contato ${contact._id}:`, error);
  }
};
export const saveToHistory = async (userId, riskLevel, spokenWords) => {
  try {
    await RiskHistory.create({
      user: userId,
      riskLevel: riskLevel,
      spokenWords: spokenWords,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
};
const sendPushNotification = async (user, message) => {

  console.log(`[SIMULAÇÃO] Push para ${user.name}: ${message.title}`);
  return { success: true, simulated: true };
};

const sendSMS = async (phoneNumber, message) => {
  console.log(`[SIMULAÇÃO] SMS para ${phoneNumber}: ${message.title}`);
  return { success: true, simulated: true };
};
