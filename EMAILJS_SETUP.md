# EmailJS Setup Guide

This guide will help you set up EmailJS to enable email functionality in your contact form.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your chosen provider
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

```
Subject: New Contact Form Submission from {{from_name}}

Hello Jack,

You have received a new message from your portfolio contact form:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}
Query Type: {{query_type}}

Message:
{{message}}

---
This message was sent from your portfolio website.
Reply directly to this email to respond to {{from_name}}.
```

4. Note down your **Template ID**

## Step 4: Get Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** in the API Keys section

## Step 5: Configure Environment Variables

Create a `.env` file in your project root with:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Step 6: Test the Setup

1. Start your development server: `npm start`
2. Navigate to the contact form
3. Fill out and submit the form
4. Check your email for the message

## Troubleshooting

- Make sure all environment variables are correctly set
- Verify your EmailJS service is active
- Check that your email template has all the required variables
- Ensure your email provider allows third-party access

## Security Notes

- Never commit your `.env` file to version control
- The public key is safe to use in client-side code
- Consider rate limiting for production use
