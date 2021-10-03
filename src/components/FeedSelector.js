import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';


export default function FeedSelector() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Tabs 
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