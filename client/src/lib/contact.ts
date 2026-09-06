export const WHATSAPP_NUMBER = "27694844629"; // +27 69 484 4629
export const CONTACT_EMAIL = "keegan.launch@gmail.com";
export const INSTAGRAM_HANDLE = "@launch_lifestyle";
export const INSTAGRAM_URL = "https://www.instagram.com/launch_lifestyle";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function enquiryWhatsappLink(serviceName: string): string {
  return whatsappLink(`Hi Keegan! I'd like to enquire about ${serviceName}.`);
}

export function enquiryMailtoLink(serviceName: string): string {
  return mailtoLink(
    `${serviceName} Enquiry`,
    `Hi Keegan,\n\nI'd like to find out more about ${serviceName}.\n\n`
  );
}
