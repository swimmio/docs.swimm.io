import React from 'react';
import PropTypes from 'prop-types'
import {SiteSettings} from '../../swimm.config.js';
import GetCurrentSwimmRelease, {GetSpecificSwimmRelease} from './SwimmVersions.js';
import Link from '@docusaurus/Link';
import Emojione from 'react-emoji-render';
import {TwitterTweetEmbed} from 'react-twitter-embed';
import YouTubePlayer from './YouTubePlayer.js';
import styles from './SwimmUtils.module.css';

function Swimm(props) {
    var index = props || 'version';
    return SiteSettings[index];
}

Swimm.propTypes = {
    index: PropTypes.string
}

Swimm.defaultProps = {
    index: 'version'
}

/**
 * Provides Swimm current version information in a variety of formats.
 * @param {*} props 
 * @returns string 
 */
function SwimmVersion(props) {
    var index = props.segment || 'full';
    switch (index) {
        case 'major':
            return SiteSettings.version.major;
        case 'minor':
            return SiteSettings.version.minor;
        case 'patch':
            return SiteSettings.version.patch;
        case 'full':
            return SiteSettings.version.major + '.' 
                + SiteSettings.version.minor + '.' 
                + SiteSettings.version.patch;
        default:
            return null;
    }
}

SwimmVersion.propTypes = {
    /* Which part of the version string do you need, or all of it? */
    segment: PropTypes.string,
}

SwimmVersion.defaultProps = {
    segment: 'full'
}

/**
 * Wraps the Docusaurus <Link> component to produce commonly-used links, 
 * or whatever you pass to it. See use in src/pages/community.mdx for examples, 
 * or in the changelog entries.
 * 
 * Example:
 * 
 * <SwimmLink target="slack" big />
 * 
 * Actually renders as:
 * 
 * <Link className="button button--secondary button--lg" href="https://swimm.io/slack">Community Slack Channel</Link>
 * 
 * @param {*} props 
 * @returns Link component 
 */
function SwimmLink(props) {
    var linkClass = props.big ? 'button button--primary button--lg' : '';
    switch (props.target) {
        case 'slack':
            return (
                <Link className={linkClass} to={SiteSettings.community.slack}>{props.text ? props.text : 'Community Slack Channel'}</Link>
            );
        case 'officeHours':
            return (
                <Link className={linkClass} to={SiteSettings.community.officeHours}>{props.text ? props.text : 'office hours'}</Link>
            );
        case 'conduct':
            return (
                <Link className={linkClass} to="/conduct">{props.text ? props.text : 'code of conduct'}</Link>
            );
        case 'stackOverflowTag':
            return (
                <Link className={linkClass} href="https://stackoverflow.com/questions/tagged/swimm">{props.text ? props.text : 'Swimm tag on Stack Overflow'}</Link>
            );
        case 'stackOverflowAsk':
            return (
                <Link className={linkClass} href="https://stackoverflow.com/questions/ask?tags=swimm">{props.text ? props.text : 'ask a question about Swimm on Stack Overflow'}</Link>
            );
        default:
            return (
                <Link className={linkClass} to={props.target}>{props.text}</Link>
            );
    }   
}

SwimmLink.propTypes = {
    /* Where the link should go. Store frequently-used links in the function. */
    target: PropTypes.string,
    /* What should the link text be? */
    text: PropTypes.string,
    /* If set, make the link a button */ 
    big: PropTypes.bool,
}

SwimmLink.defaultProps = {
    target: '',
    big: false,
}

/**
 * Print arbitrary, or pre-defined strings of fun emoji!
 * Pre-defined strings exist in swimm.config.js
 * 
 * Example: <SwimmMoji text=":tada:"/> renders the "tada" emoji.
 * Example: <SwimmMoji text="release" renders the string of emoji stored in the config
 * Example: <SwimmMoji /> will render ":ocean:", which is currently the config-defined default
 * 
 * @param {*} props 
 * @returns string
 */
