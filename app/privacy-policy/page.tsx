import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-static";

const TITLE = "Privacy Policy";
const description =
  "Blend Property Group's POPI privacy notice, describing how personal information is collected, used, disclosed and safeguarded.";

export const metadata: Metadata = {
  title: TITLE,
  description,
};

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }];

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd items={breadcrumbItems} description={description} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm font-medium uppercase tracking-wide text-midpoint-grey-400">
          POPI Privacy Notice
        </p>

        <div className="mt-8 space-y-6 text-midpoint-grey-400">
          <p>
            The Blend Group comprises of a group of companies that share a holding company or subsidiary
            relationship, and which companies share various resources in order to deliver value product / services
            to our clients. In this privacy notice, when we refer to the Blend Group, we refer to one or more of the
            group companies as responsible parties.
          </p>
          <p>
            This privacy notice applies to Personal Information processed by the Blend Group for the purposes of
            offering its products and/or services.
          </p>
          <p>
            Blend Property Group has developed this privacy notice to inform our client (existing or potential),
            services providers, employees, applicants for employment, and any other Data Subject of how and why
            the Blend Group collects, uses, discloses and safeguards Personal Information of Data Subjects.
          </p>
          <p>
            The aim of this privacy notice is to demonstrate the Blend Group&apos;s commitment to compliance with
            the provisions of the Protection of Personal Information Act (&quot;POPIA&quot;) to safeguard Personal
            Information.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Privacy Statement</h2>
          <p>
            The Blend Group is committed to processing Personal Information in accordance with the below
            principles when collecting, recording, storing, disseminating, and destroying Personal Information, and
            responding to government requests for our users&apos; data:
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>We shall not contact/solicit you unless you have given us your consent to do so.</li>
            <li>
              We shall process information for a specific, lawful reason and only adequate, relevant information
              which is limited to the purposes for which the information is processed, and which relates to the
              functions or the activity of the Blend Group.
            </li>
            <li>
              We inform users upfront that we will be processing data in fulfilment of their requests. If you cancel
              your services with the Blend Group, we will delete or otherwise de-identify your Personal Information
              after the minimum storage periods required under our risk and statutory record-keeping periods have
              expired.
            </li>
            <li>
              We take measures to ensure data is kept safe and prevent loss of, damage to, or unauthorized
              destruction of Personal Information, and unlawful access to or processing of Personal Information.
            </li>
          </ol>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Personal Information being collected</h2>
          <p>
            Name, Surname, Gender, Identity number, Nationality, Race, Contact information (residential address,
            postal address, email, telephone number) Curriculum Vitae, Academic records, qualifications, references
            from previous responsible parties, performance information, bank account details, salary information,
            number of dependents, competence requirements, reference check, criminal checks, credit checks, credit
            card information.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Source of information</h2>
          <p>
            We collect Personal Information directly from you as the Data Subject. We collect your Personal
            Information in several ways which may include:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Submission through our website;</li>
            <li>Correspondence through email or mobile applications;</li>
            <li>Phone Calls in which content is submitted or entered into a record;</li>
            <li>Social Media Platforms;</li>
            <li>Completion of paper-based information sheets;</li>
            <li>
              While you use this website, we may collect your Personal Information, or you may provide it to us (for
              example by enquiring or subscribing to our vacancy schedules). For example, your name, email
              address or telephone number;
            </li>
            <li>
              To send you an offer or invoice — we may collect your publicly available Personal Information from
              the Internet. For example, your address or VAT registration number;
            </li>
            <li>
              For leasing purposes, we are required by law to verify the identity of our clients, and tenant, so we
              may ask you to provide us with various Personal Information;
            </li>
            <li>
              For leasing purposes, we perform credit checks to confirm your credit and payment history, and verify
              your banking details;
            </li>
            <li>
              For security purposes we may require your Personal Information prior to giving access to our
              buildings. For example, your name, identity number, email address, telephone number, vehicle
              registration number, CCTV footage;
            </li>
            <li>
              To comply with Disaster Management Regulation we require Personal Information like your name,
              telephone number, e-mail address, temperature etc;
            </li>
            <li>
              To consider a job application, we may collect Contact Information, Curriculum Vitae, Academic
              records, qualifications, references from previous responsible parties, performance information, salary
              information, reference check, competence requirements, criminal checks;
            </li>
            <li>
              For employment relations we may collect Contact Information, number of dependents, bank account
              details, competence requirements.
            </li>
          </ul>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Use of Cookies</h2>
          <p>
            A cookie is a string of information that a website stores on a visitor&apos;s computer, and that the
            visitor&apos;s browser provides to the website each time the visitor returns. The Blend Group uses
            cookies to help identify and track visitors, their usage of the Blend Group&apos;s services, and their
            website access preferences. The Blend Group visitors who do not wish to have cookies placed on their
            computers should set their browsers to refuse cookies before using the Blend Group&apos;s websites,
            which may not function properly without the aid of cookies.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Email Inspection</h2>
          <p>
            We will inspect all emails you contact us with via email addresses registered to the Blend Group. We do
            this to check for viruses and reserve the right to monitor and inspect all material and information
            transmitted over our system. We may also monitor whether you read emails.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">How we use your Personal Information</h2>
          <p>We may use your Personal Information to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>respond to your enquiries;</li>
            <li>general communication;</li>
            <li>for operational purposes;</li>
            <li>verify your identity;</li>
            <li>credit checks;</li>
            <li>FICA compliance and all other legislative compliance;</li>
            <li>prepare lease agreements and other general lease agreements and documents;</li>
            <li>prepare offers;</li>
            <li>prepare mandates;</li>
            <li>process debit orders and payment instructions;</li>
            <li>provide you with our services;</li>
            <li>enforce and collect on any agreement when you are in default or breach;</li>
            <li>for audit and record keeping purposes;</li>
            <li>improve our service to you by analysing it for trends;</li>
            <li>send you updates on tenant related information;</li>
            <li>
              send you marketing material (including vacancy schedules) relating to other solutions you might be
              interested in. You can unsubscribe from our newsletter at any time by e-mailing{" "}
              <a href="mailto:info@blendproperty.co.za" className="text-midpoint-dark underline">
                info@blendproperty.co.za
              </a>
              , and thereafter we will not market to you;
            </li>
            <li>share information with companies within the Blend Group, and third parties in order to provide products and services;</li>
            <li>
              enable our systems to access, scan, and transport your Personal Information within the Blend Group or
              to a hosted third-party site;
            </li>
            <li>to verify, appoint and enter into agreements with service providers for the delivery of services;</li>
            <li>
              to verify, prepare and manage property management agreements, sale agreements and other
              commercial agreements;
            </li>
            <li>to comply with relevant legislation, e.g. Broad Based Black Economic Empowerment Bill;</li>
            <li>
              for employment purposes, including screening potential applicants and managing the continued
              employer/employee relationship.
            </li>
          </ul>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Security</h2>
          <p>
            A user has a right to object to the use of Personal Information, however in certain instances failure to
            provide us with Personal Information may result in the inability to deliver said services or products to
            you, or alternatively, you shall receive limited services. The Blend Group collects information directly
            from you where you provide us with your Personal Information. In addition to the aforementioned we
            shall, subject to your consent, obtain further Personal Information required from third parties and other
            sources where necessary. The Blend Group does not collect and process special Personal Information
            unless it is a requirement by law to process such information as part of our service delivery, in which
            case we shall obtain consent from you before collection thereof. We do not knowingly collect Personal
            Information from children (under 18 years of age) without the permission of their parent/s or guardian.
          </p>
          <p>
            We take all reasonable and appropriate measures to keep your Personal Information secure. For example,
            we encrypt our laptops and our phones. Access to Personal Information from within our organisation is
            limited to essential staff or specialist contractors that are required to access our systems for client
            service or maintenance purposes, who are bound by the requirements of the legislation and are required
            to maintain safety and security measures. However, we cannot guarantee the absolute security of it. We
            back-up all your Personal Information on a regular basis.
          </p>
          <p>We will review and update our security measures in accordance with future legislation and technological advances.</p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Disclosure</h2>
          <p>
            The Blend Group and its employees may disclose Personal Information: to other services providers or
            agents involved in the rendering of services or the provision of products to our clients; to services
            providers the Blend Group is in engaged with such as accountants, compliance officers, attorneys,
            administrators etc. or if a company with the Blend Group has a duty or a right to disclose same in terms
            of law or certain industry codes; or if it is necessary to protect the Blend Group&apos;s legal rights and
            interests.
          </p>
          <p>
            The Blend Group will not transfer Personal Information to a third party in a foreign country without
            ensuring that it complies with the provisions of POPI.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Policy Changes</h2>
          <p>
            This notice was last revised on 7 June 2022. Any material changes hereto will be published on our
            website or distributed to clients in writing. Your continued use of our services following the update
            means that you accept the Blend Group&apos;s updated notice.
          </p>

          <h2 className="pt-4 text-2xl font-bold text-midpoint-dark">Questions or Complaints</h2>
          <p>
            Should you have any questions relating to this notice or wish to lodge a complaint relating to an
            interference with the protection of Personal Information; or wish to access or correct your Personal
            Information, you can contact the Information Officer. Our Information Officer is: Mark Corbishley
            (Chairman) at{" "}
            <a href="mailto:legal@blendproperty.co.za" className="text-midpoint-dark underline">
              legal@blendproperty.co.za
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
