import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Continuous Documentation',
    Svg: require('../../static/img/01_continuousDocumentation.svg').default,
    description: (
      <>
        It's easy to set up Swimm to run on your continuous 
        integration server so that your documentation remains always up-to-date.
      </>
    ),
    link_title: 'Find Out How',
    link_href: '/docs/continuous-integration/continuous-documentation'
  },
  {
    title: 'Swimm\'s IDE Plugins',
    Svg: require('../../static/img/02_idePlugIn.svg').default,
    description: (
      <>
        Put beautiful, media-rich documentation right where your engineers need it, 
        directly inline with the code that needs explaining.  
      </>
    ),
    link_title: 'See What\'s Supported',
    link_href: '/docs/ide-integrations/ide-plugins'
  },
  {
    title: 'Knowledgebase Integrations',
    Svg: require('../../static/img/03_knowledgebaseIntegrations.svg').default,
    description: (
      <>
        Learn how to bring Swimm documentation to your internal knowledge platforms,
        like Confluence and Notion.
      </>
    ),
    link_title: 'Learn More',
    link_href: '/docs/publishing-content/third-party'
  },
  {
    title: 'Documentation Strategies',
    Svg: require('../../static/img/04_docuStrategies.svg').default,
    description: (
      <>
        Discover strategies to break down documentation debt into smaller,
        accomplishable units that everyone can help with. 
      </>
    ),
    link_title: 'Let\'s Tackle It!',
    link_href: '/documentation-strategies'
  },
  {
    title: 'Swimm Developer Community',
    Svg: require('../../static/img/05_DevCommunity.svg').default,
    description: (
      <>
        Swimm is language-agnostic and has users all over the world from all 
        walks of the industry. Here are ways you can connect, chat and ask 
        questions.
      </>
    ),
    link_title: 'Community Matters',
    link_href: '/community'
  },
  {
    title: 'Contribute To This Site',
    Svg: require('../../static/img/06_Contribution.svg').default,
    description: (
      <>
        Would you like to help translate this site or contribute a blog post
        or tutorial? We're very glad you're here and can't wait to meet you!
      </>
    ),
    link_title: 'Contributor Information',
    link_href: '/contribute'
  },
];

function Feature({Svg, title, description, link_title, link_href}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        <p><a href={link_href}>{link_title}</a>&nbsp;&raquo;</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
