import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ContactForm } from '@/lib/types';

const CONTACT_COLLECTION = 'contacts';
const MAIL_COLLECTION = 'mail'; // For Firebase Extension - Trigger Email from Firestore

export async function submitContactForm(
  formData: Omit<ContactForm, 'timestamp'>
): Promise<string> {
  // Save contact submission to database
  const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
    ...formData,
    timestamp: Timestamp.now(),
  });

  // Trigger email notification
  // This document will be processed by the Firebase Extension
  await addDoc(collection(db, MAIL_COLLECTION), {
    to: 'edge.t.xyz@gmail.com',
    message: {
      subject: `Portfolio Contact Form: ${formData.name}`,
      text: `
New contact form submission:

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

---
Submitted at: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #00ffff; border: 2px solid #00ffff;">
          <h2 style="color: #00ffff; text-transform: uppercase; letter-spacing: 2px;">New Contact Form Submission</h2>
          <div style="background-color: #1a1a1a; padding: 15px; border-left: 4px solid #39ff14; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong style="color: #00ffff;">Name:</strong> <span style="color: #ffffff;">${formData.name}</span></p>
            <p style="margin: 5px 0;"><strong style="color: #00ffff;">Email:</strong> <span style="color: #ffffff;">${formData.email}</span></p>
          </div>
          <h3 style="color: #39ff14; margin-top: 20px;">Message:</h3>
          <div style="background-color: #1a1a1a; padding: 15px; border: 1px solid #333333;">
            <p style="color: #b3b3b3; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #333333; margin: 20px 0;">
          <p style="color: #666666; font-size: 12px; text-align: center;">Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
  });

  return docRef.id;
}