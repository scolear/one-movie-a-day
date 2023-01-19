import styles from './Footer.module.css'
import { Anchor } from '@mantine/core';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <img src="/githublogo.svg" alt="GitHub Logo" className={styles.logo} /><Anchor href="https://github.com/scolear" target="_blank">roberttera</Anchor>
      </footer>
    </>
  )
}
