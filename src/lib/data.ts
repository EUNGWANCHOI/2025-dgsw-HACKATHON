import type { Content, User } from './types';
import { MOCK_CONTENTS, MOCK_USER } from './mock-data';

// Simulate a database query
export async function getContents(): Promise<Content[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return MOCK_CONTENTS;
}

export async function getContentById(id: string): Promise<Content | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return MOCK_CONTENTS.find(c => c.id === id);
}

export async function getUser(name: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (name === MOCK_USER.name) {
        return MOCK_USER;
    }
    const author = MOCK_CONTENTS.find(c => c.author.name === name)?.author;
    return author;
}

export async function getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USER;
}

export async function getUserContents(userName: string): Promise<Content[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CONTENTS.filter(c => c.author.name === userName);
}

export function addContent(content: Content) {
  MOCK_CONTENTS.unshift(content);
}
