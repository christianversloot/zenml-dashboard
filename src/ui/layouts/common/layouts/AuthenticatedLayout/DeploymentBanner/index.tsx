import React from 'react';
import styles from './styles.module.scss';

function DeploymentBanner() {
  return (
    <aside className={styles.deploymentBanner}>
      <p className={styles.deploymentBanner__paragraph}>
        This is a demo version of the ZenML dashboard. To deploy your own, you
        need to{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.zenml.io/user-guide/starter-guide/switch-to-production"
        >
          deploy ZenML yourself
        </a>
        , or get a hosted version with{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://zenml.io/cloud"
        >
          {' '}
          ZenML Cloud
        </a>
        .
      </p>
    </aside>
  );
}

export default DeploymentBanner;
