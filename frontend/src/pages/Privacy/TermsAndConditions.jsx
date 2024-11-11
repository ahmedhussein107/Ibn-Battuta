import React from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import usePageHeader from "../../components/Header/UseHeaderPage";

const TermsAndConditions = () => {
    usePageHeader(null, null);

    return (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
            <div
                style={{
                    width: "100vw",
                    height: "45vh",
                    //backgroundImage: `url(${activitiesBackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(236, 235, 224)",
                }}
            >
                <h1
                    style={{
                        padding: "25vh 4vw", // Reduces top padding
                        fontSize: "3.2vh",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "2vh",
                    }}
                >
                    Terms and Conditions
                </h1>
            </div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: "9%",
                    zIndex: 1,
                }}
            >
                <NavBar />
            </div>

            <div>
                <div
                    style={{
                        marginTop: "10vh", // Adjusts position of the title
                        padding: "1vh 4vw", // Reduces top padding
                        fontSize: "1.8vh",
                        color: "black",
                        maxWidth: "90vw",
                        textAlign: "left",
                        lineHeight: "1.6",
                    }}
                >
                    <p>
                        <strong>Last Updated:</strong> 4-11-2024
                    </p>

                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Ibn Battua, a virtual trip planner connecting tourists,
                        tour guides, advertisers, sellers, and tourism governors. By
                        accessing or using our services, you agree to comply with these
                        Terms and Conditions.
                    </p>

                    <h2>2. Eligibility and User Responsibilities</h2>
                    <p>
                        Users must be at least 18 years old or have parental consent to
                        use the platform. Tour guides, advertisers, sellers, and tourism
                        officials must provide accurate professional information as
                        required by the platform.
                    </p>
                    <p>
                        By registering as a user, you agree to provide true, accurate,
                        current, and complete information about yourself, including a
                        valid email address for verification purposes. You are responsible
                        for maintaining the confidentiality of your account information
                        and for any activities that occur under your account.
                    </p>

                    <h2>3. User Accounts and Authentication</h2>
                    <p>
                        <strong>Account Creation:</strong> Different user roles (Tourist,
                        Tour Guide, Advertiser, Seller, Tourism Governor) may require
                        unique information during registration.
                    </p>
                    <p>
                        <strong>Authentication:</strong> Users may log in using a username
                        and password. Password changes are allowed, and in cases of
                        forgotten passwords, users can reset their password via OTP sent
                        to their registered email.
                    </p>
                    <p>
                        <strong>Account Restrictions:</strong> The platform reserves the
                        right to suspend or terminate any account that breaches these
                        terms or misuses the platform.
                    </p>

                    <h2>4. Data Privacy and Security</h2>
                    <p>
                        <strong>Personal Information:</strong> All personal data,
                        including email, username, and other identifiable details, will be
                        collected, processed, and stored in accordance with our Privacy
                        Policy.
                    </p>
                    <p>
                        <strong>Data Use:</strong> Your data will only be used to enhance
                        user experience, verify identities, and provide relevant services,
                        such as notifying users about itineraries, activities, or relevant
                        updates.
                    </p>
                    <p>
                        <strong>Data Security:</strong> We implement standard security
                        protocols to protect user data; however, we do not guarantee
                        complete security and disclaim liability for any data breach that
                        may occur.
                    </p>

                    <h2>5. Content and Feature Use</h2>
                    <p>
                        <strong>Tourist Activities:</strong> Tourists may search for
                        itineraries, view ratings, and access tourist activities through
                        the platform.
                    </p>
                    <p>
                        <strong>Tour Guide, Advertiser, and Seller Activities:</strong>
                        Tour guides, advertisers, and sellers may post itineraries, offer
                        services, and advertise travel-related products. Itineraries may
                        also be sent to users via email as part of personalized
                        notifications.
                    </p>
                    <p>
                        <strong>Notification and Communication:</strong> Users may receive
                        notifications based on preferences and activities. By using the
                        platform, you consent to receive relevant communications via email
                        or within the platform.
                    </p>

                    <h2>6. Payments and Transactions</h2>
                    <p>
                        Any payments or transactions conducted on the platform, including
                        booking fees or service charges, are subject to third-party
                        payment processor terms and conditions. The platform disclaims
                        liability for payment processing errors and advises users to
                        directly address any payment disputes with the payment processor.
                    </p>

                    <h2>7. Prohibited Conduct</h2>
                    <p>
                        Users are prohibited from engaging in activities that compromise
                        the platform’s security, including, but not limited to, hacking,
                        phishing, spamming, and spreading malicious content. Unauthorized
                        access, modification, or sharing of another user’s account or data
                        is strictly forbidden.
                    </p>
                    <p>
                        Misrepresentation of identity, qualifications, or association with
                        any entity is prohibited and may lead to account suspension or
                        legal action.
                    </p>

                    <h2>8. Limitation of Liability</h2>
                    <p>
                        The platform disclaims liability for any direct, indirect, or
                        incidental damages resulting from the use or inability to use the
                        services, including damages for lost data or unauthorized account
                        access.
                    </p>
                    <p>
                        The platform is not liable for any content or interactions between
                        users and disclaims responsibility for the conduct of tour guides,
                        advertisers, sellers, or any third-party services offered through
                        the platform.
                    </p>

                    <h2>9. Termination and Suspension of Accounts</h2>
                    <p>
                        We reserve the right to suspend or terminate any account at our
                        discretion if a user is found to be in violation of these Terms
                        and Conditions or engages in prohibited conduct. Terminated users
                        will be notified via email, and any further attempts to access the
                        platform will be blocked.
                    </p>

                    <h2>10. Modifications to Terms and Services</h2>
                    <p>
                        The platform reserves the right to modify these Terms and
                        Conditions at any time. Users will be notified of any significant
                        changes via email or through the platform. Continued use of the
                        platform following any changes signifies acceptance of the
                        modified terms.
                    </p>

                    <h2>11. Governing Law</h2>
                    <p>
                        These Terms and Conditions shall be governed by and interpreted in
                        accordance with the laws of Egypt. Any legal action or proceeding
                        related to the use of the platform will be brought in a court of
                        competent jurisdiction within that region.
                    </p>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default TermsAndConditions;