function SwimmMoji(props) {
    var slug = props.text;
    var useSvg = props.useSvg;
    var emojiConfig = SiteSettings.emojiShortcuts;

    if (typeof(emojiConfig[slug]) != "undefined")
        var text = emojiConfig[slug];
    else
        var text = slug;
    switch (useSvg) {
        case true:
            return(<Emojione svg text={text} />);
        default:
            return(<Emojione text={text} />);
    }
}

SwimmMoji.propTypes = {
    /* Emoji to print, or name of pre-defined string */ 
    text: PropTypes.string,
    /* Whether to use svg (for open emoji this is always better) */
    svg: PropTypes.bool,
}

SwimmMoji.defaultProps = {
    text: SiteSettings.emojiShortcuts.default,
    svg: true
}

/**
 * Helper to check version config to see if a blog post on the main site is 
 * associated with release notes that were published in the changelog. If so,
 * it'll render a link.
 * 
 * @param {*} props 
 * @returns string
 */
function SwimmReleaseBlogPost(props) {
    var releaseInfo = GetSpecificSwimmRelease(props.version);
    var blogPost = releaseInfo.blog;
    var linkText = `Get The Full ${releaseInfo.name} Scoop On Our Main Blog \u{000BB}`;
    if (blogPost === null)
        return null;
    else
        return (
            <>
            <div className={styles.releaseBlogLink}>
                <SwimmLink target={blogPost} text={linkText} big />
            </div>
            </>
        );
}

SwimmReleaseBlogPost.propTypes = {
    /* The Swimm version number associated with the release, e.g. '0.1.2' */
    version: PropTypes.string
}

SwimmReleaseBlogPost.defaultProps = {
    /* If called with no arguments, the current release is checked. */
    version: GetCurrentSwimmRelease(),
}

/**
 * Helper to check version config to see if a tweet from our Twitter
 * account is associated with a release, and if so, embed it in the release notes.
 * 
 * @param {*} props 
 * @returns string
 */
 function SwimmReleaseTweet(props) {
    var releaseInfo = GetSpecificSwimmRelease(props.version);
    var tweet = releaseInfo.tweet;
    if (tweet === null)
        return null;
    else
        return (
            <>
            <p>We have a thread about this release going on Twitter, if you'd like to join in:</p>
            <TwitterTweetEmbed tweetId={tweet} />
            </>
        );
}

SwimmReleaseTweet.propTypes = {
    /* The Swimm version number associated with the release, e.g. '0.1.2' */
    version: PropTypes.string
}

SwimmReleaseTweet.defaultProps = {
    /* If called with no arguments, the current release is checked. */
    version: GetCurrentSwimmRelease(),
}

function SwimmReleaseVideo(props) {
    var releaseInfo = GetSpecificSwimmRelease(props.version);
    var video = releaseInfo.youtube;
    if (video != null) {
        return(
            <>
            <p><b>Release notes are below this short feature spotlight:</b></p>
            <YouTubePlayer id={video} />
            </>
        );
    }
    return null;
}

SwimmReleaseVideo.propTypes = {
    version: PropTypes.string,
}

SwimmReleaseVideo.defaultProps = {
    version: GetCurrentSwimmRelease(),
}

function SwimmReleaseLinkedIn(props) {
    var releaseInfo = GetSpecificSwimmRelease(props.version);
    var linkedin = releaseInfo.linkedin;
    if (linkedin != null) {
        return(
            <>
            <iframe 
                src={linkedin} 
                height="600" 
                width="500" 
                frameborder="0" 
                allowfullscreen="" 
                title="Embedded post">
            </iframe>
            </>
        );
    }
    return null;  
}

SwimmReleaseLinkedIn.propTypes = {
    version: PropTypes.string,
}

SwimmReleaseLinkedIn.defaultProps = {
    version: GetCurrentSwimmRelease(),
}

export {
    Swimm as default,
    SwimmVersion,
    SwimmLink,
    SwimmMoji,
    SwimmReleaseBlogPost,
    SwimmReleaseTweet,
    SwimmReleaseVideo,
    SwimmReleaseLinkedIn,
}
