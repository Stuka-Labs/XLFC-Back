export interface Team {
  id: string;
  teamId: string;
  name: string;
  description: string;
  coachId: string;
  players: string[];
}

export interface Player {
  id: string;
  playerId: string;
  name: string;
  teamId: string;
}

export interface DocumentData {
  id: string;
  [key: string]: unknown;
}

export interface DocumentSnapshot<T> {
  data: () => T;
  id: string;
  [key: string]: unknown;
}

export interface User {
    uid: string; // Unique identifier for the user (Firebase Auth UID)
    email: string; // User's email address
    password: string;
    confirmPassword: string;
    phoneNumber: string; // User's phone number
    displayName: string; // User's full name or display name
    firstName?: string; // Optional: User's first name
    surName?: string; // Optional: User's surname/last name
    photoURL?: string; // Optional: URL of the user's profile picture
    active?: boolean; // Optional: Whether the user is currently active
    role?: string; // Optional: Role of the user (e.g., admin, player, coach)
  }
