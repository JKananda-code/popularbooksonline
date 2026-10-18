// Identity Theft Protection — Kananda Books FINAL MASTER (11 chapters, no gaps)
// Author: Johana Baraka (pen name — same catalog identity as New Canadian Blueprint)
// One-time purchase (paperback): CAD $34.99 / USD $24.99. Digital editions paused pending ISBN.
// Companion volume to "New Canadian Blueprint"

import { NCB_PRICING } from './ncb-content';

export const IDSHIELD_SLUG = 'identity-theft-protection-canada';

export const IDSHIELD_META = {
  slug: IDSHIELD_SLUG,
  title: 'Identity Theft Protection',
  subtitle: "A Newcomer's & Family Guide for Canada",
  author: 'Johana Baraka',
  description:
    "The companion volume to New Canadian Blueprint. A calm, tactical field manual for protecting your SIN, credit, cards, and digital life against the exact scams targeting Canadian newcomers and their families in 2026 — plus a 72-hour recovery playbook, a 30-day family shield plan, and a printable Fridge Poster of the Golden Rule.",
  emoji: '🛡️',
  cover_from: '#0A1931',
  cover_to: '#D32F2F',
  topic: 'Identity theft protection & fraud defence for Canadian newcomers and families',
  style: 'warm elder, protective, tactical — same voice as New Canadian Blueprint',
  audience: "Canadian newcomers and their families (elders, teens, spouses new to the internet)",
  premium: true,
  price_cents: 2700,
  currency: 'cad',
};

export const IDSHIELD_PRICING = NCB_PRICING;

const CH1_CONTENT = `Author: Johana Baraka | Kananda Books | popularbooksonline.ca | Book #2

You built a new life in Canada. You worked hard for your SIN, your PR Card, your first bank account.

This book exists because scammers know that. In Canada, newcomers and families are targeted more than anyone else - not because you did anything wrong, but because you trust the system.

You believe when someone says "This is CRA" or "This is Service Canada." I learned this the hard way. That's why I wrote this.

What this book IS:
- 100% Canadian. CRA, Service Canada, IRCC, Equifax Canada, TransUnion Canada, Canadian Anti-Fraud Centre (CAFC).
- Simple English for newcomers and families.
- Practical: Checklists, scripts, phone numbers, what to say when they call.

What this book is NOT:
- Not legal advice. If you are victim, call CAFC 1-888-495-8501 and local police.
- Not to scare you. To protect you.

How to use:
- Chapters 2-6: Learn and prevent.
- Chapter 7: The 16 Scams - put on fridge.
- Chapter 8: Emotional first aid if it happens.
- Chapter 9: First 72 Hours Checklist.
- Chapter 10: Recovery toolkit with letters.
- Chapter 11: 30-Day Family Protection Plan.

Family Promise: By day 30, your whole family will know the one rule: HANG UP + CALL BACK on official number.

popularbooksonline.ca - Kananda Books Series - Book 2`;

const CH2_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

Scammers in Canada are not random. They buy phone lists by area code and by name. They know which buildings have many newcomers.

Why Newcomers Are Targeted - 5 Reasons:

1. NEW SIN = CLEAN CREDIT - Your credit file is new and clean. Thieves love that. They can open a Rogers phone, a Canadian Tire credit card, an apartment.

2. TRUST IN GOVERNMENT - In many countries, when government calls, you answer and obey. In Canada, scammers fake CRA, IRCC, Service Canada. They say "You will be deported" or "Your SIN is suspended." You panic.

3. LANGUAGE PRESSURE - They speak fast English, use legal words, threaten. You may not catch that it's fake. They say "Don't tell anyone, it's confidential investigation."

4. FAMILY PRESSURE - "Your child will lose status" or "Your mother will be arrested if you don't pay." Newcomers will do anything for family.

5. FIRST TIME TASKS - First tax return, first apartment, first job - you are asked for ID often. You share more. You don't know what's normal yet.

Why Seniors in Family Are Targeted:
- Still answer landline, polite, don't want to be rude and hang up.
- Home alone during day.
- Less comfortable checking email address is fake.
- May have savings.

The 3 Phases of Risk:

Phase 1: ARRIVAL (0-6 months) - Most dangerous. Scams: IRCC deportation call, SIN suspended, fake apartment deposit (ask for e-Transfer before viewing), fake job needing SIN photo by WhatsApp.

Phase 2: SETTLING (6-24 months) - Scams: CRA arrest warrant, bank verification text, credit card activation fee, cheque overpayment for furniture.

Phase 3: ESTABLISHED (2+ years) - Scams: Parcel delivery customs fee, grandparent emergency "Grandma, I'm in jail in Montreal", investment, romance.

Real Numbers: CAFC Canadian Anti-Fraud Centre reported $530M lost in 2023. Average victim lost $2,000-$8,000. Newcomers over-represented.

Exercise - Family Risk Map:
Who in family answers unknown calls?
Who has SIN in phone photos?
Who does e-Transfer?
Who shops on Facebook Marketplace?
Those are your starting points for protection.

Golden Rule: Government of Canada will NEVER threaten arrest by phone, NEVER ask for gift cards or Bitcoin, NEVER ask for SIN by text or email.
If they do, it's 100% scam. Hang up.`;

const CH3_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

Identity Theft in Canada is when someone uses YOUR personal information to pretend to be you to get money, jobs, or benefits.

It's NOT just credit card fraud. There are 4 Types in Canada:

