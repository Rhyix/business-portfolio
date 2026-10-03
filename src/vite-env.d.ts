/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Web3Forms access key for the contact form.
   *
   * This is **not** a password or an SMTP credential, and it is deliberately
   * client-visible: the form posts straight from the browser to the managed
   * provider, so the key ships in the bundle by design. It authorises exactly
   * one thing — delivering a submission to the address the key is registered
   * against — and cannot read mail, change the destination or send anywhere
   * else. Never put a Gmail password, app password or SMTP secret here.
   *
   * Set it in `.env.local`, which git ignores. See `.env.example`.
   */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
