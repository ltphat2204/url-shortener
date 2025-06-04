// Danh sách tài khoản mock
const defaultUsers = [
  {
    id: 1,
    username: 'pat',
    email: 'pat@gmail.com',
    password: '123456',
    name: 'PAT'
  },
  {
    id: 2,
    username: 'alice',
    email: 'alice@example.com',
    password: 'alicepass',
    name: 'Alice'
  }
];

function loadUsers() {
  const usersStr = localStorage.getItem('mockUsers');
  if (usersStr) {
    try {
      return JSON.parse(usersStr);
    } catch {
      return [...defaultUsers];
    }
  }
  return [...defaultUsers];
}

export let mockUsers = loadUsers();

export function addMockUser(user) {
  user.id = mockUsers.length ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1;
  mockUsers.push(user);
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
}

export function resetMockUsers() {
  mockUsers = [...defaultUsers];
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
}