Type 1: FINANCIAL IDENTITY THEFT - Open bank account, credit card, phone plan (Rogers, Bell, Telus, Fido), buy phone on contract in your name. You get the bill.

Type 2: SIN / EMPLOYMENT THEFT - Someone uses your SIN to get a job. Employer reports income to CRA under YOUR SIN. Next year, CRA says you earned $45,000 at a construction company you never worked for. You owe tax.

Type 3: GOVERNMENT BENEFITS THEFT - Someone applies for GST/HST credit, Canada Child Benefit (CCB), Employment Insurance (EI) with your SIN. Money goes to them, problem comes to you.

Type 4: ID DOCUMENT THEFT - Uses your PR Card, Driver's License copy to create fake ID, open accounts.

What Thieves Need: Just 3 pieces: Full Name + Date of Birth + SIN OR Full Address. If you gave all 3 together, you are at high risk.

Example Timeline - How One Text Becomes 6 Months Problem:

Day 1: You get text: "Service Canada: Your SIN has been suspended due to suspicious activity. Verify at servicecanada-secure.ca" You click, enter SIN, DOB, address.

Day 7: Thief opens Fido phone account online with your info. Gets iPhone.

Day 14: Thief applies for Canadian Tire Triangle Mastercard online. Approved for $2,000.

Day 30: You get a bill from Fido for $800. You think it's mistake, ignore.

Day 60: CRA My Account letter: You earned $48,000 at "ABC Construction" - you never worked there. CRA says you owe $4,000 tax.

Day 90: You check credit report - 2 new accounts, score dropped 120 points.

This is why we protect the 3 pieces. Never give them together.

Difference: Scam = The trick (the call). Identity Theft = Stealing your info. Identity Fraud = Using it to get money.

Canada vs US: In US they have SSN. In Canada SIN. Agencies different: We deal with Equifax Canada and TransUnion Canada, not US bureaus. We call CAFC 1-888-495-8501, not FTC. We call Service Canada 1-800-206-7218 for SIN issues.

If you shared SIN + DOB + Address, go immediately to Chapter 9.`;

const CH4_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

Your 5 Most Valuable IDs in Canada - Ranked:

1. SIN LETTER - 9 digits, starts often with 6 or 9 for newcomers. MOST VALUABLE. NEVER carry in wallet. NEVER photo in phone. Store at home in locked place. Service Canada rule: Only give when required by law: new job (payroll), new bank account (interest), CRA taxes. NOT for apartment application, NOT for store points, NOT for gym.

2. PR CARD / WORK PERMIT / STUDY PERMIT - Proof of status. If lost: Report to local police + IRCC via Web Form. Make 2 photocopies: One at home locked, one with trusted family in Canada. Do NOT send photo by WhatsApp, Facebook Messenger, email. If landlord asks for PR Card copy, give blacked-out version or show in person, don't send file.

3. HEALTH CARD - OHIP, AHCIP, MSP, RAMQ, etc. Has name, DOB, address, photo. Thieves use for ID verification at phone stores. Carry only when going to clinic/hospital.

4. DRIVER'S LICENSE - Has address + photo + DOB. If lost, report to province (ServiceOntario, SAAQ, ICBC etc) immediately. Don't leave in car. Don't leave in unlocked bag.

5. BANK CARD + CREDIT CARD - Never share photo of front and back. The CVV 3 digits on back is password.

THE 3-ENVELOPE SYSTEM (From New Canadian Blueprint - use same):

Envelope 1 - HOME SAFE (Fireproof box or locked drawer): Original SIN letter, birth certificate, extra PR Card if you have, citizenship papers.
Envelope 2 - LOCKED FILE: Photocopies of all IDs, both sides.
Envelope 3 - DAILY WALLET: Only ID you need that day. For most days: Driver's License OR Health Card. Not both. Not SIN.

Digital Rules - Write these on fridge:

NEVER: Send SIN by email, text, WhatsApp, Facebook Messenger, Telegram.
NEVER: Store SIN in iPhone Notes, Samsung Notes, Google Drive, Dropbox without encryption.
NEVER: Give SIN + DOB + Address together on same form unless it's CRA My Account, bank official site ending .ca, employer official payroll form, or Canada.ca site.

What to say when someone asks for SIN and they DON'T need it (landlord, store, interview):
Script: "I prefer not to share my SIN for this. Service Canada says it's only required for income reporting. Can we use my Driver's License or another ID instead?"

Practice this with family. It's legal and polite.

Checklist - What to carry today?
Ask: Do I need SIN today? Answer is almost always NO. Leave at home.

If you already sent SIN photo by WhatsApp: Delete from chat, delete from phone, change phone, and go to Chapter 9 to place fraud alert.`;

const CH5_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

In Canada, you have TWO credit files. One at Equifax Canada, one at TransUnion Canada. Banks may check one or both. You need to check both.

When you are new, file is empty. That's okay. It builds slowly in 6-12 months.

HOW TO GET YOUR FREE CREDIT REPORT - CANADA ONLY:

Equifax Canada: Website equifax.ca/personal/credit-report-services/ or call 1-800-465-7166. Free monthly online. Free by mail if you send ID.

TransUnion Canada: Website transunion.ca or call 1-800-663-9980 (TransUnion) and for Quebec 1-877-525-3823. Free.

DO NOT use annualcreditreport.com (US). DO NOT pay $19.99 sites.

Check every 3 months. Look for:
- Accounts you didn't open (Canadian Tire, Capital One, Rogers, Bell)
- Hard inquiries from companies you never applied to
- Address you never lived at
- Employer you never worked for

