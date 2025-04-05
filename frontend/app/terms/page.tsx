import React from "react";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import { ArrowUp } from 'lucide-react';

const TermContent = () => {
  return (
    <div className="">
      <section className="container ">
        <div className="h-60 max-w-full bg-muted flex justify-center items-center flex-col mb-6">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-2">
            Terms of Service.
          </h2>
          <p>Published and Effected in April 2, 2025</p>
        </div>
        <div className="max-w-2xl mx-auto mb-6 px-4">
          <p className="text-sm">
            {" "}
            Welcome to SplitWise. By accessing or using our website and
            services, you agree to these Terms and Conditions. If you do not
            agree, please do not use our services.
          </p>
          <h3 className="text-xl font-bold  mt-4 ">1. Introduction</h3>
          <p className="my-2 text-sm">
            SplitWise is a platform that helps users track shared expenses and
            split bills among groups. We do not process payments or facilitate
            financial transactions. Our platform is for informational purposes
            only.{" "}
          </p>
          <h3 className="text-xl font-bold  mt-4 "> 2. Eligibility</h3>
          <p className="my-2 text-sm">
            You must be at least 18 years old to use our services. By creating
            an account, you confirm that you have the legal capacity to agree to
            these terms.
          </p>
          <h3 className="text-xl font-bold  mt-4 ">3. User Responsibilities</h3>
          <p className="my-2 text-sm">
            {" "}
            You must provide accurate information when creating an account. You
            are responsible for all activities under your account. You must not
            engage in fraudulent or illegal activities while using our platform.
            Any disputes regarding expenses must be resolved between the
            involved users; we do not mediate disputes.
          </p>
          <h3 className="text-xl font-bold  mt-4 ">
            {" "}
            4. Account Registration & Security
          </h3>
          <p className="my-2 text-sm">
            {" "}
            You are responsible for maintaining the security of your account
            credentials. We are not liable for unauthorized access due to your
            negligence in safeguarding login details.{" "}
          </p>
          <h3 className="text-xl font-bold  mt-4 ">
            5. Expense Tracking & Payment Disclaimer
          </h3>
          <p className="my-2 text-sm">
            Our platform only tracks and organizes shared expenses; we do not
            handle actual payments or money transfers. We are not responsible
            for any discrepancies in expense calculations or reimbursements.
            Users acknowledge that they use the service at their own risk.
          </p>
          <h3 className="text-xl font-bold  mt-4 ">
            {" "}
            6. Intellectual Property
          </h3>
          <p className="my-2 text-sm">
            {" "}
            All content, including the website’s design, text, and
            functionality, belongs to SplitWise. You may not copy, modify,
            distribute, or exploit any part of our website without our written
            consent.{" "}
          </p>
          <h3 className="text-xl font-bold  mt-4 ">7. Privacy Policy</h3>
          <p className="my-2 text-sm">
            {" "}
            We collect and store user data in accordance with our Privacy
            Policy. By using our services, you consent to our data collection
            practices. [Provide a link to your Privacy Policy]{" "}
          </p>
          <h3 className="text-xl font-bold  mt-4 ">
            8. Limitation of Liability{" "}
          </h3>
          <p className="my-2 text-sm">
            We are not responsible for: Any financial loss due to incorrect
            expense tracking or user disputes. Any errors, service
            interruptions, or technical issues. Any unauthorized access to your
            account caused by security breaches outside our control.
          </p>
          <h3 className="text-xl font-bold  mt-4 ">
            9. Termination of Accounts{" "}
          </h3>
          <p className="my-2 text-sm">
            We reserve the right to suspend or terminate accounts that violate
            these terms. Users may request account deletion at any time. 10.
            Changes to Terms We may update these Terms and Conditions from time
            to time. Continued use of our service after updates constitutes
            acceptance of the revised terms.
          </p>
          <h3 className="text-xl font-bold  mt-4 "> 11. Governing Law</h3>
          <p className="my-2 text-sm">
            {" "}
            These terms are governed by the laws of Nigeria. Any disputes shall
            be resolved in the applicable jurisdiction.
          </p>
          <h3 className="text-xl font-bold  mt-4 ">12. Contact Information</h3>
          <p className="my-2 text-sm">  
    For any questions regarding these Terms and Conditions, please contact us at   
    <Link href="mailto:splitwise@gmail.com">  
        <i className="font-bold"> splitwise@gmail.com</i>  
    </Link>.  
</p> 
        </div>
        <hr className="max-w-3xl mx-auto" />
        <div className="max-w-2xl mx-auto mb-6 px-4">
          <p className="my-2 text-sm">
            By using SplitWise, you acknowledge that you have read and agreed to
            these Terms and Conditions.
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
function Terms() {
  return (
    <div>
      <Navbar />
      <main className="flex-1">
        <TermContent />
      </main>
    </div>
  );
}

export default Terms;
