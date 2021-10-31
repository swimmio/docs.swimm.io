import React from 'react';
import PropTypes from 'prop-types'
import {SiteSettings} from '../../swimm.config.js';
import GetCurrentSwimmRelease, {GetSpecificSwimmRelease} from '../../swimm.versions.config.js';
import Link from '@docusaurus/Link';
import Emojione from 'react-emoji-render';

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
    segment: PropTypes.string,
}

SwimmVersion.defaultProps = {
    segment: 'full'
}

function SwimmLink(props) {
    var linkClass = props.big ? 'button button--secondary button--lg' : '';
    switch (props.target) {
        case 'slack':
            return (
                <Link  className={linkClass} to={SiteSettings.community.slack}>{props.text ? props.text : 'Community Slack Channel'}</Link>
            );
        case 'officeHours':
            return (
                <Link className={linkClass} to={SiteSettings.community.officeHours}>{props.text ? props.text : 'office hours'}</Link>
            );
        case 'conduct':
            return (
                <Link className={linkClass} to="/conduct">{props.text ? props.text : 'code of conduct'}</Link>
            );
        default:
            return (
                <Link className={linkClass} to={target}>{props.text}</Link>
            );
    }   
}

SwimmLink.propTypes = {
    target: PropTypes.string,
    text: PropTypes.string, 
    big: PropTypes.bool,
}

SwimmLink.defaultProps = {
    target: '',
    big: false,
}

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
    text: PropTypes.string,
    svg: PropTypes.bool,
}

SwimmMoji.defaultProps = {
    text: SiteSettings.emojiShortcuts.default,
    svg: true
}

function SwimmReleaseBlogPost(props) {
    var releaseInfo = GetSpecificSwimmRelease(props.version);
    var blogPost = releaseInfo.blog;

    if (blogPost === null)
        return null;
    else
        return (
            <>
            <p><b>We have an even more detailed post about this release <Link href={blogPost}>on our main blog</Link>, 
            which we really hope you enjoy!</b></p>
            </>
        );
}

SwimmReleaseBlogPost.propTypes = {
    version: PropTypes.string
}

SwimmReleaseBlogPost.defaultProps = {
    version: GetCurrentSwimmRelease(),
}

export {
    Swimm as default,
    SwimmVersion,
    SwimmLink,
    SwimmMoji,
    SwimmReleaseBlogPost,
}