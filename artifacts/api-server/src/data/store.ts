import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const MESSAGES_FILE = join(DATA_DIR, 'messages.json');
const ADMIN_FILE = join(DATA_DIR, 'admin.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

export interface Message {
  id: string;
  author: string;
  content: string;
  color: string;
  isVisible: boolean;
  createdAt: string;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: '1',
    author: '💌 رسالة من مروان نجم',
    content: `إلى أختي وحبيبتي العروسة،
أرقى وأجمل أميرة نجم،

عايزِك بس تكوني متأكدة إنّي والله ما منعني عن الحضور غير العذر القهري، الخارج عن الإرادة المنفردة.
بس أكيد في يوم من الأيام هنتقابل، وهقدر أشرحلك الموقف كامل.
سامحيني يا حبيبتي.

وسلامي لعلاء زوجِك.
أترككم في رعاية الله وحفظه.
ألف مبروك يا أميرة، وربنا يسعدك ويبارك في عمرك.

مع أطيب التمنيات،
مروان نجم`,
    color: '#e8b4a8',
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    author: '💕 تهنئة سارة نجم وحمزة نجم',
    content: `مبروك يا الأميرة عمتو!  
أتمنالك السعادة والتوفيق في كل لحظات حياتك الجاية.
السلام لحين اللقاء يا حبيبة قلبي أنا وحمزة.
أنا بتكلم بلساني وبلسان حمزة علشان هو لسه صغير ومبيعرفش يتكلم.

مروان دايمًا يقولي إني نسخة منك، وأنا بقوله: لأ… هي أجمل كتير بصراحة.
بس لما شفت الفيديوهات والصور حسّيت إن فعلاً ممكن أكون في يوم من الأيام شبهِك، وده أكيد هيكون أكبر ضربة حظ ليا في حياتي… إني أكون حتى في نص جمالك يا الأميرة أميرة.

بحبك أوي يا عمتو،
وحمزة بيقولك: "ها اه اه" — أكيد يقصد إنه بيحبك هو كمان.
مين يشوفك وما يحبكيش يا عمتو؟

(ملحوظة):  
متستغربيش إني بناديه باسمه… إحنا أصحاب.
أنا بقوله "يا بابا" بس لما بيكون زعلان مني، لأننا ساعتها مبنبقاش صحاب.

السلام لحين اللقاء.
باي باي يا الأميرة عمتو أميرة.

بحبك جدًا… وحمزة كمان بيحبك جدًا.`,
    color: '#d4a574',
    isVisible: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ADMIN = {
  password: 'amira2024'
};

export function getMessages(): Message[] {
  try {
    if (existsSync(MESSAGES_FILE)) {
      const data = readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading messages:', error);
  }
  saveMessages(DEFAULT_MESSAGES);
  return DEFAULT_MESSAGES;
}

export function saveMessages(messages: Message[]): void {
  try {
    writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

export function addMessage(message: Message): void {
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
}

export function updateMessage(id: string, updates: Partial<Message>): void {
  const messages = getMessages();
  const idx = messages.findIndex(m => m.id === id);
  if (idx !== -1) {
    messages[idx] = { ...messages[idx], ...updates };
    saveMessages(messages);
  }
}

export function deleteMessage(id: string): void {
  const messages = getMessages();
  saveMessages(messages.filter(m => m.id !== id));
}

export function getAdminPassword(): string {
  try {
    if (existsSync(ADMIN_FILE)) {
      const data = readFileSync(ADMIN_FILE, 'utf-8');
      return JSON.parse(data).password;
    }
  } catch (error) {
    console.error('Error reading admin password:', error);
  }
  saveAdminPassword(DEFAULT_ADMIN.password);
  return DEFAULT_ADMIN.password;
}

export function saveAdminPassword(password: string): void {
  try {
    writeFileSync(ADMIN_FILE, JSON.stringify({ password }, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving admin password:', error);
  }
}
