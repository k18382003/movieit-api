/**
 *
 *
 * @param {JSON} requestBody The data from client side
 * @param {Array} requiredField The required fields for the form
 * If lack of property return {checkCode: 1, field: field}, property is empty return { checkCode: 2, field: field }, valid data return { checkCode: 0, field: 'Valid' }
 */

const ValidatingFields = (requestBody, requiredField) => {
  // Validating the feilds
  for (var i in requiredField) {
    if (typeof requestBody[requiredField[i]] != String) {
      requestBody[requiredField[i]] = String(requestBody[requiredField[i]]);
    }
    // Checking all required field
    if (!requestBody.hasOwnProperty(requiredField[i])) {
      return { checkCode: 1, field: requiredField[i] };
    }
    // Checking empty values
    else if (!requestBody[requiredField[i]].trim()) {
      return { checkCode: 2, field: requiredField[i] };
    }
  }
  return { checkCode: 0, field: 'Valid' };
};

/**
 *
 * @param {string} email
 * @returns
 * Checking if it's valid email
 */
const isEmail = (email) => {
  if (email.indexOf('@') === -1) {
    return false;
  }
  return true;
};

/**
 * @param {string} phone
 * @returns
 * Checking if it is a valid phone number, if it is returns formated phone number as +1 (221) 336-3556, if it's not return null;
 */
const isPhoneAndReturnFormattedPhone = (phone) => {
  var cleaned = phone.replace(/\ |\(|\)|-/g, '');
  if (cleaned[0] === '+' && cleaned.length < 12) return;
  cleaned = cleaned.replace('+', '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ?? '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  } else {
    return;
  }
};

module.exports = {
  ValidatingFields,
  isEmail,
  isPhoneAndReturnFormattedPhone,
};
