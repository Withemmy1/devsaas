import zxcvbn from 'zxcvbn';

export const validatePassword = (password) => {
  const result = zxcvbn(password);
  
  if (result.score < 3) {
    return {
      isValid: false,
      message: 'Password is too weak. Please use a stronger password.'
    };
  }

  return {
    isValid: true,
    message: 'Password is strong enough'
  };
};