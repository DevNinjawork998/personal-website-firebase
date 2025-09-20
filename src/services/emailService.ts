import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID: string | undefined = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_hwqll8d";
const EMAILJS_TEMPLATE_ID: string | undefined = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_c5rhw4u";
const EMAILJS_PUBLIC_KEY: string | undefined = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "ySL3BCd11PVoaUDpM";

// Check if EmailJS is properly configured
const isEmailJSConfigured = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;

// Initialize EmailJS only if configured
if (isEmailJSConfigured) {
    emailjs.init(EMAILJS_PUBLIC_KEY!);
}

export interface ContactFormData {
    firstName: string;
    lastName?: string;
    email: string;
    queryType: string;
    message: string;
    phone?: string;
    company?: string;
}

export interface EmailResponse {
    success: boolean;
    message: string;
}

class EmailService {
    /**
     * Send contact form email using EmailJS
     */
    async sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
        try {
            // Validate required fields
            if (!formData.firstName || !formData.email || !formData.message) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Check if EmailJS is configured
            if (!isEmailJSConfigured) {
                return this.fallbackEmailMethod(formData);
            }

            // Prepare template parameters
            const templateParams = {
                from_name: formData.firstName + (formData.lastName ? ` ${formData.lastName}` : ''),
                from_email: formData.email,
                message: formData.message,
                query_type: formData.queryType,
                phone: formData.phone || 'Not provided',
                company: formData.company || 'Not provided',
                to_name: 'Jack Ooi',
                reply_to: formData.email,
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID!,
                EMAILJS_TEMPLATE_ID!,
                templateParams,
                EMAILJS_PUBLIC_KEY!
            );

            if (response.status === 200) {
                return {
                    success: true,
                    message: `Thank you ${formData.firstName}! Your message has been sent successfully. I'll get back to you within 24 hours.`
                };
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Email sending error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
            };
        }
    }

    /**
     * Fallback method when EmailJS is not configured
     */
    private fallbackEmailMethod(formData: ContactFormData): EmailResponse {
        // Create a mailto link with the form data
        const subject = encodeURIComponent(`Contact Form: ${formData.queryType || 'General Inquiry'}`);
        const body = encodeURIComponent(`
Name: ${formData.firstName} ${formData.lastName || ''}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Query Type: ${formData.queryType || 'Not specified'}

Message:
${formData.message}
        `);

        const mailtoLink = `mailto:thooi998@gmail.com?subject=${subject}&body=${body}`;

        // Try multiple methods to open the email client
        try {
            // Method 1: Direct window.location (most reliable)
            window.location.href = mailtoLink;
        } catch (error) {
            console.warn('Method 1 failed, trying method 2:', error);
            try {
                // Method 2: Create and click a link
                const link = document.createElement('a');
                link.href = mailtoLink;
                link.target = '_self';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error2) {
                console.warn('Method 2 failed, trying method 3:', error2);
                try {
                    // Method 3: Use window.open
                    window.open(mailtoLink, '_self');
                } catch (error3) {
                    console.warn('All methods failed, copying to clipboard:', error3);
                    // Final fallback: copy the email content to clipboard
                    this.copyToClipboard(formData);
                }
            }
        }

        return {
            success: true,
            message: `Thank you ${formData.firstName}! Your email client should open with a pre-filled message. If it doesn't open, please email me directly at thooi998@gmail.com with the details you entered.`
        };
    }

    /**
     * Copy contact information to clipboard as fallback
     */
    private copyToClipboard(formData: ContactFormData): void {
        const emailContent = `
Contact Form Submission:

Name: ${formData.firstName} ${formData.lastName || ''}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Query Type: ${formData.queryType || 'Not specified'}

Message:
${formData.message}

---
Please send this information to: thooi998@gmail.com
        `.trim();

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(emailContent).then(() => {
                // Show a temporary notification
                this.showClipboardNotification();
            }).catch((err) => {
                console.error('Clipboard API failed:', err);
                this.fallbackCopyToClipboard(emailContent);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(emailContent);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    private fallbackCopyToClipboard(text: string): void {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showClipboardNotification();
            } else {
                console.error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Could not copy to clipboard:', err);
        }
        document.body.removeChild(textArea);
    }

    /**
     * Show a temporary notification that content was copied
     */
    private showClipboardNotification(): void {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.textContent = 'Email content copied to clipboard! Paste it into your email client.';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Send a test email (for development)
     */
    async sendTestEmail(): Promise<EmailResponse> {
        const testData: ContactFormData = {
            firstName: 'Test User',
            email: 'test@example.com',
            queryType: 'other',
            message: 'This is a test message from the contact form.'
        };

        return this.sendContactEmail(testData);
    }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