IF YOU ARE VICTIM: FRAUD ALERT

Canada does NOT have US-style freeze exactly. We have:

1. FRAUD ALERT / FRAUD WARNING / FRAUD ALERT: You call both bureaus. They put note: "Verify ID before giving credit." Free. Lasts 6 years.

How to place:
- Equifax Canada: 1-800-465-7166, say "Fraud Alert"
- TransUnion Canada: 1-800-663-9980

2. CONSUMER STATEMENT: You add 100-word statement: "I am victim of identity theft, please call me at XXX to verify."

BUILDING CREDIT SAFELY AS NEWCOMER:

- Get secured credit card: You give bank $500 deposit, you get $500 limit card. Example: Neo, Capital One Guaranteed Secured, BMO, RBC newcomer program.
- Use for groceries $100/month, pay FULL every month. Never minimum.
- Keep usage under 30%: If limit $1000, keep balance under $300 when statement closes.
- Never give credit card photo to "verify identity" - that's scam.

TWO SCAMS LINKED TO CREDIT:

Interac e-Transfer Fraud: Someone e-Transfers you $2,000 by mistake and asks to send back $1,500 difference. First transfer is from stolen account, will bounce in 5 days. You lose $1,500.

Cheque Fraud (Very common - links to Chapter 7 Scam 13): Someone sends you cheque for more than owed for furniture on Kijiji. Says "Keep $100 for trouble, return rest $900 by e-Transfer." Cheque is fake, takes bank 7-10 days to discover. You owe bank $900 + fees.

30-Day Task: This week, get both credit reports. Save as PDF in secure folder (not phone). Set calendar reminder 90 days to check again.

If you see unknown account: Call bank fraud line on back of card, not number in email, and call both credit bureaus.`;

const CH6_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

Your phone is your ID now. Protect it like your PR Card.

PHONE SAFETY:

iPhone: Settings > Phone > Silence Unknown Callers ON. Settings > Messages > Filter Unknown Senders ON.
Android (Samsung, Pixel): Open Phone app > Settings > Caller ID & Spam > Filter Spam Calls ON.

Rule: If you don't know number, let it go to voicemail. Real CRA, Service Canada will send official letter in My Account or mail, not threaten on voicemail.

NEVER say "YES" to "Can you hear me?" Just hang up. They record your yes to authorize charges.

NEVER press 1, 2, 3 to "speak to agent" or "press 2 to be removed." You confirmed your number is active, they will call more.

QUALITY ASSURANCE MESSAGE TRICK - NEW SCAM (from Chapter 7): Scammers now start call with "This call may be monitored or recorded for quality assurance purposes..." to sound official. That does NOT mean it's real government. Scammers fake it too. Hang up.

EMAIL SAFETY:

Real Government of Canada emails end with:
@cra-arc.gc.ca
@canada.ca
@servicecanada.gc.ca
@ircc.gc.ca

FAKE examples:
cra-support@canada-tax-refund.com = FAKE
servicecanada@service-canada-verification.net = FAKE
noreply@ircc-secure-docs.com = FAKE
info@canada-service-mail.com = FAKE

Check: On computer, hover mouse over sender - don't click. On phone, tap sender name to see full email address.

CRA will never send you a link to get refund by email. CRA refund goes to bank account or cheque.

PASSWORDS:

Use 3-word method for newcomers: Pick 3 random words + symbol + year.
Example: MapleWinterCalgary!2024 or TorontoLibrarySunset!2023

Never use: 123456, password, your birth year, your phone number, your name.

Use different password for bank and email. If you can, use password manager: Bitwarden (free) or 1Password. Write master password on paper at home.

Turn on 2-step verification for Gmail, Outlook, Facebook, bank.

WI-FI:

Never do banking, CRA login, or credit check on public Wi-Fi: Tim Hortons, McDonald's, Starbucks, airport, library, mall.
Use your mobile data (Rogers, Bell, Telus, Fido, Koodo, Freedom) - it's safer.

At home, change router password from admin/admin. Use WPA2.

WHATSAPP FAMILY SCAM - "HI MOM NEW NUMBER":

You get: "Hi Mom, this is my new number, I lost my phone, can you e-Transfer $500 for emergency? Don't call old number."

Rule: Family Password. Ask: "What is our family password?" If they don't know, hang up and call old number by voice.

We set Family Password in Chapter 11 and on Fridge Poster.

FOR KIDS AND ELDERS:

Elders - 3 Rules on Fridge:
1. Don't answer unknown numbers.
2. Hang up if pressured, threatened, or told not to tell family.
3. Call child before paying, e-Transfer, or buying gift cards.

Kids - 3 Rules:
1. Never share parent SIN, passport photo.
2. Never install AnyDesk, TeamViewer, RustDesk when someone calls saying "Your computer has virus."
3. Never open "Your package could not be delivered" text link.

Tonight Task: Change email password, turn on 2-step verification for Gmail/Outlook, and set Silence Unknown Callers ON.`;

