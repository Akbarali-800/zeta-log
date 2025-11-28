export const isBiometricAvailable = async () => {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    return false;
  }
};

export const registerBiometric = async (email) => {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn not supported');
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const userId = new Uint8Array(16);
  crypto.getRandomValues(userId);

  const credentialCreationOptions = {
    challenge,
    rp: {
      name: 'AuthApp',
      id: window.location.hostname,
    },
    user: {
      id: userId,
      name: email,
      displayName: email,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },
      { alg: -257, type: 'public-key' },
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'preferred',
    },
    timeout: 60000,
    attestation: 'direct',
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: credentialCreationOptions,
    });

    if (!credential) {
      throw new Error('Biometric registration cancelled');
    }

    return {
      id: credential.id,
      rawId: Array.from(new Uint8Array(credential.rawId)),
      type: credential.type,
      response: {
        clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
        attestationObject: Array.from(new Uint8Array(credential.response.attestationObject)),
      },
    };
  } catch (error) {
    throw new Error(error.message || 'Biometric registration failed');
  }
};

export const authenticateWithBiometric = async (email) => {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn not supported');
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email);

  if (!user || !user.biometricCredentials) {
    throw new Error('No biometric credentials found for this account');
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const credentialRequestOptions = {
    challenge,
    timeout: 60000,
    userVerification: 'preferred',
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: credentialRequestOptions,
    });

    if (!assertion) {
      throw new Error('Biometric authentication cancelled');
    }

    return {
      id: assertion.id,
      rawId: Array.from(new Uint8Array(assertion.rawId)),
      type: assertion.type,
      response: {
        clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
        authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
        signature: Array.from(new Uint8Array(assertion.response.signature)),
      },
    };
  } catch (error) {
    throw new Error(error.message || 'Biometric authentication failed');
  }
};

export const removeBiometric = (email) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex !== -1) {
    users[userIndex].biometricCredentials = null;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  return false;
};
