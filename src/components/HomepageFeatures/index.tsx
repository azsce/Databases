import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  const imageUrl = useBaseUrl('/img/favicon.png');
  
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--4')}>
            <Link to="/docs/intro" className={styles.courseCard}>
              <div className={styles.courseImageContainer}>
                <img src={imageUrl} alt="Database" className={styles.courseImage} />
              </div>
              <div className={styles.courseContent}>
                <Heading as="h3">Database</Heading>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
