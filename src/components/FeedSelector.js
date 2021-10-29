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

function FeedLinkTab({label, value}) {
    var feedLabel = label || "RSS";
    var feedValue = value || "rss";
    const {siteConfig} = useDocusaurusContext();
    var feedUrl = siteConfig.url + '/blog/' + value + '.xml';
    console.log(feedValue, feedUrl);
    return (
        <TabItem value={feedValue}>
            <Link href={feedUrl}>{feedUrl}</Link>
        </TabItem>
    );
}

export function NewFeedSelector() {
    return (
        <Tabs groupId="NewFeedSelector"
        defaultValue={DefaultFeedValue} 
        values={FeedTypes}>

        {FeedTypes.map((props, idx) => (
           <FeedLinkTab key={idx} {...props} />
        ))}
        
        </Tabs>
    );
}

export default function FeedSelector() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Tabs groupId="FeedSelector"
            defaultValue="rss"
            values={[
                {label: 'RSS', value: 'rss'},
                {label: 'Atom', value: 'atom'},
         ]}>
            <TabItem value="rss">
                <code>{siteConfig.url}/blog/rss.xml</code>
            </TabItem>
            <TabItem value="atom">
                <code>{siteConfig.url}/blog/atom.xml</code>
            </TabItem>
        </Tabs>
    );
}