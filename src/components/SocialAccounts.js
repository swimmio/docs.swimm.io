import React from 'react';
import clsx from 'clsx';
import { SocialIcon } from 'react-social-icons';
import styles from './SocialAccounts.module.css';

const SocialList = [
{
    label: "Twitter",
    social_url: "https://twitter.com/swimmio",
    metadata: (
        <>
        We love when people tweet about their experiences
        with Swimm! Follow us for updates and ways to get
        cool swag 😎
        </>
    ),
},
{
    label: "Github",
    social_url: "https://github.com/swimmio",
    metadata: (
        <>
        Code tutorials, utilities, and examples of open
        source projects using Swimm!
        </>
    ),
},
{
    label: "Stack Overflow",
    social_url: "https://stackoverflow.com/questions/tagged/swimm",
    metadata: (
        <>
        Ask and answer questions about Swimm! Please use Slack for
        bug reports and feature requests.
        </>
    ),
},
{
    label: "YouTube",
    social_url: "https://www.youtube.com/channel/UC-icYrmhtL3yYxaI0TnL7Lg",
    metadata: (
        <>
        Find tutorials, feature demos, exciting interviews and more on 
        our YouTube channel. 
        </>
    ),
},
{
    label: "LinkedIn",
    social_url: "https://linkedin.com/in/swimmio",
    metadata: (
        <>
        Keep up with news about the Swimm team, events, and in-depth
        writing about our industry from our unique vantage point. 
        </>
    ),
},
{
    label: "Facebook",
    social_url: "https://www.facebook.com/Swimm.io",
    metadata: (
        <>
        Informal updates and photos from SwimmHQ In Tel-Aviv and NYC.
        Please don't post support requests or bug reports on Facebook.
        </>
    ),
},
{
    label: "Instagram",
    social_url: "https://www.instagram.com/swimm.io/",
    metadata: (
        <>
        Our team, our dogs, and most importantly, our coffee.
        </>
    ),
},
];

function SocialCard({label, social_url, metadata}) {
    console.log(label, social_url);
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <SocialIcon url={"" + social_url + ""} style={{height: 100, width: 100}} label={"" + label + ""} />
            </div>
            <div className="text--center padding-horiz--md">
                <p>{metadata}</p>
            </div>
        </div>
    );
}

export default function ListSocialAccounts() {
    return (
        <section className={styles.socialCard}>
            <div className="container">
                <div className="row">
                    {SocialList.map((props, idx) => (
                        <SocialCard key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}