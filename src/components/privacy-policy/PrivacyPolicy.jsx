import React from 'react';
import './Privacy.css'
const privacyPolicyData = {
  title: "Privacy Policy",
  introduction: "Welcome to DailyIQ. This Privacy Policy explains how we collect, use, and protect your information when you use our website and related services. By accessing or using our services, you agree to the terms of this Privacy Policy.",
  sections: [
    {
      title: "1. Definitions",
      content: "\"We\", \"Our\", \"Us\", and \"Company\" shall mean and refer to DailyIQ. \"You\" or \"User\" refers to anyone accessing or using our website. \"Personal Information\" means any data that identifies you, such as your name, email address, phone number, or payment details. \"Third Parties\" refers to any entities apart from the user and DailyIQ."
    },
    {
      title: "2. Overview",
      content: "We respect your privacy and are committed to protecting your personal data. This includes information such as your name, address, contact details, payment information, and usage data collected when you use our website and services."
    },
    {
      title: "3. Information We Collect",
      content: "We may collect personal and non-personal information, including but not limited to your contact details, demographic data, browsing activity, IP address, device information, and transaction history."
    },
    {
      title: "4. How Information Is Collected",
      content: "We collect information directly when you provide it (such as through registration or forms), and indirectly through cookies, analytics, and your interactions with our website."
    },
    {
      title: "5. Use of Your Information",
      content: "Your information may be used to provide and improve our services, communicate with you, ensure compliance with applicable laws, prevent fraud, and deliver personalized experiences and offers."
    },
    {
      title: "6. Cookies",
      content: "DailyIQ uses cookies and similar technologies to improve functionality, store preferences, and analyze usage. You can control cookie settings through your browser."
    },
    {
      title: "7. Confidentiality & Disclosure",
      content: "Your information is kept confidential and will not be disclosed unless required by law or with your consent. However, in certain situations, we may share data with regulators, law enforcement, or trusted service providers."
    },
    {
      title: "8. Security",
      content: "We implement industry-standard security measures to protect your data against unauthorized access, misuse, or disclosure. However, no system can guarantee absolute security."
    },
    {
      title: "9. Data Retention",
      content: "We retain personal data only as long as necessary for the purposes described in this policy, unless a longer period is required by law."
    },
    {
      title: "10. Children’s Privacy",
      content: "Our services are not intended for children under 13. We do not knowingly collect information from children. If such information is discovered, it will be deleted promptly."
    },
    {
      title: "11. Third-Party Links",
      content: "Our website may link to third-party sites. DailyIQ is not responsible for the privacy practices or content of external websites."
    },
    {
      title: "12. International Data Transfers",
      content: "Your information may be processed in countries outside your jurisdiction, including India, where data protection laws may differ from your own."
    },
    {
      title: "13. Your Rights",
      content: "You may have rights to access, correct, delete, restrict, or transfer your personal data, and to withdraw consent where applicable. Contact us to exercise these rights."
    },
    {
      title: "14. Compliance with Laws",
      content: "All users must comply with applicable data protection and IT laws while using our services."
    },
    {
      title: "15. Delete Your Personal Data",
      content: [
        "You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.",
        "Our Service may give You the ability to delete certain information about You from within the Service.",
        "You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.",
      ]
    },
    {
      title: "16. Updates to this Policy",
      content: "We may update this Privacy Policy from time to time. Changes will be posted on this page, and continued use of our services indicates acceptance of updates."
    },
    {
      title: "17. Contact Us",
      content: "If you have any questions, please reach out to us at ",
      email: "contact@dailyiq.com"
    }
  ],
  footer: {
    effectiveDate: "The Privacy Policy is effective from the date you first use DailyIQ services."
  }
};

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy max-w-[900px] mx-auto text[#333]">
      <h1 className='text-center font-arial font-bold mb-[20px] leading-[44px] text-[#222] text-[38px]'>{privacyPolicyData.title}</h1>
      <p className='mb-[10px] leading-[1.6] font-arialR'>{privacyPolicyData.introduction}</p>

      {privacyPolicyData.sections.map((section, index) => (
        <section key={index} className="mb-[20px]">
          <h2 className='font-arial text-[32px] font-bold text-[#222] leading[36px]'>{section.title}</h2>
          {Array.isArray(section.content) ? (
            section.content.map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <p className='font-arialR'>
              {section.title.includes("Contact Us") && section.email ? (
                <>
                  {section.content}
                  <a className='underline hover:text-[#2d50ef] text-[#1032cf]' href={`mailto:${section.email}`}>{section.email}</a>.
                </>
              ) : (
                section.content
              )}
            </p>
          )}
        </section>
      ))}

      <footer>
        <p><strong>Effective Date:</strong> {privacyPolicyData.footer.effectiveDate}</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
