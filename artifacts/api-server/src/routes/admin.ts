import { Router, type IRouter, type Request, type Response } from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { z } from "zod";

const router: IRouter = Router();
const DATA_FILE = join(process.cwd(), "app-store.json");

type MessageItem = {
  id: string;
  author: string;
  content: string;
  color: string;
  isVisible: boolean;
  createdAt: string;
};

type AppStore = {
  messages: MessageItem[];
  settings: {
    adminPassword: string;
  };
};

const DEFAULT_STORE: AppStore = {
  messages: [
    {
      id: "1",
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
      id: "2",
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
  ],
  settings: {
    adminPassword: "amira2024"
  }
};

function readStore(): AppStore {
  if (!existsSync(DATA_FILE)) {
    writeStore(DEFAULT_STORE);
    return DEFAULT_STORE;
  }
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, "utf-8")) as AppStore;
    // Ensure settings exist
    if (!data.settings) {
      data.settings = { adminPassword: "amira2024" };
    }
    return data;
  } catch (e) {
    console.error("Error reading store:", e);
    return DEFAULT_STORE;
  }
}

function writeStore(store: AppStore) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing store:", e);
  }
}

// Auth
router.post("/login", (req: Request, res: Response) => {
  const { password } = req.body;
  const store = readStore();
  
  console.log("Login attempt with password:", password);
  console.log("Stored password:", store.settings.adminPassword);
  
  if (store.settings.adminPassword === password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid password" });
  }
});

router.post("/change-password", (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const store = readStore();
  
  if (store.settings.adminPassword === currentPassword) {
    store.settings.adminPassword = newPassword;
    writeStore(store);
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid current password" });
  }
});

// Messages
router.get("/messages", (req: Request, res: Response) => {
  const { all } = req.query;
  const store = readStore();
  let messages = store.messages;
  
  if (all !== "true") {
    messages = messages.filter(m => m.isVisible);
  }
  
  res.json(messages);
});

router.post("/messages", (req: Request, res: Response) => {
  const { author, content, color } = req.body;
  const store = readStore();
  const newMessage: MessageItem = {
    id: randomUUID(),
    author,
    content,
    color,
    isVisible: true,
    createdAt: new Date().toISOString()
  };
  store.messages.push(newMessage);
  writeStore(store);
  res.status(201).json(newMessage);
});

router.patch("/messages/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const store = readStore();
  const idx = store.messages.findIndex(m => m.id === id);
  
  if (idx !== -1) {
    store.messages[idx] = { ...store.messages[idx], ...updates };
    writeStore(store);
    res.json(store.messages[idx]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

router.delete("/messages/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const store = readStore();
  store.messages = store.messages.filter(m => m.id !== id);
  writeStore(store);
  res.status(204).send();
});

export default router;
