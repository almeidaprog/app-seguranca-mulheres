const validateFormat = (email) => {
    if  (!email || typeof email !== 'string') {
    return false;}
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

     return emailRegex.test(email.trim().toLowerCase());
};
const getEmailDomain = (email) => {
     if (!validateFormat(email)) return null;
     return email.split('@')[1].toLowerCase();
}
const allowedDomains = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com']


const isAllowedEmailDomain = (email) => {
  const domain = getEmailDomain(email);
  return allowedDomains.includes(domain);
};

const isValidEmail = (email) => {
    if (!validateFormat(email)){
        return {isValid: false, reason:'Invalid format email.'};
    }
    if (!isAllowedEmailDomain(email)){
        return{isValid:false, reason:'Domain not alowed, use gmail, outlook, etc.'};
    }
    return { isValid: true, reason: 'Valid email' };
}
export default isValidEmail;