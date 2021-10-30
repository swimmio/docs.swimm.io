import PropTypes from 'prop-types'
import React from 'react';
import {SiteSettings} from '../../swimm.config.js';
import styles from './SwimmUtils.module.css';
import Link from '@docusaurus/Link';

function Swimm(props) {
    return null;
}

function SwimmVersion(props) {
    switch (props.semVer) {
        case 'major':
            return SiteSettings.version.major;
        case 'minor':
            return SiteSettings.version.minor;
        case 'patch':
            return SiteSettings.version.patch;
        case 'codename':
            return SiteSettings.version.codename;
        default:
            return SiteSettings.version.major + '.' 
                + SiteSettings.version.minor + '.' 
                + SiteSettings.version.patch + 
                SiteSettings.version.codename ? SiteSettings.version.codename : '';
    }
}

function SwimmLink(props) {
    switch (props.target) {
        case 'slack':
            return (
                <Link to={SiteSettings.community.slack}>{props.text ? props.text : 'office hours'}</Link>
            );
        case 'officeHours':
            return (
                <Link to={SiteSettings.community.officeHours}>{props.text ? props.text : 'office hours'}</Link>
            );
        default:
            return null;
    }   
}

Swimm.propTypes = {
    emoji: PropTypes.string,
}
SwimmVersion.propTypes = {
    semVer: PropTypes.string,
}

SwimmLink.propTypes = {
    target: PropTypes.string,
    text: PropTypes.string,
}

export {
    Swimm as default,
    SwimmVersion,
    SwimmLink,
}