import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import styles from './FrequentQuestions.module.css';

const config = {
    animate: true,
    arrowIcon: "V",
    tabFocus: true,
};

const FAQIndex = {
    Creating: {
        title: "",
        rows: [
            {
                title: "Why is a document in my workspace gray and unable to open?",
                content:
                    <p>
                        The document was created on a branch that has not yet been merged.
                        Swimm understands that the document exists, which is why you see it
                        listed, but the contents have yet to be pushed. It can also mean that
                        you are on a different branch - check the left-side of the UI to be sure.
                    </p>
            },
            {
                title: "Do Smart Tokens Understand Types?",
                content:
                    <p>
                        No. While it might *seem* like types are understood when changes to
                        tokens are automatically synced, Swimm is language agnostic and makes
                        decisions based on the entire context of any given change. 
                    </p>
            },
            {
                title: "Where Are Images Stored?",
                content:
                    <p>
                        Images that you upload through the editor are stored in a secure bucket
                        on our servers.
                    </p>
            },
        ],
    },
    Workspaces: {
        title: "",
        rows: [
            {
                title: "How Do I Create A Playlist That Steps Through Multiple Repositories?",
                content:
                    <p>
                        From your main workspace page, select "Workspace Playlist". This will
                        allow you to bring in docs and other playlists from any repositories in
                        the workspace.
                    </p>
            },
            {
                title: "How Do I Invite Someone To A Workspace?",
                content:
                    <p>
                        You can invite users, see pending invitations and manage your team by
                        clicking the "invite" link at the top-right of the main workspace page.
                    </p>
            },
        ],
    },
    Troubleshooting: {
        title: "",
        rows: [
            {
                title: "It Takes A Long Time For My Repositories To Load",
                content:
                    <p>
                        This can sometimes be due to Github (and others) experiencing slowness, or possibly
                        even trouble with your internet connection. Additionally, if you have many repositories
                        or membership in many organizations, it can take up to a minute. Unfortunately, we have
                        very little control over this, but if you feel like it's a chronic issue, please contact
                        support.
                    </p>
            },
            {
                title: "I Don't See Any Of My Repositories",
                content:
                    <p>
                        Make sure you signed in through Github using the account that is associated with the 
                        organization that owns the repositories. Check to be sure you have Swimm Auth configured
                        with permissions to read &amp; write to public and private repositories, and that you
                        enable access to the organization that owns the account with the code. 
                    </p>
            },

        ],
    },
    SignUpAndPermissions: {
        title: "",
        rows: [
            {
                title: "What Permissions Does Swimm Need To Operate?",
                content:
                    <p>
                        Swimm requires access to the organization that owns the code you wish to document (your
                        company, for instance) and at least access to public repositories. If the repositories 
                        you wish to document are private, Swimm will need access to private repositories as well.
                        We encourage you to just grant access to both public and private repositories to avoid
                        confusion later.
                    </p>
            },
            {
                title: "What Github Account Should I Use?",
                content:
                    <p>
                        Use the account associated with the organization you're working for. In almost all cases,
                        this is very likely to be your personal Github account, even if you received a workspace
                        invitation to your work email address.
                    </p>
            },  
        ],
    },
    Integration: {
        title: "",
        rows: [
            {
                title: "What OS Is Required For Swimm's CLI utilities?",
                content:
                    <p>
                        Any 64 bit GNU/Linux distribution Or MacOS (Big Sur) will work fine. We recommend Ubuntu
                        (LTS or latest), but any modern flavor should work.  
                    </p>
            },
            {
                title: "What's The Difference Between Swimm's Github App And Swimm's Github Action?",
                content:
                    <p>
                        Our Github app utilitizes our Github action, and provides additional functionality through
                        informative comments that help people understand what went wrong and what needs to be 
                        fixed. We recommend anyone using Github to use the app for the best possible experience, 
                        and because we're actively adding features to it.  
                    </p>
            },        
        ],
    },
};

export default function FrequentQuestions({Category, Index=FAQIndex}) {
    var data = Index[Category];
    return (
        <div>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
            <br />
        </div>
    );
}