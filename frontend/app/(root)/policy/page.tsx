import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const PolicyContent = () => {
  return (
    <div className="">
      <section className="container ">
        <div className="h-60 bg-muted flex justify-center items-center flex-col mb-6">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-2">
            Privacy Policy.
          </h2>
          <p>Published and Effected in April 2, 2025</p>
        </div>
        <div className="max-w-2xl mx-auto mb-6 px-4">
          <p>
            Welcome to SplitWise. Your privacy is important to us. This Privacy
            Policy explains how we collect, use, and protect your personal
            information when you use our website and services.
          </p>
          <h3 className="text-xl font-bold mt-4 ">1. Information We Collect</h3>
          <p className="my-2">
            When you use SplitWise, we may collect the following types of
            information:
          </p>
          <ul className="my-2 pl-5 list-disc">
            <li>
              <span className="font-bold">Personal Information</span>: Name,
              email address, and any details you provide during account
              registration.
            </li>
            <li>
              <span className="font-bold">Expense Data</span>: Transaction
              details, amounts, and shared expenses for tracking purposes.
            </li>
            <li>
              <span className="font-bold">Technical Data</span>: IP address,
              browser type, device information, and cookies for improving user
              experience.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-4 ">
            2. How We Use Your Information
          </h2>
          <p className="my-2">We use collected information for:</p>
          <ul className="my-2 pl-5 list-disc">
            <li>Providing and improving our expense-tracking services.</li>
            <li>
              Sending notifications related to transactions and account
              activity.
            </li>
            <li>Enhancing security and preventing fraudulent activity.</li>
            <li>Analyzing usage patterns to improve our platform.</li>
          </ul>
          <h2 className="text-xl font-bold mt-4 ">
            3. Data Sharing and Third-Party Services
          </h2>
          <ul className="my-2 pl-5 list-disc">
            <li>We do not sell or rent user data to third parties.</li>
            <li>
              We may share data with service providers who help operate our
              platform (e.g., hosting, analytics) under strict confidentiality
              agreements.
            </li>
            <li>
              We may disclose information if required by law, legal proceedings,
              or to protect rights and security.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-4 ">
            4. Cookies and Tracking Technologies
          </h2>
          <ul className="my-2 pl-5 list-disc">
            <li>
              We use cookies and similar technologies to enhance user
              experience, track site usage, and remember preferences.
            </li>
            <li>
              Users can adjust cookie settings in their browser preferences.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-4 ">5. Data Security</h2>
          <ul className="my-2 pl-5 list-disc">
            <li>
              We implement industry-standard security measures to protect user
              data.
            </li>
            <li>
              However, no method of transmission over the internet is 100%
              secure. Users are responsible for safeguarding their account
              credentials.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-4 ">
            6. User Rights & Data Control
          </h2>
          <ul className="my-2 pl-5 list-disc">
            <li>
              <span className="font-bold">Access & Correction:</span> Users may
              request access to their personal data and update incorrect
              information.
            </li>
            <li>
              <span className="font-bold">Deletion:</span> Users can request
              account deletion, and we will remove personal data as permitted by
              law.
            </li>
            <li>
              <span className="font-bold">Opt-Out:</span> Users can opt out of
              marketing emails at any time.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-4 ">7. Children’s Privacy</h2>
          <p className="my-2">
            Our services are not intended for users under the age of 13. We do
            not knowingly collect data from children.
          </p>
          <h2 className="text-xl font-bold mt-4 ">
            8. Changes to This Privacy Policy
          </h2>
          <p className="my-2">
            We may update this Privacy Policy occasionally. Continued use of our
            services after updates constitutes acceptance of the revised policy.
          </p>
          <h2 className="text-xl font-bold mt-4 ">9. Contact Information</h2>
          <p className="my-2">
            If you have any questions about this Privacy Policy, please contact
            us at <i className="font-bold">splitwise@gmail.com</i>.
          </p>
        </div>
        <hr className="max-w-3xl" />
        <div className="max-w-2xl mx-auto mb-6 px-4">
          <p className="my-2">
            By using SplitWise, ou acknowledge that you have read and understood
            this Privacy Policy.
          </p>
        </div>
        <div className="flex justify-end my-8 mx-4">
          <Link href="/terms" className="bouncing-arrow">
            {" "}
            <ArrowUp />
          </Link>
        </div>
      </section>
    </div>
  );
};

function PolicyPage() {
  return (
    <main className="flex-1">
      <PolicyContent />
    </main>
  );
}

export default PolicyPage;
