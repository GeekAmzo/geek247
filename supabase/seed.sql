-- Seed data for services, legal documents

-- Services: Core service offerings
INSERT INTO services (slug, title, short_description, long_description, features_included, features_not_included, faqs, pricing_zar_min_cents, pricing_zar_max_cents, pricing_usd_min_cents, pricing_usd_max_cents, billing_interval, is_active, sort_order)
VALUES
(
  'ai-process-automation',
  'AI Process Automation',
  'Design and implementation of AI-powered workflows to eliminate manual work, reduce errors, and improve speed across your entire operation.',
  'We design and implement intelligent automation systems that transform how your business operates. From sales pipeline automation to document processing, our AI-powered workflows eliminate repetitive manual tasks, reduce human error, and dramatically improve processing speed. Every automation is custom-built for your specific workflows and integrates seamlessly with your existing tools.',
  '[{"text":"Sales process automation","included":true},{"text":"Customer support triage & routing","included":true},{"text":"Internal reporting & analytics","included":true},{"text":"Finance & administrative automation","included":true},{"text":"Document processing & data entry","included":true},{"text":"Ongoing optimization & monitoring","included":true}]',
  '[{"text":"Hardware procurement","included":false},{"text":"Physical office setup","included":false}]',
  '[{"question":"How long does implementation take?","answer":"Most automation projects are delivered within 2-4 weeks from kickoff, depending on complexity."},{"question":"Do I need technical knowledge?","answer":"No. We handle all the technical work and provide training for your team."},{"question":"Can automations integrate with my existing tools?","answer":"Yes. We integrate with CRMs, ERPs, email systems, accounting software, and custom APIs."}]',
  1500000, 5000000, 82500, 275000, 'monthly', true, 1
),
(
  'business-systems-infrastructure',
  'Business Systems & Infrastructure',
  'Architecture, optimization, and oversight of business-critical systems to ensure reliability, security, and scalability as you grow.',
  'Your business depends on reliable, secure, and scalable systems. We architect, deploy, and maintain the infrastructure that powers your operations—from cloud servers and networking to security and disaster recovery. Our proactive monitoring and management ensures your systems stay performant and protected.',
  '[{"text":"Cloud & server architecture","included":true},{"text":"Network design & security","included":true},{"text":"System monitoring & reliability","included":true},{"text":"Scalability planning & optimization","included":true},{"text":"Disaster recovery & backup","included":true},{"text":"24/7 proactive monitoring","included":true}]',
  '[{"text":"Physical hardware installation","included":false},{"text":"On-site support visits","included":false}]',
  '[{"question":"What cloud providers do you support?","answer":"We work with AWS, Azure, Google Cloud, DigitalOcean, and Hetzner—whatever fits your needs and budget."},{"question":"Is my data secure?","answer":"We implement industry-standard security practices including encryption, access controls, and regular audits."},{"question":"What happens if something goes down?","answer":"Our monitoring systems detect issues before they impact your business. We have incident response procedures and disaster recovery plans in place."}]',
  1000000, 3500000, 55000, 192500, 'monthly', true, 2
),
(
  'custom-software-integrations',
  'Custom Software & Integrations',
  'Custom-built software and system integrations perfectly aligned to your unique business workflows and requirements.',
  'Off-the-shelf software doesn''t always fit. We build custom internal tools, dashboards, API integrations, and data pipelines that are perfectly aligned to your business processes. From connecting disparate systems to building entirely new applications, we deliver software that works exactly how you need it to.',
  '[{"text":"Internal tools & dashboards","included":true},{"text":"API integrations & connectors","included":true},{"text":"Data pipelines & ETL","included":true},{"text":"Automation backends","included":true},{"text":"Custom business applications","included":true},{"text":"Documentation & training","included":true}]',
  '[{"text":"Graphic design / branding","included":false},{"text":"Content creation","included":false}]',
  '[{"question":"What technologies do you use?","answer":"We use modern, battle-tested technologies including React, Node.js, Python, PostgreSQL, and cloud-native services."},{"question":"Do I own the code?","answer":"Yes. All custom software we build is owned by you. We provide full source code and documentation."},{"question":"Can you maintain software after delivery?","answer":"Absolutely. We offer ongoing maintenance and support packages to keep your software running smoothly."}]',
  2000000, 7500000, 110000, 412500, 'monthly', true, 3
),
(
  'rpa-bots',
  'Individual RPA Bots',
  'Pre-built automation bots that can be customized for your specific needs. Deploy in days, not months.',
  'Choose from our library of pre-built RPA bots designed for common business processes. Each bot can be customized to fit your specific workflows and integrates with your existing systems. Available bots include Lead Qualification, Invoice Processing, Customer Support Triage, Report Generation, Data Entry, and Email Automation.',
  '[{"text":"Lead Qualification Bot","included":true},{"text":"Invoice Processing Bot","included":true},{"text":"Customer Support Triage Bot","included":true},{"text":"Report Generation Bot","included":true},{"text":"Data Entry Bot","included":true},{"text":"Email Automation Bot","included":true},{"text":"Custom bot configuration","included":true},{"text":"Integration with existing tools","included":true}]',
  '[{"text":"Custom bot development from scratch","included":false},{"text":"Unlimited bot customizations","included":false}]',
  '[{"question":"How quickly can a bot be deployed?","answer":"Pre-built bots can be configured and deployed within 3-5 business days."},{"question":"Can I use multiple bots?","answer":"Yes. Many clients use several bots together for end-to-end process automation."},{"question":"What if I need a custom bot?","answer":"We can build bespoke bots for unique workflows. Contact us to discuss your requirements."}]',
  500000, 1000000, 27500, 55000, 'monthly', true, 4
),
(
  'quick-wins-package',
  'Quick Wins Package',
  'A focused engagement designed to deliver immediate value and prove ROI before committing to ongoing partnership.',
  'Not ready for a full retainer? Start with our Quick Wins Package. We identify your top 3 automation opportunities, build and deploy one fully functional automation, provide a complete ROI analysis, train your team, integrate with your existing tools, and include 30 days of support. Perfect for businesses wanting to test the waters with automation.',
  '[{"text":"Identify top 3 automation opportunities","included":true},{"text":"One fully functional automation deployed","included":true},{"text":"ROI analysis and documentation","included":true},{"text":"Training session for your team","included":true},{"text":"Integration with existing tools","included":true},{"text":"30-day support included","included":true}]',
  '[{"text":"Ongoing maintenance after 30 days","included":false},{"text":"Multiple automation deployments","included":false}]',
  '[{"question":"What''s the typical timeline?","answer":"2-3 weeks from kickoff to deployment, including discovery session, implementation, and handover."},{"question":"What happens after the 30-day support period?","answer":"You can continue with a monthly retainer or manage the automation independently with the documentation we provide."},{"question":"Is this suitable for my business?","answer":"The Quick Wins Package is ideal for any business looking to explore automation without a long-term commitment."}]',
  2000000, NULL, 110000, NULL, 'once_off', true, 5
);

