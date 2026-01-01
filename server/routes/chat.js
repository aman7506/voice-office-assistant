// chat.js - Office Assistant Chatbot API
//
// Required environment variables:
//   OPENAI_API_KEY   - Your OpenAI API key (for GPT responses)
//   DB_SERVER        - SQL Server host (optional, defaults to localhost)
//   DB_NAME          - Database name (optional, defaults to VoiceOfficeAssistant)
//
// Make sure to set these in your environment or a .env file.

const express = require('express');
const OpenAI = require('openai');
const router = express.Router();
const { getConnection } = require('../config/database');
const sql = require('mssql');
const stringSimilarity = require('string-similarity');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// System prompt for office assistant
const systemPrompt = `You are a helpful office assistant chatbot. You can help with:
- Scheduling meetings and appointments
- Setting reminders and deadlines
- Managing to-do lists
- Providing daily briefings
- Answering general office questions

Keep responses concise and professional. When users ask to schedule something or set reminders, ask for specific details like date, time, and description.`;

// Enhanced fallback responses with Q&A
const qaPairs = [
  // General Office Assistant Q&A
  { question: "What is your name", answer: "I'm your Voice Office Assistant, here to help you with office and hospital tasks!", keywords: ["name", "who are you", "assistant name", "chatbot name"] },
  { question: "What can you do", answer: "I can help you manage tasks, set reminders, schedule calendar events, answer hospital and office-related questions, and provide information about hospital services.", keywords: ["features", "capabilities", "help", "what can you do", "services", "abilities"] },
  { question: "How do I create a task", answer: "Just tell me the task title and details, or say 'Create a task: [task details]'.", keywords: ["add task", "new task", "create task", "task creation", "task add"] },
  { question: "How do I set a reminder", answer: "You can say 'Set a reminder for [reminder details] at [time]'.", keywords: ["add reminder", "set reminder", "remind me", "reminder creation", "reminder add"] },
  { question: "How do I schedule a meeting", answer: "Say 'Schedule a meeting with [person] on [date] at [time]' or use the Calendar tab.", keywords: ["add meeting", "schedule meeting", "meeting setup", "meeting calendar", "book meeting"] },
  { question: "How do I get help", answer: "Just type or say 'help' and I'll show you what I can do!", keywords: ["help", "support", "assistance", "how to use", "usage"] },
  { question: "How do I logout", answer: "To logout, go to the settings screen and tap 'Logout'.", keywords: ["logout", "sign out", "log out", "exit account"] },
  { question: "How do I update my profile", answer: "Go to the settings screen and tap 'Edit Profile' to update your information.", keywords: ["edit profile", "update profile", "change profile", "profile update"] },
  { question: "How do I enable dark mode", answer: "You can enable dark mode in the settings screen under 'Appearance'.", keywords: ["dark mode", "night mode", "theme", "appearance"] },
  { question: "How do I change notification settings", answer: "Notification settings can be changed in the settings screen under 'Notifications'.", keywords: ["notification", "alerts", "change notification", "notification settings"] },
  { question: "How do I use voice commands", answer: "Tap the microphone icon and speak your command, such as 'Set a reminder for 3 PM'.", keywords: ["voice command", "microphone", "speak", "voice input", "voice assistant"] },
  { question: "What features do you support", answer: "I support task management, reminders, calendar events, daily briefings, and general office and hospital questions.", keywords: ["features", "capabilities", "what can you do", "abilities", "functions"] },
  { question: "How do I get a daily briefing", answer: "Just say 'Give me a daily briefing' and I'll summarize your schedule and tasks for today.", keywords: ["daily briefing", "today's schedule", "summary", "briefing"] },
  { question: "How do I backup my data", answer: "Data backup options are available in the settings screen under 'Backup & Restore'.", keywords: ["backup", "save data", "data backup", "restore data"] },
  { question: "How do I restore my data", answer: "Go to settings, select 'Backup & Restore', and choose 'Restore' to recover your data.", keywords: ["restore", "recover data", "data restore", "backup restore"] },
  { question: "How do I change the app language", answer: "Language settings can be changed in the settings screen under 'Language'.", keywords: ["language", "change language", "app language", "set language"] },

  // --- Hospital/EWS/TPA/Patient Rights ---
  { question: "What is EWS?", answer: "EWS stands for Economically Weaker Section. Free medical treatment is provided to patients whose income is less than Rs. 8,554 per month, on production of a BPL card or income proof certificate.", keywords: ["EWS", "economically weaker section", "BPL card", "income proof", "free medical treatment"] },
  { question: "How many EWS beds are available?", answer: "Out of 130 beds, 13 beds are allotted for free treatment for EWS category patients. For current EWS bed status, please contact the hospital administration.", keywords: ["EWS beds", "free treatment", "EWS category", "hospital administration"] },
  { question: "Who is the EWS Nodal Officer?", answer: "The EWS Nodal Officer is Dr. Archana Dhar. Email: dms@actioncancerhospital.com, Phone: 8376904111.", keywords: ["EWS nodal officer", "Dr. Archana Dhar", "dms@actioncancerhospital.com", "8376904111"] },
  { question: "Who are the EWS monitoring committee members?", answer: "The EWS monitoring committee includes Dr. Subodh Kumar Sharma (Chairman), Dr. R. N. Das, Sh. Ashok Agarwal, Medical Superintendent or representative, and Dr. Archana Atreja.", keywords: ["EWS monitoring committee", "Dr. Subodh Kumar Sharma", "Dr. R. N. Das", "Sh. Ashok Agarwal", "Medical Superintendent", "Dr. Archana Atreja"] },

  { question: "What is TPA?", answer: "TPA stands for Third Party Administrator. TPAs are intermediaries between insurance companies, policy holders, and hospitals, helping process cashless insurance claims.", keywords: ["TPA", "third party administrator", "cashless insurance", "insurance claims"] },
  { question: "How do I avail cashless treatment?", answer: "To avail cashless treatment, submit your TPA card/policy copy, ID proof, in-door case paper, and relevant diagnostic reports to the hospital's corporate desk. Pre-authorization from TPA is required.", keywords: ["cashless treatment", "TPA card", "policy copy", "ID proof", "in-door case paper", "diagnostic reports", "corporate desk", "pre-authorization"] },
  { question: "Where is the corporate desk located?", answer: "The Action Cancer Hospital Corporate Desk is in the atrium near the main gate, ground floor. It is open from 8 AM to 7 PM every day.", keywords: ["corporate desk", "atrium", "main gate", "ground floor", "8 AM to 7 PM"] },
  { question: "What documents are needed for TPA cashless claim?", answer: "You need your TPA card or policy copy, ID proof, in-door case paper, and relevant diagnostic reports.", keywords: ["TPA card", "policy copy", "ID proof", "in-door case paper", "diagnostic reports"] },
  { question: "What should I do if my cashless claim is rejected?", answer: "If your cashless claim is rejected by TPA, you must pay the bill to the hospital and claim reimbursement from your insurance company or TPA later.", keywords: ["cashless claim rejected", "TPA rejection", "pay bill", "claim reimbursement"] },
  { question: "What are the dos and don'ts for TPA cashless services?", answer: "Do: Obtain pre-authorization 3-4 days before admission, fill the form with your doctor, check approval status, leave all original documents at discharge. Don't: Insist on cashless without approval, carry back original documents, or forget to sign the claim form.", keywords: ["TPA cashless services", "dos", "don'ts", "pre-authorization", "admission", "discharge", "claim form"] },

  // --- Appointments, Billing, and Refunds ---
  { question: "How do I book an appointment?", answer: "You can book an appointment online at www.actioncancerhospital.com or at the hospital. Registration charges apply for new patients.", keywords: ["book appointment", "online booking", "www.actioncancerhospital.com", "registration charges"] },
  { question: "How do I cancel or reschedule my appointment?", answer: "To cancel or reschedule, call the hospital at least 2 hours before your appointment time. Refunds are processed as per hospital policy.", keywords: ["cancel appointment", "reschedule appointment", "call hospital", "appointment time", "refunds"] },
  { question: "How do I get a refund for a cancelled appointment?", answer: "For refunds, contact the Tele-coordinator at achcollection@actioncancerhospital.com or call 9711255099. Refunds are processed within 7-10 working days.", keywords: ["refund cancelled appointment", "Tele-coordinator", "achcollection@actioncancerhospital.com", "9711255099"] },
  { question: "What payment methods are accepted?", answer: "We accept Visa, MasterCard, Maestro, Amex, select debit cards, and net banking for online payments.", keywords: ["payment methods", "Visa", "MasterCard", "Maestro", "Amex", "debit cards", "net banking"] },
  { question: "What is the refund policy for teleconsultation?", answer: "If cancellation is requested before consultation or due to doctor unavailability, 100% of the consultation fee will be refunded. For more details, contact the billing department.", keywords: ["refund policy", "teleconsultation", "cancellation", "consultation fee"] },

  // --- Patient Rights & Responsibilities ---
  { question: "What are my rights as a patient?", answer: "You have the right to be treated with respect and dignity, to privacy and confidentiality, to clear explanations, to participate in your care, and to access your health records.", keywords: ["patient rights", "respect", "dignity", "privacy", "confidentiality", "explanations", "participation", "health records"] },
  { question: "What are my responsibilities as a patient?", answer: "You are responsible for providing accurate information, following the treatment plan, paying bills promptly, and being considerate of other patients and staff.", keywords: ["patient responsibilities", "accurate information", "treatment plan", "bills", "consideration"] },
  { question: "How do I access my health records?", answer: "You can request access to your health records from the hospital administration, and your information will be kept confidential.", keywords: ["access health records", "hospital administration", "confidentiality"] },

  // --- Medical Procedures & Hospital Services ---
  { question: "What medical specialties are available?", answer: "The hospital offers specialties such as Oncology, Surgery, Radiology, Pathology, Cardiology, and more. For a full list, visit the hospital website or contact the helpdesk.", keywords: ["medical specialties", "Oncology", "Surgery", "Radiology", "Pathology", "Cardiology", "hospital services"] },
  { question: "How do I get information about a specific department?", answer: "You can ask about any department (e.g., Oncology, Cardiology) or contact the hospital helpdesk for details.", keywords: ["get information", "specific department", "Oncology", "Cardiology", "helpdesk"] },
  { question: "How do I prepare for surgery?", answer: "Follow your doctor's instructions, do not eat or drink before surgery as advised, and bring all necessary documents and reports.", keywords: ["prepare for surgery", "doctor's instructions", "eat/drink before surgery", "necessary documents", "reports"] },
  { question: "How do I get my test results?", answer: "Test results are available from the respective department or can be accessed online via the patient portal.", keywords: ["test results", "respective department", "patient portal"] },
  { question: "How do I request a second opinion?", answer: "You have the right to request a second opinion. Inform your doctor or the hospital administration if you wish to do so.", keywords: ["request second opinion", "doctor", "hospital administration"] },
  { question: "How do I get information about visiting hours?", answer: "Visiting hours are posted at the hospital entrance and on the website. Please check or ask the helpdesk for current timings.", keywords: ["visiting hours", "hospital entrance", "helpdesk"] },
  { question: "How do I get information about hospital facilities?", answer: "The hospital provides facilities such as pharmacy, cafeteria, ambulance, and parking. For more, ask the helpdesk or visit the website.", keywords: ["hospital facilities", "pharmacy", "cafeteria", "ambulance", "parking"] },

  // --- Staff & Internal Office Use ---
  { question: "How do I request leave as staff?", answer: "Staff can request leave through the HR portal or by contacting the HR department.", keywords: ["request leave", "HR portal", "HR department"] },
  { question: "How do I report a maintenance issue?", answer: "Report maintenance issues to the administration office or via the internal helpdesk system.", keywords: ["report maintenance issue", "administration office", "internal helpdesk"] },
  { question: "How do I access staff policies?", answer: "Staff policies are available in the HR department or on the hospital's internal portal.", keywords: ["access staff policies", "HR department", "internal portal"] },
  { question: "How do I contact HR?", answer: "Contact HR by emailing hr@actioncancerhospital.com or visiting the HR office.", keywords: ["contact HR", "email hr@actioncancerhospital.com", "visit HR office"] },
  { question: "How do I get my salary slip?", answer: "Salary slips are available from the accounts department or via the HR portal.", keywords: ["get salary slip", "accounts department", "HR portal"] },
  { question: "How do I update my contact information as staff?", answer: "Update your contact information through the HR portal or by notifying the HR department.", keywords: ["update contact information", "HR portal", "HR department"] },
  { question: "How do I request official documents?", answer: "Request official documents (experience letter, NOC, etc.) from the HR or administration office.", keywords: ["request official documents", "experience letter", "NOC"] },

  // --- General Hospital Info & Policies ---
  { question: "What is the hospital's privacy policy?", answer: "Action Cancer Hospital is committed to maintaining the confidentiality of your medical information. For details, visit our website or contact ach@actioncancerhospital.com.", keywords: ["privacy policy", "confidentiality", "medical information", "website", "ach@actioncancerhospital.com"] },
  { question: "How do I report a problem or give feedback?", answer: "You can report problems or give feedback by emailing ach@actioncancerhospital.com or contacting the hospital administration.", keywords: ["report problem", "give feedback", "email ach@actioncancerhospital.com", "hospital administration"] },
  { question: "What are the hospital's terms and conditions?", answer: "By using our website or services, you agree to our terms and conditions. For details, visit www.actioncancerhospital.com.", keywords: ["terms and conditions", "website", "services", "terms", "www.actioncancerhospital.com"] },
  { question: "How do I contact the EWS Nodal Officer?", answer: "Contact Dr. Archana Dhar at dms@actioncancerhospital.com or call 8376904111.", keywords: ["contact EWS nodal officer", "Dr. Archana Dhar", "dms@actioncancerhospital.com", "8376904111"] },
  { question: "How do I contact the hospital for emergencies?", answer: "For emergencies, call the hospital's main number or visit the emergency department directly.", keywords: ["emergency contact", "hospital main number", "emergency department"] },
  { question: "How do I get information about EWS bed status?", answer: "Contact the hospital administration or EWS Nodal Officer for the latest EWS bed status.", keywords: ["EWS bed status", "hospital administration", "EWS nodal officer"] },
  { question: "How do I get information about insurance claims?", answer: "Contact the corporate desk or your TPA for information about insurance claims and cashless services.", keywords: ["insurance claims", "cashless services", "corporate desk", "TPA"] },
  { question: "How do I get information about patient rights?", answer: "Ask the hospital administration or visit the hospital website for a full list of patient rights and responsibilities.", keywords: ["patient rights", "hospital administration", "website"] },
  { question: "How do I get information about refund and cancellation?", answer: "For refund and cancellation policies, contact the billing department or visit the hospital website.", keywords: ["refund policy", "cancellation policy", "billing department", "website"] },

  // --- Department-Specific Q&A for Multispeciality & Cancer Hospital ---
  // Oncology
  { question: "What is oncology?", answer: "Oncology is the branch of medicine that deals with the prevention, diagnosis, and treatment of cancer.", keywords: ["cancer", "oncology", "tumor", "chemotherapy", "radiation", "cancer care"] },
  { question: "How do I book a cancer screening?", answer: "You can book a cancer screening by contacting the Oncology department or through the hospital's appointment desk.", keywords: ["book cancer screening", "Oncology department", "appointment desk"] },
  { question: "What cancer treatments are available?", answer: "We offer chemotherapy, radiation therapy, surgery, immunotherapy, and targeted therapy. Your oncologist will recommend the best treatment plan.", keywords: ["cancer treatments", "chemotherapy", "radiation therapy", "surgery", "immunotherapy", "targeted therapy", "treatment plan"] },
  { question: "How do I get a second opinion for cancer treatment?", answer: "You can request a second opinion from another oncologist in our hospital. Please contact the Oncology department for assistance.", keywords: ["second opinion", "oncologist", "Oncology department"] },
  { question: "Are support groups available for cancer patients?", answer: "Yes, we have support groups and counseling services for cancer patients and their families. Please ask your care coordinator for details.", keywords: ["support groups", "counseling services", "cancer patients", "care coordinator"] },
  // Cardiology
  { question: "What is cardiology?", answer: "Cardiology is the branch of medicine dealing with disorders of the heart and blood vessels.", keywords: ["cardiology", "heart", "blood vessels", "heart attack", "angina", "hypertension", "arrhythmia"] },
  { question: "How do I book a heart checkup?", answer: "You can book a heart checkup by contacting the Cardiology department or through the hospital's appointment desk.", keywords: ["book heart checkup", "Cardiology department", "appointment desk"] },
  { question: "What are the symptoms of a heart attack?", answer: "Common symptoms include chest pain, shortness of breath, sweating, and pain radiating to the arm or jaw. Seek emergency care if you experience these.", keywords: ["heart attack symptoms", "chest pain", "shortness of breath", "sweating", "arm pain", "jaw pain"] },
  { question: "What cardiac procedures are available?", answer: "We offer ECG, echocardiography, angiography, angioplasty, and cardiac surgery. Please consult a cardiologist for more information.", keywords: ["cardiac procedures", "ECG", "echocardiography", "angiography", "angioplasty", "cardiac surgery"] },
  // Neurology
  { question: "What is neurology?", answer: "Neurology is the branch of medicine dealing with disorders of the nervous system, including the brain, spinal cord, and nerves.", keywords: ["neurology", "nervous system", "brain", "spinal cord", "nerves", "seizures", "numbness", "weakness", "memory loss", "difficulty speaking", "difficulty walking"] },
  { question: "How do I book a neurology consultation?", answer: "Contact the Neurology department or use the hospital's appointment system to book a consultation.", keywords: ["book neurology consultation", "Neurology department", "appointment system"] },
  { question: "What are common neurological symptoms?", answer: "Symptoms include headaches, seizures, numbness, weakness, memory loss, and difficulty speaking or walking.", keywords: ["neurological symptoms", "headaches", "seizures", "numbness", "weakness", "memory loss", "difficulty speaking", "difficulty walking"] },
  // Orthopedics
  { question: "What is orthopedics?", answer: "Orthopedics is the branch of medicine dealing with bones, joints, ligaments, and muscles.", keywords: ["orthopedics", "bones", "joints", "ligaments", "muscles", "fractures", "joint replacements", "arthritis"] },
  { question: "How do I book a bone or joint checkup?", answer: "Contact the Orthopedics department or use the hospital's appointment system.", keywords: ["book bone/joint checkup", "Orthopedics department", "appointment system"] },
  { question: "What orthopedic surgeries are performed?", answer: "We perform joint replacements, fracture repairs, arthroscopy, and spine surgeries.", keywords: ["orthopedic surgeries", "joint replacements", "fracture repairs", "arthroscopy", "spine surgeries"] },
  // Gastroenterology
  { question: "What is gastroenterology?", answer: "Gastroenterology deals with disorders of the digestive system, including the stomach, intestines, liver, and pancreas.", keywords: ["gastroenterology", "digestive system", "stomach", "intestines", "liver", "pancreas", "gastritis", "ulcer", "constipation", "diarrhea", "heartburn"] },
  { question: "How do I book a gastroenterology appointment?", answer: "Contact the Gastroenterology department or use the hospital's appointment system.", keywords: ["book gastroenterology appointment", "Gastroenterology department", "appointment system"] },
  { question: "What are common digestive symptoms?", answer: "Symptoms include abdominal pain, bloating, constipation, diarrhea, and heartburn.", keywords: ["digestive symptoms", "abdominal pain", "bloating", "constipation", "diarrhea", "heartburn"] },
  // Nephrology
  { question: "What is nephrology?", answer: "Nephrology is the branch of medicine that deals with kidney health and diseases.", keywords: ["nephrology", "kidney", "kidney health", "kidney diseases", "dialysis", "urinary tract infections"] },
  { question: "How do I book a kidney checkup?", answer: "Contact the Nephrology department or use the hospital's appointment system.", keywords: ["book kidney checkup", "Nephrology department", "appointment system"] },
  { question: "Is dialysis available?", answer: "Yes, we provide dialysis services. Please contact the Nephrology department for scheduling.", keywords: ["dialysis services", "schedule dialysis"] },
  // Pulmonology
  { question: "What is pulmonology?", answer: "Pulmonology is the branch of medicine dealing with diseases of the lungs and respiratory system.", keywords: ["pulmonology", "lungs", "respiratory system", "pneumonia", "asthma", "COPD", "bronchitis"] },
  { question: "How do I book a lung function test?", answer: "Contact the Pulmonology department or use the hospital's appointment system.", keywords: ["book lung function test", "Pulmonology department", "appointment system"] },
  { question: "What are common respiratory symptoms?", answer: "Symptoms include cough, shortness of breath, wheezing, and chest pain.", keywords: ["respiratory symptoms", "cough", "shortness of breath", "wheezing", "chest pain"] },
  // Pediatrics
  { question: "What is pediatrics?", answer: "Pediatrics is the branch of medicine dealing with the health and medical care of infants, children, and adolescents.", keywords: ["pediatrics", "children", "adolescents", "infant care", "child health", "adolescent health"] },
  { question: "How do I book a pediatric appointment?", answer: "Contact the Pediatrics department or use the hospital's appointment system.", keywords: ["book pediatric appointment", "Pediatrics department", "appointment system"] },
  { question: "Are vaccination services available?", answer: "Yes, we provide all routine and special vaccinations for children.", keywords: ["vaccination services", "routine vaccinations", "special vaccinations"] },
  // Gynecology & Obstetrics
  { question: "What is gynecology?", answer: "Gynecology deals with the health of the female reproductive system.", keywords: ["gynecology", "female reproductive system", "pregnancy", "delivery", "prenatal", "postnatal"] },
  { question: "How do I book a gynecology appointment?", answer: "Contact the Gynecology department or use the hospital's appointment system.", keywords: ["book gynecology appointment", "Gynecology department", "appointment system"] },
  { question: "Are maternity services available?", answer: "Yes, we offer comprehensive maternity care, including prenatal, delivery, and postnatal services.", keywords: ["maternity services", "prenatal care", "delivery", "postnatal care"] },
  // ENT
  { question: "What is ENT?", answer: "ENT stands for Ear, Nose, and Throat. The ENT department treats disorders related to these areas.", keywords: ["ENT", "ear", "nose", "throat", "hearing loss", "sore throat", "sinusitis"] },
  { question: "How do I book an ENT appointment?", answer: "Contact the ENT department or use the hospital's appointment system.", keywords: ["book ENT appointment", "ENT department", "appointment system"] },
  // Dermatology
  { question: "What is dermatology?", answer: "Dermatology is the branch of medicine dealing with skin, hair, and nail disorders.", keywords: ["dermatology", "skin", "hair", "nails", "acne", "eczema", "psoriasis"] },
  { question: "How do I book a dermatology appointment?", answer: "Contact the Dermatology department or use the hospital's appointment system.", keywords: ["book dermatology appointment", "Dermatology department", "appointment system"] },
  // Radiology & Imaging
  { question: "What is radiology?", answer: "Radiology is the branch of medicine that uses imaging techniques like X-rays, CT scans, and MRI to diagnose diseases.", keywords: ["radiology", "imaging", "X-rays", "CT scans", "MRI", "diagnosis"] },
  { question: "How do I book an X-ray or scan?", answer: "Contact the Radiology department or use the hospital's appointment system.", keywords: ["book X-ray/scan", "Radiology department", "appointment system"] },
  // Pathology & Lab
  { question: "How do I book a blood test?", answer: "Contact the Pathology/Lab department or use the hospital's appointment system.", keywords: ["book blood test", "Pathology/Lab department", "appointment system"] },
  { question: "How do I get my lab reports?", answer: "Lab reports can be collected from the Pathology department or accessed online via the patient portal.", keywords: ["lab reports", "pathology reports", "patient portal"] },
  // Billing & Insurance
  { question: "How do I get a cost estimate for treatment?", answer: "You can request a cost estimate from the billing department or your treating doctor.", keywords: ["cost estimate", "treatment cost", "billing department"] },
  { question: "How do I pay my hospital bill?", answer: "Bills can be paid at the billing counter or online through the hospital website.", keywords: ["pay hospital bill", "billing counter", "online payment"] },
  { question: "How do I claim insurance for my treatment?", answer: "Contact the corporate desk or TPA office for insurance claim processing and required documents.", keywords: ["insurance claim", "TPA office", "corporate desk"] },
  // General/Other
  { question: "How do I find a doctor?", answer: "You can search for doctors by specialty on the hospital website or ask at the helpdesk.", keywords: ["find doctor", "search doctors", "helpdesk"] },
  { question: "How do I get directions to the hospital?", answer: "Directions are available on the hospital website or by calling the main reception.", keywords: ["get directions", "hospital address", "main reception"] },
  { question: "What are the hospital's visiting hours?", answer: "Visiting hours are posted at the hospital entrance and on the website. Please check or ask the helpdesk for current timings.", keywords: ["visiting hours", "hospital entrance", "helpdesk"] },
  { question: "How do I contact the emergency department?", answer: "For emergencies, call the hospital's main number or visit the emergency department directly.", keywords: ["emergency department", "hospital main number"] },
];