const CH7_CONTENT = `If there is one chapter you read twice and share with your family, it is this one.

Scammers follow a simple formula: **Fear + Urgency + Authority.** They pretend to be someone powerful — CRA, Service Canada, IRCC, CBSA, police, your bank — and they tell you that you must act RIGHT NOW or you will lose money, lose status, or be arrested.

In Canada, a real government officer will NEVER do this. The CRA will never ask for payment in gift cards, Bitcoin, or e-Transfer. IRCC will never threaten deportation over the phone for a fee. Service Canada will never suspend your SIN over a phone call. Your bank will never ask for your full card number, CVV, or text code.

Keep this chapter near your phone. When a call feels wrong, check this list.

> ### SPECIAL NOTE FOR NEWCOMERS: "This call may be monitored for quality and training purposes" DOES NOT MEAN IT IS LEGITIMATE
> In Canada, many real companies play that message at the start of a call. Scammers know this. They now play the EXACT same recorded message before their scam, to make you relax and trust them.
> Back home, that message may have meant you were speaking to a real official. In Canada, scammers copy it easily for $0.
> **Rule: That message means NOTHING about whether the call is real. If it is an INCOMING call from an unknown number or organization, you must still do full due diligence. Hang up and call back using the official number from the website or the number on the back of your card.**

### HOW TO USE THIS CHAPTER
For each scam you will find:
**How It Sounds:** What they say.
**Why It Works:** The psychology they use.
**3 Red Flags:** How you know it is fake.
**What To Say:** Exact words to end the call.

---

**SCAM 1: The CRA Arrest Threat**
**How It Sounds:** "This is Officer John from the Canada Revenue Agency. You owe $3,842 in back taxes. If you do not pay today, police will come to your home and you will be arrested. Do not tell anyone."
**Why It Works:** Newcomers respect tax rules and fear trouble with the government.
**3 Red Flags:** 1) CRA never threatens arrest by phone. 2) CRA never asks for gift cards or crypto. 3) Caller ID can be faked to say "CRA".
**What To Say:** "I will check my CRA My Account online and call CRA at 1-800-959-8281 myself. Goodbye." Then hang up.

**SCAM 2: Your SIN Has Been Suspended**
**How It Sounds:** "Your SIN has been compromised and linked to criminal activity. Your SIN is now suspended. Press 1 to speak to Service Canada to fix it."
**Why It Works:** Your SIN feels like your whole identity in Canada.
**3 Red Flags:** 1) Service Canada never suspends your SIN. 2) Real Service Canada does not use automated threats. 3) They ask for your SIN to "verify" — that's how they steal it.
**What To Say:** "Service Canada does not suspend SINs. I am hanging up and I will call 1-800-206-7218 if I need help."

**SCAM 3: CBSA Deportation Scam**
**How It Sounds:** "This is the Canada Border Services Agency. There is a problem with your immigration file. You will be deported tomorrow unless you pay a penalty of $1,950."
**Why It Works:** Your status is everything. Fear is instant.
**3 Red Flags:** 1) CBSA and IRCC communicate by official letter and secure IRCC account, not threatening phone calls. 2) No payment by gift card. 3) They refuse to give you a badge number you can verify.
**What To Say:** "Send me an official letter to my IRCC secure account. I am calling my immigration consultant." Hang up.

**SCAM 4: Fake IRCC Fee / Ghost Consultant**
**How It Sounds:** Email: "Your PR card renewal requires a $500 government fee. E-Transfer to this email within 24 hours or your file will be closed." Or a consultant who says "Give me cash and I guarantee PR."
**Why It Works:** IRCC processes are confusing and slow. You want to be safe.
**3 Red Flags:** 1) All IRCC fees are paid only inside your IRCC portal — never by e-Transfer to a person. 2) No consultant can guarantee PR. 3) No official receipt from canada.ca.
**What To Say:** "I only pay fees inside my official IRCC account. Please give me the receipt from canada.ca."

**SCAM 5: Rental Deposit Scam (Very Common in Calgary, Toronto, Vancouver)**
**How It Sounds:** Kijiji/Facebook Marketplace ad: Beautiful 2-bed for $900. "Many people want it. Send first and last month deposit by e-Transfer to hold it. I am out of town, I will mail the keys."
**Why It Works:** Newcomers need housing urgently and don't know normal prices.
**3 Red Flags:** 1) Price is too low for the area. 2) They will not show the apartment in person or video live. 3) They push for deposit before lease signing.
**What To Say:** "I only pay deposit after viewing inside the unit and signing a lease in person at the unit." Never e-Transfer without keys.

**SCAM 6: Job Guarantee / Payroll Scam**
**How It Sounds:** "Congratulations! You got the warehouse job. We just need your SIN, bank void cheque, and $150 for training and safety shoes before your first day."
**Why It Works:** You need Canadian experience quickly.
**3 Red Flags:** 1) Real employers never charge you to get a job. 2) They ask for banking info before you even meet. 3) Email is @gmail.com, not company domain.
**What To Say:** "I will bring my ID and banking info on my first day to your office. What is your company address?"

**SCAM 7: Bank Account Frozen / Interac e-Transfer Scam**
**How It Sounds:** Text: "RBC: Your account has been locked. Verify now: rbc-secure-login.com" Or you get an e-Transfer of $2,800 you didn't expect, then someone says "Oops, sent to wrong person, please send it back."
**Why It Works:** You trust your bank's name.
**3 Red Flags:** 1) Text link does not end with rbc.com / td.com / etc. 2) Real banks never text you a login link. 3) The "accidental" e-Transfer is from a stolen account — if you send it back, YOU lose the money.
**What To Say:** Do NOT click. Go to your bank app yourself by typing the address. For e-Transfers, call your bank: "I received a suspicious transfer. Do not return it until you investigate."

**SCAM 8: Tech Support — Your Computer Has a Virus**
**How It Sounds:** Pop-up: "Microsoft Security Alert. Your computer is infected. Call 1-800-... immediately or your data will be deleted."
**Why It Works:** Panic about losing files and photos.
**3 Red Flags:** 1) Microsoft never shows a phone number in a virus warning. 2) Real antivirus never locks your screen and asks you to call. 3) They ask for remote access and gift cards.
**What To Say:** Turn off your computer. Do not call the number. Call a local trusted computer store or a family member.

**SCAM 9: Canada Post / Courier Fee Scam**
**How It Sounds:** Text: "Canada Post: Your package could not be delivered. Pay $1.50 customs fee here to reschedule: canadapost-delivery.ca"
**Why It Works:** Newcomers are waiting for PR cards, documents from home.
**3 Red Flags:** 1) Real Canada Post slip is left on your door, not a text with a strange link. 2) Link is not canadapost.ca. 3) $1.50 fee request by text.
**What To Say:** Do not click. Track packages only on the official canadapost.ca site using your tracking number.

**SCAM 10: Social Media Lending / Family Emergency**
**How It Sounds:** Facebook message from a friend you know back home (account is hacked): "Hello, I am stuck in Toronto. Can you e-Transfer me $400? I will pay back tonight."
**Why It Works:** You want to help friends from your community.
**3 Red Flags:** 1) Language is slightly off. 2) They refuse video call. 3) Urgency and secrecy — "Don't tell anyone."
**What To Say:** "I will video call you right now to confirm." Call them by phone, not Facebook.

**SCAM 11: Fake Landlord Wants Your SIN and Credit Card Photo**
**How It Sounds:** "To apply for this rental, send a photo of your SIN card, passport, and credit card front and back."
**Why It Works:** You think this is normal Canadian process.
**3 Red Flags:** 1) No landlord needs your SIN card photo or credit card photo. 2) Credit checks in Canada are done via official forms, not photos. 3) Asking on WhatsApp.
**What To Say:** "I can provide a credit report from Equifax/TransUnion and references. I do not share photos of my SIN or credit card."

**SCAM 12: Romance / Sponsorship Scam**
**How It Sounds:** Someone you met online quickly says "I love you" and then: "I need $1,000 to pay for my medical exam for sponsorship" or "Send money so we can be together in Canada."
**Why It Works:** Loneliness and hope for companionship in a new country.
**3 Red Flags:** 1) Fast declaration of love + request for money. 2) Always an emergency. 3) Refuses to meet in public/video with family present.
**What To Say:** "I never send money to someone I have not met in person with family. Let's meet at a public place."

**SCAM 13: The Cheque Processing Trick — "A cheque of $X is being processed..."**
**How It Sounds:** "Hello, this is your bank's fraud department. A cheque for $2,850 is being processed from your account to [some name]. If you did NOT authorize this, press 1 immediately to speak to security."
**Why It Works:** It creates instant panic. You press 1 to "stop" it, but pressing 1 connects you directly to the scammer who will then ask for your online banking password or verification codes.
**3 Red Flags:** 1) Your real bank will never ask you to press 1 to stop fraud in an automated call. 2) They create a fake large amount to scare you. 3) It is always an unexpected call you did not initiate.
**What To Say:** Do NOT press 1. Do NOT press anything. **Hang up immediately and ignore.** If you are worried, open your banking app yourself or call the number on the back of your card.

**SCAM 14: The Returned Parcel / Address Verification Trick**
**How It Sounds:** "Hello, we have a parcel that was returned, we are calling to verify your address for re-delivery. Can you confirm your full address and date of birth?"
**Why It Works:** Many newcomers are waiting for important documents — PR card, health card, items from home. You want your parcel.
**3 Red Flags:** 1) Canada Post, UPS, FedEx do NOT call to verify your full address and DOB by phone. They leave a delivery notice. 2) They ask for personal details a courier doesn't need. 3) They often ask for a small "re-delivery fee" by credit card.
**What To Say:** "What is my tracking number? I will check on the official website." Then hang up. Track parcels ONLY on canadapost.ca or the official courier site.

**SCAM 15: The Bank Verification Trick — "We need to verify your identity"**
**How It Sounds:** "Hello, this is [Your Bank]. We noticed suspicious activity. To verify your identity, can you please confirm your full card number, expiry date, CVV, and the code we just texted you?"
**Why It Works:** It sounds professional and helpful. You think you are proving YOU are the real customer.
**3 Red Flags:** 1) Your real bank already KNOWS your card number — they will never ask for the full number, CVV, or the text code. 2) They create urgency. 3) The text code they ask for is actually the code to authorize a transaction THEY are making with your card.
**What To Say:** This one is the easiest to beat. **Hang up and call your bank yourself.** Say: "I just got a suspicious call claiming to be you. I hung up. Is my account safe?" Your bank will NEVER be offended. Always use the number on the back of your card.

**SCAM 16: The Professional Opening — Fake Quality Assurance Message**
**How It Sounds:** Call starts with: "This call may be monitored and recorded for quality and training purposes. Please stay on the line..." Then: "This is Service Canada / CRA / your bank..."
**Why It Works:** Newcomers hear that official message and think, "This must be government, this must be real." Scammers use it as a costume to lower your guard.
**3 Red Flags:** 1) Anyone can play that recording — it costs $0 to copy. 2) The call is still an unexpected INCOMING call. 3) They still ask for personal info or payment.
**What To Say:** Remember: That intro message does NOT make a call real. Treat it like any unknown call. Say: "I do not take action on incoming calls. I will call the official number myself." Then hang up.

---

### END OF CHAPTER CHECKLIST — PRINT AND KEEP ON FRIDGE

[ ] I know CRA/CBSA/IRCC never threaten arrest or deportation by phone.
[ ] I never pay government fees by gift card, crypto, or personal e-Transfer.
[ ] I never send SIN, passport, or credit card photos on WhatsApp.
[ ] I verify rental prices and view in person before paying.
[ ] I NEVER press 1 on an incoming fraud call about a cheque — I hang up immediately.
[ ] I never give full address/DOB for a returned parcel by phone — I check tracking on official site.
[ ] I never give full card number, CVV, or text codes to verify identity — Banks don't ask.
[ ] "Quality and training purposes" message does NOT mean the call is legitimate.
[ ] My rule for ALL incoming unknown calls: Hang Up + Call Back on official number from back of card or official website.`;

