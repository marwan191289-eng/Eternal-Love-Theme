// In-memory store for Vercel compatibility (no file system)
// This will reset on each deployment, but provides working defaults

export interface Message {
  id: string;
  author: string;
  content: string;
  color: string;
  isVisible: boolean;
  createdAt: string;
}

interface Store {
  messages: Message[];
  adminPassword: string;
}

const DEFAULT_STORE: Store = {
  adminPassword: 'amira2024',
  messages: [
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
  ]
};

// In-memory store (will reset on deployment)
let store: Store = JSON.parse(JSON.stringify(DEFAULT_STORE));

export function getStore(): Store {
  return store;
}

export function getMessages(): Message[] {
  return store.messages;
}

export function saveMessages(messages: Message[]): void {
  store.messages = messages;
  console.log('[MemoryStore] Messages updated:', messages.length);
}

export function addMessage(message: Message): void {
  store.messages.push(message);
  console.log('[MemoryStore] Message added:', message.id);
}

export function updateMessage(id: string, updates: Partial<Message>): void {
  const idx = store.messages.findIndex(m => m.id === id);
  if (idx !== -1) {
    store.messages[idx] = { ...store.messages[idx], ...updates };
    console.log('[MemoryStore] Message updated:', id);
  }
}

export function deleteMessage(id: string): void {
  store.messages = store.messages.filter(m => m.id !== id);
  console.log('[MemoryStore] Message deleted:', id);
}

export function getAdminPassword(): string {
  return store.adminPassword;
}

export function setAdminPassword(password: string): void {
  store.adminPassword = password;
  console.log('[MemoryStore] Admin password updated');
}

export function resetStore(): void {
  store = JSON.parse(JSON.stringify(DEFAULT_STORE));
  console.log('[MemoryStore] Store reset to defaults');
}