// Enhanced fallback response logic with keyword support
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  // Fuzzy match against known Q&A pairs
  let bestMatch = { rating: 0, answer: null };
  for (const qa of qaPairs) {
    const rating = stringSimilarity.compareTwoStrings(lowerMessage, qa.question.toLowerCase());
    if (rating > bestMatch.rating) {
      bestMatch = { rating, answer: qa.answer };
    }
  }
  if (bestMatch.rating > 0.5) {
    return bestMatch.answer;
  }
  // Keyword match
  for (const qa of qaPairs) {
    if (qa.keywords && qa.keywords.some(kw => lowerMessage.includes(kw.toLowerCase()))) {
      return qa.answer;
    }
  }
  // Heuristic responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your office assistant. I can help you with tasks, reminders, calendar events, and more. What would you like to do today?";
  }
  if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new')) {
      return "I'd be happy to help you create a task! Please provide the task title and any additional details like priority or due date.";
    }
    return "I can help you manage tasks. You can create new tasks, view existing ones, or mark them as complete. What would you like to do?";
  }
  if (lowerMessage.includes('reminder') || lowerMessage.includes('remind')) {
    if (lowerMessage.includes('set') || lowerMessage.includes('create') || lowerMessage.includes('add')) {
      return "I can help you set a reminder! Please tell me what you want to be reminded about and when (date and time).";
    }
    return "I can help you manage reminders. You can set new reminders, view existing ones, or delete them. What would you like to do?";
  }
  if (lowerMessage.includes('calendar') || lowerMessage.includes('meeting') || lowerMessage.includes('schedule')) {
    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('schedule')) {
      return "I can help you schedule a meeting or calendar event! Please provide the event title, date, and time.";
    }
    return "I can help you manage your calendar. You can view events, create new ones, or check your schedule. What would you like to do?";
  }
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I'm your office assistant! I can help you with:\n• Creating and managing tasks\n• Setting reminders\n• Scheduling calendar events\n• Answering questions\n• Providing daily briefings\n\nJust let me know what you need!";
  }
  if (lowerMessage.includes('thank')) {
    return "You're welcome! I'm here to help make your workday more productive. Is there anything else you need assistance with?";
  }
  // Default fallback
  return "I understand you're asking about something. I can help you with tasks, reminders, calendar events, and general office assistance. Could you please be more specific about what you'd like me to help you with?";
};