const CH8_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

If you are reading this right after it happened: Breathe. You are not alone. You are not stupid. Scammers are professional criminals. They do this 100 times per day in call centers. They know exactly what to say to make you panic. Even smart people fall for it.

This chapter is BEFORE the 72-Hour Checklist (Chapter 9). This is the first 2 hours - calm down and tell family.

WHY YOU FEEL THIS WAY:

- Shame: "How did I fall for this? I should have known."
- Fear: "Will I be deported? Will I lose my PR? Will CRA arrest me?"
- Anger: At yourself, at them, at Canada.
- Panic: "What about my family? My bank account? My kids?"

All normal. Scammers create panic on purpose so you don't think. They say "Don't tell anyone, it's confidential." That's to isolate you.

WHAT NOT TO DO IN FIRST 2 HOURS:

1. Do NOT delete texts, emails, call logs, WhatsApp chats. We need them as evidence for CAFC and police.
2. Do NOT call the scammer back to argue or threaten. They will target you more.
3. Do NOT pay more money to "fix" or "refund" or "get your money back" - that's second scam called recovery scam.
4. Do NOT send more ID to "verify you are victim."

WHAT TO DO - CALM DOWN PLAN:

Hour 0-0.5: Stop. Hang up. Turn phone on silent. Put phone in other room. Drink water. Walk. Tell one trusted person: "I think I was scammed. I need help, not judgement. Can you sit with me?"