-- Legal Documents: Initial ToS and SLA
INSERT INTO legal_documents (type, title, content, version, is_active)
VALUES
(
  'tos',
  'Terms of Service',
  '1. ACCEPTANCE OF TERMS

By accessing or using the services provided by Geek247 - H44S (Pty) Ltd ("we", "us", "our"), you agree to be bound by these Terms of Service.

2. SERVICES

We provide AI-powered automation, business systems management, custom software development, and related technology services as described on our website and in individual service agreements.

3. ACCOUNTS

When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.

4. PAYMENT

Subscription fees are billed in advance on a monthly basis. All payments are processed securely through Paystack. Prices are listed in South African Rand (ZAR) and US Dollars (USD). You agree to pay all fees associated with your selected service plan.

5. CANCELLATION

You may cancel your subscription at any time through the customer portal. Cancellation takes effect at the end of your current billing period. No refunds are provided for partial months.

6. INTELLECTUAL PROPERTY

All custom software, automations, and deliverables created specifically for you are owned by you upon full payment. Our pre-existing tools, frameworks, and methodologies remain our intellectual property.

7. CONFIDENTIALITY

We maintain strict confidentiality of your business data and information. We will not share your data with third parties except as required to deliver our services or as required by law.

8. LIMITATION OF LIABILITY

Our liability is limited to the amount paid for services in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages.

9. MODIFICATIONS

We may update these terms from time to time. Material changes will be communicated via email. Continued use of our services after changes constitutes acceptance.

10. GOVERNING LAW

These terms are governed by the laws of the Republic of South Africa. Any disputes will be resolved in the courts of South Africa.

11. CONTACT

For questions about these terms, contact us at amrish@geek247.co.za.',
  '1.0',
  true
),
(
  'sla',
  'Service Level Agreement',
  '1. SERVICE AVAILABILITY

We commit to maintaining 99.5% uptime for all managed services and hosted solutions, measured on a monthly basis, excluding scheduled maintenance windows.

2. RESPONSE TIMES

- Critical issues (service down): Response within 1 hour
- High priority (major feature impacted): Response within 4 hours
- Medium priority (minor feature impacted): Response within 8 business hours
- Low priority (general inquiries): Response within 24 business hours

3. SUPPORT HOURS

Standard support is available Monday to Friday, 08:00 - 18:00 SAST (South Africa Standard Time). Critical issue support is available 24/7 for clients on active monthly retainers.

4. SCHEDULED MAINTENANCE

Scheduled maintenance will be communicated at least 48 hours in advance and performed during off-peak hours (typically weekends or after 22:00 SAST).

5. INCIDENT MANAGEMENT

All incidents are tracked, documented, and reviewed. Post-incident reports are provided for critical issues within 48 hours of resolution.

6. SERVICE CREDITS

If we fail to meet the 99.5% uptime commitment, you are eligible for service credits:
- 99.0% - 99.5% uptime: 5% credit
- 98.0% - 99.0% uptime: 10% credit
- Below 98.0% uptime: 25% credit

Credits are applied to the following month''s invoice and must be requested within 30 days.

7. EXCLUSIONS

This SLA does not cover:
- Issues caused by factors outside our reasonable control (force majeure)
- Issues resulting from your equipment or third-party software
- Scheduled maintenance windows
- Beta or experimental features

8. DATA BACKUP

We perform daily automated backups of all managed data. Backups are retained for 30 days and can be restored upon request.

9. SECURITY

We implement industry-standard security measures including encryption in transit and at rest, regular security audits, and access controls.

10. CONTACT

For SLA-related inquiries or to request service credits, contact us at amrish@geek247.co.za.',
  '1.0',
  true
);