// GET /api/chat/history - Get conversation history (from DB if available)
router.get('/history', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    let dbConnected = false;
    try {
        const pool = await getConnection();
        dbConnected = pool && pool.connected;
    } catch (e) {
        dbConnected = false;
    }

    if (!dbConnected) {
        res.json([]);
        return;
    }

    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT TOP 50 message, response, timestamp
        FROM Conversations
        ORDER BY timestamp DESC
      `);
      res.json(result.recordset);
  } catch (error) {
    console.error('Get Conversation History Error:', error);
    res.json([]);
  }
});

// POST /api/chat - Send message to chatbot
router.post('/', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    const { message, conversationHistory = [], userId = null } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    let response;
    // Try OpenAI first if available
    if (openai) {
      try {
        // Prepare conversation context
        const messages = [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ];
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
        });
        response = completion.choices[0].message.content;
      } catch (openaiError) {
        console.log('OpenAI API error, using fallback response:', openaiError.message);
        response = getFallbackResponse(message);
      }
    } else {
      // Use fallback response if OpenAI is not available
      response = getFallbackResponse(message);
    }

    // Save conversation to database if userId is provided and database is connected
    let dbConnected = false;
    try {
      const pool = await getConnection();
      dbConnected = pool && pool.connected;
    } catch (e) {
      dbConnected = false;
    }
    if (userId && dbConnected) {
      try {
        const pool = await getConnection();
        await pool.request()
          .input('userId', sql.Int, userId)
          .input('message', sql.NVarChar, message)
          .input('response', sql.NVarChar, response)
          .query(`
            INSERT INTO Conversations (user_id, message, response, timestamp)
            VALUES (@userId, @message, @response, GETDATE())
          `);
      } catch (dbError) {
        console.error('Failed to save conversation to database:', dbError);
        // Continue even if database save fails
      }
    }

    res.json({
      response,
      timestamp: new Date().toISOString(),
      source: openai ? 'openai' : 'fallback'
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      response: getFallbackResponse(req.body?.message || 'Hello')
    });
  }
});

module.exports = router;