Hour 0.5-1: Get notebook. Write facts:
- What happened? When? What number called? What email?
- What info did you share? SIN? DOB? Address? Bank card number? Photo of PR Card? Health Card?
- How much money sent? How? e-Transfer to what email? Gift cards? Bitcoin? Cash?
- Screenshots if possible.

Hour 1-2: Tell family using script below. Then start Chapter 9.

SCRIPT TO TELL FAMILY (Simple English):

"I got a call/text that looked real from [CRA/Service Canada/Bank/IRCC]. I was scared. I shared [what you shared: SIN, DOB, address, bank info]. I have stopped and hung up. I need your help to protect our accounts. I have a checklist to follow from popularbooksonline.ca book. Can you help me call the bank and credit bureaus? No blame, just help."

SCRIPT FRENCH VERSION:

"J'ai reçu un appel qui semblait venir de [ARC/Service Canada/Immigration]. J'ai eu peur. J'ai donné [info]. J'ai raccroché. J'ai besoin d'aide pour protéger nos comptes. Pas de reproches, juste de l'aide."

HOW TO SUPPORT ELDERLY PARENT WHO WAS SCAMMED:

- Do NOT say: "How could you do that? I told you!" - They will never tell you again.
- DO say: "These people are criminals. They trick thousands of Canadians every day, even police officers. Thank you for telling me. You are brave. We will fix it together."
- Protect dignity: Let them help with checklist. They call one number, you call another. They write notes.

FAMILY MEETING TONIGHT - 15 MINUTES:

- Set family password (see Chapter 11). Example: Blue Maple 2024
- Decide: Who answers unknown calls? Answer: No one. Let it go to voicemail.
- Where is SIN stored? Move to safe place today.
- Where is Incoming Call Rule poster? Put on fridge.

You did hardest part: You stopped and you are reading this.

Next: Chapter 9 - First 72 Hours Checklist. Start now.

