import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const DefaultFeedValue = "rss";
const FeedTypes = [ 
    {
        label: 'RSS',
        value: 'rss',
    },
    {
        label: 'Atom',
        value: 'atom',
    }
];

function FeedSelector() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Tabs groupId="FeedSelector" defaultValue={DefaultFeedValue} values={FeedTypes}>
            <TabItem value="rss">
                <code>{siteConfig.url}/changelog/rss.xml</code>
            </TabItem>
            <TabItem value="atom">
                <code>{siteConfig.url}/changelog/atom.xml</code>
            </TabItem>
        </Tabs>
    );
}

export {
    FeedSelector as default
}