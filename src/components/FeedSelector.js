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
                <a href="{siteConfig.url}/blog/rss.xml"><code>{siteConfig.url}/blog/rss.xml</code></a>
            </TabItem>
            <TabItem value="atom">
            <a href="{siteConfig.url}/blog/atom.xml"><code>{siteConfig.url}/blog/atom.xml</code></a>
            </TabItem>
        </Tabs>
    );
}