Emergency Contacts:
CAFC: 1-888-495-8501 (Canadian Anti-Fraud Centre)
If you sent money or feel unsafe: Local police non-emergency, then 911 if threatened.
Service Canada SIN: 1-800-206-7218
Equifax: 1-800-465-7166, TransUnion: 1-800-663-9980`;

const CH9_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

If you shared SIN, DOB, Address, bank info, or sent money - do this NOW. Time matters.

Print this or follow on phone. Check off as you go.

HOUR 0-2: STOP AND SECURE

[ ] 1. Hang up, stop talking to scammer. Put phone on Do Not Disturb.
[ ] 2. If you sent money by e-Transfer: Call your bank fraud line immediately (number on back of card). Ask to reverse e-Transfer and freeze account. For Interac, call 1-888-488-9750 as well.
[ ] 3. If you gave banking password: Change it NOW from another device. Turn on 2-step verification.
[ ] 4. If you gave credit card number: Call number on back of card, say "fraud, cancel card."
[ ] 5. If you bought gift cards (Apple, Google Play, Steam, Vanilla) and gave codes: Call gift card company. Apple 1-800-275-2273, Google 1-855-466-4438. Money may be gone but report.
[ ] 6. Take photos/screenshots of texts, emails, numbers, receipts. Don't delete.

HOUR 2-24: REPORT AND PROTECT CREDIT

[ ] 7. Call Canadian Anti-Fraud Centre CAFC: 1-888-495-8501 or antifraudcentre-centreantifraude.ca. Get report number.
[ ] 8. Call Equifax Canada: 1-800-465-7166 - Place Fraud Alert (free, 6 years).
[ ] 9. Call TransUnion Canada: 1-800-663-9980 - Place Fraud Alert.
[ ] 10. If SIN shared: Call Service Canada SIN line: 1-800-206-7218. Ask what to do, monitor CRA My Account.
[ ] 11. Check CRA My Account at canada.ca/my-cra-account - Look for unknown address, benefit applications, T4s you didn't earn.
[ ] 12. File report with local police (non-emergency). Bring notebook. Get police report number. Some banks need it.

HOUR 24-72: CLEAN UP AND DOCUMENT

[ ] 13. If PR Card, Driver's License, Health Card copy shared: Report to IRCC (PR Card), province (Driver's License/Health Card), and note in police report.
[ ] 14. If phone account opened in your name (you got bill from Rogers/Bell/Telus you didn't open): Call that carrier fraud department, say "I am victim of identity theft, account not mine."
[ ] 15. Change passwords: Email first, then bank, then CRA My Account, then everything else. Use 3-word method from Chapter 6.
[ ] 16. Tell your bank, landlord, employer that you are victim so they watch for suspicious requests.
[ ] 17. Start Recovery Log (see Chapter 10) - Date, who you called, reference number, what they said.

IMPORTANT PHONE NUMBERS - CANADA ONLY:

CAFC: 1-888-495-8501
Equifax Canada: 1-800-465-7166
TransUnion Canada: 1-800-663-9980 / 1-877-525-3823
Service Canada SIN: 1-800-206-7218
CRA Individual: 1-800-959-8281
CRA Business: 1-800-959-5525
IRCC: 1-888-242-2100
Local Police: Check city - Toronto 416-808-2222, Calgary 403-266-1234, Vancouver 604-717-3321, Montreal 514-280-2222, Ottawa 613-236-1222

Do NOT pay anyone who calls saying "We can get your money back for fee" - That's recovery scam.

You are doing right thing. Keep going to Chapter 10.`;

const CH10_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

This toolkit saves you time. Copy, fill blanks, send.

TOOL 1: RECOVERY LOG TEMPLATE

Date | Time | Who I Called | Phone Number | Reference/Report # | What They Said | Next Step
2026-08-04 | 10am | TD Fraud | 1-800-... | Report #123 | Cancelled card, new card in 5 days | Check mail
... keep all...

TOOL 2: LETTER TO EQUIFAX / TRANSUNION - FRAUD ALERT REQUEST

Subject: Request for Fraud Alert - Victim of Identity Theft

To: Equifax Canada / TransUnion Canada
My Name: [Full Legal Name]
DOB: [YYYY-MM-DD]
Address: [Current Address]
Phone: [Your Number]
SIN: [Only last 3 digits if you want, or full if you shared]

I am victim of identity theft. On [Date], I shared personal information with scammer pretending to be [CRA/Service Canada/Bank].

Please place Fraud Alert / Fraud Warning on my file. Please confirm in writing.

I have attached: Copy of police report # [number], Copy of CAFC report # [number], Copy of ID (Driver's License).

Thank you.

Signature, Date.

Send by mail + call to confirm.

TOOL 3: LETTER TO BANK / PHONE COMPANY - DISPUTE FRAUDULENT ACCOUNT

To: Fraud Department, [Rogers / Bell / Canadian Tire Bank / etc]

I am victim of identity theft. Account #[XXXX] opened on [Date] is not mine. I did not authorize.

I have placed fraud alert with Equifax and TransUnion. Police report #[], CAFC report #[].

Please close this account, confirm in writing that I owe $0, and correct reporting to credit bureaus.

Attached: ID, police report, CAFC report.

TOOL 4: SCRIPT FOR CALLING BANK FRAUD LINE

"Hello, my name is [Name]. I am calling to report fraud. I am victim of identity theft. On [Date], I [gave information / sent e-Transfer of $X to email]. I have stopped. I need to freeze my account and dispute. My CAFC report number is [ ]. Can you help me?"

Write down: Agent name, reference number, what they promise.

TOOL 5: SCRIPT FOR CALLING CAFC

Call 1-888-495-8501

"Hello, I want to report identity theft and fraud. On [Date], I received [call/text/email] from someone saying they were [CRA etc]. I shared [info] and sent [money]. I have screenshots. Can I get a report number?"

TOOL 6: CHECKLIST FOR CRA MY ACCOUNT

Login at canada.ca/my-cra-account

Check:
[ ] Address correct?
[ ] Phone and email correct?
[ ] Any T4s from employer you never worked for?
[ ] Any GST/HST, CCB applications you didn't make?
[ ] Any CERB/CRA benefit payments you didn't receive?

If wrong: Call CRA 1-800-959-8281 and say "My SIN may be compromised, I need to verify my account."

TOOL 7: FAMILY COMMUNICATION LOG

Who in family knows? What info was shared? Who needs to place fraud alert too? (If you share address, family at same address may be at risk).

Keep all letters for 7 years.

popularbooksonline.ca - Kananda Books - Book #2`;

