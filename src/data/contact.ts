/** Options for the "Project Type" field in the contact form. */
export const projectTypes: readonly string[] = [
  'Business management system',
  'HR management system',
  'Recruitment system',
  'Inventory system',
  'Appointment or scheduling system',
  'Administrative dashboard',
  'Website or web application',
  'Something else',
]

/**
 * PLACEHOLDER: the form validates in the browser but is not connected to a
 * backend or email service yet, so the confirmation tells the visitor exactly
 * that instead of implying the message was delivered.
 *
 * Set this to an empty string once submission is wired up (see the TODO in
 * src/sections/contact/ContactForm.tsx) and the notice disappears.
 */
export const formDeliveryNotice = 'This form is not connected to an email service yet.'