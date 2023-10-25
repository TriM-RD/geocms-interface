export type State = {
  name: string;
  email: string;
  firm: string;
  requiresAuth: number;
  clientId: string;
  codeVerifier: string;
  codeChallenge: string;
  nonce: string;
  mapResizeDelegate: () => void;
};

export type Mutations = {
  setClientId(state: State, clientId: string): void;
  setCodeVerifier(state: State, codeVerifier: string): void;
  setCodeChallenge(state: State, codeChallenge: string): void;
  setNonce(state: State, nonce: string): void;
  setFirmName(state: State, name: string): void;
  setMapResizeDelegate(state: State, delegate: () => void): void;
};
