import styles from './Footer.module.css'
import { Anchor } from '@mantine/core';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        Made with <img src="/netliheart.svg" alt="Netlify Logo" className={styles.logo} /> & ChatGPT by <Anchor href="https://github.com/scolear" target="_blank">robert tera</Anchor>
      </footer>
    </>
  )
}