const CH11_CONTENT = `Author: Johana Baraka | popularbooksonline.ca

This is your final chapter - turning protection into habit. 15 minutes per day.

WEEK 1: SECURE FOUNDATION (Days 1-7)

Day 1: Get 3 envelopes. Move SIN letter to safe envelope at home. Remove from wallet/phone.
Day 2: Get both credit reports (Equifax 1-800-465-7166, TransUnion 1-800-663-9980). Save PDF.
Day 3: Phone safety - Turn on Silence Unknown Callers / Spam Filter. Delete voicemails from scammers.
Day 4: Email safety - Change email password to 3-word method, turn on 2-step verification.
Day 5: Passwords - Change bank and CRA My Account passwords.
Day 6: Wi-Fi - Change home router password if still admin/admin. Stop banking on public Wi-Fi.
Day 7: Family Meeting 15 min - Show Incoming Call Rule Poster. Rule: HANG UP + CALL BACK on official number.

WEEK 2: FAMILY SHIELD (Days 8-14)

Day 8: Set Family Password. Example: Blue Maple 2024. Everyone memorizes. Use when someone calls asking for money.
Day 9: Elder in family - Teach 3 Rules: Don't answer unknown, Hang up if pressured, Call child before paying.
Day 10: Kids - Teach 3 Rules: Never share parent SIN, never install AnyDesk/TeamViewer, never click parcel text link.
Day 11: Print Incoming Call Rule Poster (99-Fridge-Poster.pdf) - Put on fridge and near landline.
Day 12: Practice scam calls - You call family pretending to be CRA, bank, grandchild in jail. Do they hang up?
Day 13: Check CRA My Account - Is address, email correct?
Day 14: Rest day - Review Week.

WEEK 3: CREDIT AND ACCOUNTS (Days 15-21)

Day 15: If victim: Place fraud alerts if not done (Equifax, TransUnion).
Day 16: Bank: Ask bank to add verbal password or extra verification for phone banking.
Day 17: Phone carrier: Add PIN to Rogers/Bell/Telus account so no one can port your number (SIM swap).
Day 18: Social media: Turn on 2-step for Facebook, Instagram, WhatsApp. Scammers hack Facebook to scam friends.
Day 19: Kijiji / Marketplace safety: Never accept cheque overpayment. Only e-Transfer or cash in person at police station.
Day 20: Gift card rule: No government ever asks for gift cards. Teach family.
Day 21: Review Recovery Log if you are victim.

WEEK 4: MAINTAIN (Days 22-30)

Day 22: Shred old documents with SIN, bank info. Don't put in recycling.
Day 23: Check credit report again for changes.
Day 24: Update Family Password if needed.
Day 25: Help one other newcomer family - share poster.
Day 26: Save CAFC 1-888-495-8501 in phone contacts as "FRAUD REPORT CANADA"
Day 27: Save Service Canada SIN line 1-800-206-7218, CRA 1-800-959-8281 in phone.
Day 28: Backup important IDs: Photocopy, lock in envelope, not in phone.
Day 29: Celebrate - You protected your family.
Day 30: Set calendar reminder: Check credit reports every 90 days, change passwords every 6 months.

THE INCOMING CALL RULE - POSTER TEXT (for fridge):

STOP - Did I expect this call from CRA/Bank/Service Canada/IRCC?
DROP - If they threaten, ask for SIN by text, ask for gift cards, say "press 1" - HANG UP IMMEDIATELY.
CALL BACK - Call official number on back of card or from canada.ca. Never call number they gave you.

Quality assurance message does NOT mean it's legit. Scammers fake it.
Cheque press 1 = Hang up immediately.
Parcel return address = Verify on official site, not link in text.
Bank verification text = Hang up, call number on back of card.

Family Password: _________________

Emergency Numbers:
CAFC: 1-888-495-8501
Equifax: 1-800-465-7166
TransUnion: 1-800-663-9980
Service Canada: 1-800-206-7218

You built a new life in Canada. Now you protected it.

Johana Baraka | Kananda Books | popularbooksonline.ca | Book #2 - Identity Theft Protection`;

export const IDSHIELD_CHAPTERS = [
  { title: 'Chapter 1 — Welcome - Why This Book Exists', content: CH1_CONTENT },
  { title: 'Chapter 2 — Why Newcomers and Families Are Targeted in Canada', content: CH2_CONTENT },
  { title: 'Chapter 3 — What Identity Theft Really Is - SIN, Credit, Digital Life', content: CH3_CONTENT },
  { title: 'Chapter 4 — Your Most Valuable IDs in Canada - How to Protect Them', content: CH4_CONTENT },
  { title: 'Chapter 5 — Your Credit in Canada - Equifax Canada and TransUnion Canada', content: CH5_CONTENT },
  { title: 'Chapter 6 — Digital Hygiene - Phone, Email, Passwords, Wi-Fi for Families', content: CH6_CONTENT },
  { title: 'Chapter 7 — SCAMS TARGETING NEWCOMERS — THE TOP 16 IN 2026', content: CH7_CONTENT },
  { title: 'Chapter 8 — If It Happens - Emotional First Aid and Family Communication', content: CH8_CONTENT },
  { title: 'Chapter 9 — First 72 Hours Checklist - What To Do If It Happens', content: CH9_CONTENT },
  { title: 'Chapter 10 — Recovery Toolkit - Letters, Logs, Scripts', content: CH10_CONTENT },
  { title: 'Chapter 11 — 30-Day Family Protection Plan', content: CH11_CONTENT },
];
